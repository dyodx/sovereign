use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};
use mpl_core::{accounts::{BaseAssetV1, BaseCollectionV1}, fetch_plugin, instructions::{CreateV2CpiBuilder, UpdatePluginV1CpiBuilder}, types::{Attribute, Attributes, FreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair, PluginType}, ID as MPL_CORE_ID};
use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};
use groth16_solana::groth16::Groth16Verifier;

use crate::{constant::{GAME_SEED, NATION_STATES, PLAYER_SEED, WALLET_SEED}, error::SovereignError, state::{Bounty, BrokerEscrow, Game, Player, Wallet}, verifying_key::VERIFYINGKEY};
type G1 = ark_bn254::g1::G1Affine;

pub fn register_player(ctx: Context<RegisterPlayer>, args: RegisterPlayerArgs) -> Result<()> {
    ctx.accounts.player.game_id = ctx.accounts.game.id;
    ctx.accounts.player.authority = ctx.accounts.player_authority.key();
    ctx.accounts.player.x_username = args.x_username;

    ctx.accounts.player_wallet.game_id = ctx.accounts.game.id;
    ctx.accounts.player_wallet.authority = ctx.accounts.player_authority.key();
    ctx.accounts.player_wallet.balances = [0u64; NATION_STATES.len()];
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct RegisterPlayerArgs {
    pub x_username: String
}

#[derive(Accounts)]
pub struct RegisterPlayer<'info> {
    #[account(mut)]
    pub player_authority: Signer<'info>,
    pub game: Account<'info, Game>,
    #[account(
        init,
        payer = player_authority,
        space = 8 + Player::INIT_SPACE,
        seeds = [PLAYER_SEED.as_bytes(), game.id.to_le_bytes().as_ref(), player_authority.key().as_ref()],
        bump
    )]
    pub player: Account<'info, Player>,
    #[account(
        init,
        payer = player_authority,
        space = 8 + Wallet::INIT_SPACE,
        seeds = [WALLET_SEED.as_bytes(), game.id.to_le_bytes().as_ref(), player_authority.key().as_ref()],
        bump
    )]
    pub player_wallet: Account<'info, Wallet>,
    pub system_program: Program<'info, System>,
}

pub fn mint_citizen(ctx: Context<MintCitizen>) -> Result<()> {
    // Mint Price is sent 100% to World Agent
    // World Agent will then send to Nation State Account (not authority) based on Citizen's Nation State
    // Cannot do it in this ix, because nation state is random.
    // We log it so it can be picked up by indexer and added to queue for World Agent to process

    transfer(
        CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer {
            from: ctx.accounts.player_authority.to_account_info(),
            to: ctx.accounts.world_agent_wallet.to_account_info(),
        }),
        ctx.accounts.game_account.mint_cost
    )?;
    // Mint Price is sent 100% to World Agent as SOL
    ctx.accounts.world_agent_wallet.balances[0] += ctx.accounts.game_account.mint_cost;

    let signers_seeds = &[
        GAME_SEED.as_bytes(), &ctx.accounts.game_account.id.to_le_bytes(), &[ctx.bumps.game_account]
    ];

    let clock = Clock::get()?;
    let gdp_fix = clock.slot.to_be_bytes()[0] as u8;
    let healthcare_fix = clock.slot.to_be_bytes()[1] as u8;
    let environment_fix = clock.slot.to_be_bytes()[2] as u8;
    let stability_fix = clock.slot.to_be_bytes()[3] as u8;
    let nation_state_idx = u32::from_be_bytes(clock.slot.to_be_bytes()[4..8].try_into().unwrap()) as usize % NATION_STATES.len();
    let nation_state = NATION_STATES[nation_state_idx];

    CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
        .asset(&ctx.accounts.citizen_asset.to_account_info())
        .collection(Some(&ctx.accounts.collection.to_account_info()))
        .authority(Some(&ctx.accounts.game_account.to_account_info()))
        .payer(&ctx.accounts.player_authority.to_account_info())
        .system_program(&ctx.accounts.system_program.to_account_info())
        .name(format!("Citizen - Game {:#}", ctx.accounts.game_account.id).to_string())
        .uri(ctx.accounts.collection.uri.to_string())
        .plugins(vec![
            PluginAuthorityPair {
                plugin: Plugin::FreezeDelegate(
                    FreezeDelegate {
                        frozen: false,
                    }
                ),
                authority: Some(PluginAuthority::UpdateAuthority),
            },
            PluginAuthorityPair {
                plugin: Plugin::Attributes(
                    Attributes {
                    attribute_list:vec![
                        Attribute { key: "game".to_string(), value: ctx.accounts.game_account.id.to_string() },
                        Attribute { key: "nation_state".to_string(), value: nation_state.to_string() },
                        Attribute { key: "gdp_fix".to_string(), value: gdp_fix.to_string() },
                        Attribute { key: "healthcare_fix".to_string(), value: healthcare_fix.to_string() },
                        Attribute { key: "environment_fix".to_string(), value: environment_fix.to_string() },
                        Attribute { key: "stability_fix".to_string(), value: stability_fix.to_string() }
                    ] 
                }
            ),
            authority: Some(PluginAuthority::UpdateAuthority),
          }  
        ])
        .invoke_signed(&[signers_seeds])?;

    emit!(MintCitizenEvent {
        game_id: ctx.accounts.game_account.id,
        player_authority: ctx.accounts.player_authority.key(),
        asset_id: ctx.accounts.citizen_asset.key(),
        nation_state_idx: nation_state_idx as u8,
    });

    Ok(())
}

