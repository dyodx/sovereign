use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};
use mpl_core::{accounts::BaseCollectionV1, instructions::CreateV2CpiBuilder, types::{Attribute, Attributes, Plugin, PluginAuthority, PluginAuthorityPair}, ID as MPL_CORE_ID};

use crate::{constant::{GAME_SEED, NATION_STATES, PLAYER_SEED}, error::SovereignError, state::{Game, Player}};

pub fn register_player(ctx: Context<RegisterPlayer>, args: RegisterPlayerArgs) -> Result<()> {
    ctx.accounts.player.game_id = ctx.accounts.game.id;
    ctx.accounts.player.authority = ctx.accounts.player_authority.key();
    ctx.accounts.player.x_username = args.x_username;
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
    pub system_program: Program<'info, System>,
}

pub fn mint_citizen(ctx: Context<MintCitizen>) -> Result<()> {
    // Mint Price is sent 100% to World Agent
    // World Agent will then send to Nation State based on Citizen's Nation State
    // Cannot do it in this ix, because nation state is random.
    // We log it so it can be picked up by indexer and added to queue for World Agent to process

    transfer(
        CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer {
            from: ctx.accounts.player_authority.to_account_info(),
            to: ctx.accounts.world_agent.to_account_info(),
        }),
        ctx.accounts.game_account.mint_cost
    )?;

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
        constraint = world_agent.key() == game_account.world_agent @ SovereignError::InvalidWorldAgent
    )]
    pub world_agent: UncheckedAccount<'info>,
    #[account(mut)]
    pub collection: Account<'info, BaseCollectionV1>,
    #[account(mut)]
    pub citizen_asset: Signer<'info>,
    #[account(
        seeds = [GAME_SEED.as_bytes(), &game_account.id.to_le_bytes()],
        bump,
    )]
    pub game_account: Account<'info, Game>,
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}