#[event]
pub struct MintCitizenEvent {
    pub game_id: u64,
    pub player_authority: Pubkey,
    pub asset_id: Pubkey,
    pub nation_state_idx: u8,
}

#[derive(Accounts)]
#[event_cpi]
pub struct MintCitizen<'info> {
    #[account(mut)]
    pub player_authority: Signer<'info>,
    /// CHECK: 
    #[account(
        mut,
        seeds = [WALLET_SEED.as_bytes(), &game_account.id.to_le_bytes(), &game_account.world_agent.to_bytes()],
        bump
    )]
    pub world_agent_wallet: Account<'info, Wallet>,
    #[account(mut)]
    pub collection: Account<'info, BaseCollectionV1>,
    #[account(mut)]
    pub citizen_asset: Signer<'info>,
    #[account(
        seeds = [GAME_SEED.as_bytes(), &game_account.id.to_le_bytes()],
        bump,
    )]
    pub game_account: Account<'info, Game>,
    /// CHECK: constraint checks it
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn stake_or_unstake_citizen(ctx: Context<StakeOrUnstakeCitizen>, args: StakeOrUnstakeCitizenArgs) -> Result<()> {
    // Check if Citizen is staked or not
    let (_, plugin, _) = fetch_plugin::<BaseAssetV1, FreezeDelegate>(&ctx.accounts.citizen_asset.to_account_info(), PluginType::FreezeDelegate)?;
    let signers_seeds = &[
        GAME_SEED.as_bytes(), &ctx.accounts.game_account.id.to_le_bytes(), &[ctx.bumps.game_account]
    ];

    let clock = Clock::get()?;

    if plugin.frozen {
        // Unstake
        UpdatePluginV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
            .asset(&ctx.accounts.citizen_asset.to_account_info())
            .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
            .authority(Some(&ctx.accounts.game_account.to_account_info()))
            .payer(&ctx.accounts.player_authority.to_account_info())
            .system_program(&ctx.accounts.system_program.to_account_info())
            .invoke_signed(&[signers_seeds])?;

        emit!(StakeOrUnstakeCitizenEvent {
            game_id: ctx.accounts.game_account.id,
            player_authority: ctx.accounts.player_authority.key(),
            asset_id: ctx.accounts.citizen_asset.key(),
            is_staked: false,
            slot: clock.slot,
        });
    } else {
        // Stake
        let nation_idx = args.nation_idx.unwrap_or(0);
        require!((nation_idx as usize) < NATION_STATES.len(), SovereignError::InvalidNationIdx);

        UpdatePluginV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
            .asset(&ctx.accounts.citizen_asset.to_account_info())
            .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
            .authority(Some(&ctx.accounts.game_account.to_account_info()))
            .payer(&ctx.accounts.player_authority.to_account_info())
            .system_program(&ctx.accounts.system_program.to_account_info())
            .invoke_signed(&[signers_seeds])?;

        emit!(StakeOrUnstakeCitizenEvent {
            game_id: ctx.accounts.game_account.id,
            player_authority: ctx.accounts.player_authority.key(),
            asset_id: ctx.accounts.citizen_asset.key(),
            is_staked: true,
            slot: clock.slot,
        });
    }

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct StakeOrUnstakeCitizenArgs {
    pub nation_idx: Option<u8>,
}

#[event]
pub struct StakeOrUnstakeCitizenEvent {
    pub game_id: u64,
    pub player_authority: Pubkey,
    pub asset_id: Pubkey,
    pub is_staked: bool,
    pub slot: u64,
}

#[derive(Accounts)]
pub struct StakeOrUnstakeCitizen<'info> {
    pub player_authority: Signer<'info>,
    #[account(
        mut,
        constraint = citizen_asset.owner == player_authority.key() @ SovereignError::InvalidCitizenAsset
    )]
    pub citizen_asset: Account<'info, BaseAssetV1>,
    #[account(
        seeds = [GAME_SEED.as_bytes(), &game_account.id.to_le_bytes()],
        bump,
    )]
    pub game_account: Account<'info, Game>,
    /// CHECK: constraint checks it
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn claim_bounty(ctx: Context<ClaimBounty>, args: ClaimBountyArgs) -> Result<()> {
    require!(ctx.accounts.bounty.expiry_slot > Clock::get()?.slot, SovereignError::BountyExpired);
    verify_bounty(ctx.accounts.bounty.bounty_hash, args.bounty_nonce, ctx.accounts.game.bounty_pow_threshold, args.bounty_proof)?;

    let broker_escrow_signer_seeds = &[WALLET_SEED.as_bytes(), &ctx.accounts.game.id.to_le_bytes(), &ctx.accounts.game.broker_key.to_bytes(), &[ctx.bumps.broker_escrow]];
    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(), 
            Transfer {
                from: ctx.accounts.broker_escrow.to_account_info(),
                to: ctx.accounts.player_authority.to_account_info(),
            },
            &[broker_escrow_signer_seeds]
        ),
        ctx.accounts.bounty.amount
    )?;

    emit!(ClaimBountyEvent {
        game_id: ctx.accounts.game.id,
        bounty_hash: ctx.accounts.bounty.bounty_hash,
        player_authority: ctx.accounts.player_authority.key(),
        amount: ctx.accounts.bounty.amount,
    });

    Ok(())  
}

#[event]
pub struct ClaimBountyEvent {
    pub game_id: u64,
    pub bounty_hash: [u8; 32],
    pub player_authority: Pubkey,
    pub amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ClaimBountyArgs {
    pub bounty_nonce: [u8; 32],
    pub bounty_proof: [u8; 256],
}

#[derive(Accounts)]
#[instruction(args: ClaimBountyArgs)]
pub struct ClaimBounty<'info> {
    #[account(mut)]
    pub player_authority: Signer<'info>,
    #[account(
        mut,
        seeds = [WALLET_SEED.as_bytes(), &game.id.to_le_bytes(), &game.broker_key.to_bytes()],
        bump
    )]
    pub broker_escrow: Account<'info, BrokerEscrow>,
    #[account(
        mut,
        constraint = bounty.game_id == game.id @ SovereignError::InvalidGameId,
        close = broker_escrow
    )]
    pub bounty: Account<'info, Bounty>,
    pub game: Account<'info, Game>,
    pub system_program: Program<'info, System>,
}

fn verify_bounty(bounty_hash: [u8; 32], bounty_nonce: [u8; 32], threshold: [u8; 32], proof: [u8; 256]) -> Result<()> {
    let proof_a: G1 = <G1 as CanonicalDeserialize>::deserialize_uncompressed(
        &*[&change_endianness(&proof[0..64])[..], &[0u8][..]].concat(),
    )
    .unwrap();
    let mut proof_a_neg = [0u8; 65];
    <G1 as CanonicalSerialize>::serialize_uncompressed(&-proof_a, &mut proof_a_neg[..])
        .unwrap();
    let proof_a: [u8; 64] = change_endianness(&proof_a_neg[..64]).try_into().unwrap();
    let proof_b: [u8; 128] = proof[64..192].try_into().unwrap();
    let proof_c: [u8; 64] = proof[192..256].try_into().unwrap();

    let public_inputs = [bounty_hash, bounty_nonce, threshold];
    let mut verifier =
        Groth16Verifier::new(&proof_a, &proof_b, &proof_c, &public_inputs, &VERIFYINGKEY)
        .unwrap();
    
    verifier.verify().unwrap();
    Ok(())    
}

fn change_endianness(bytes: &[u8]) -> Vec<u8> {
    let mut vec = Vec::new();
    for b in bytes.chunks(32) {
        for byte in b.iter().rev() {
            vec.push(*byte);
        }
    }
    vec
}