use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};
use mpl_core::{instructions::*, ID as MPL_CORE_ID};

use crate::{constant::{BROKER_ESCROW_SEED, GAME_SEED, NATION_STATES, POOL_SEED, TXN_FEE, WALLET_SEED}, state::{BrokerEscrow, Game, Pool, Wallet}};

pub fn init_game(ctx: Context<InitGame>, init_game_args: InitGameArgs) -> Result<()> {

    let signers_seeds = &[
        GAME_SEED.as_bytes(), &init_game_args.id.to_le_bytes(), &[ctx.bumps.game_account]
    ];

    CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
        .collection(&ctx.accounts.collection.to_account_info())
        .payer(&ctx.accounts.payer.to_account_info())
        .update_authority(Some(&ctx.accounts.game_account.to_account_info()))
        .system_program(&ctx.accounts.system_program.to_account_info())
        .name(format!("Soverign {:#}", init_game_args.id).to_string())
        .uri(init_game_args.collection_uri.to_string())
        .invoke_signed(&[signers_seeds])?;

    let game = &mut ctx.accounts.game_account;

    let new_game = Game {
        id: init_game_args.id,
        authority: ctx.accounts.payer.key(),
        collection: ctx.accounts.collection.key(),
        slot_start: init_game_args.slot_start,
        world_agent: init_game_args.world_agent,
        broker_key: init_game_args.broker_key,
        mint_cost: init_game_args.mint_cost,
        bounty_pow_threshold: [0u8; 32],
    };

    game.set_inner(new_game);

    let broker_escrow = &mut ctx.accounts.broker_escrow;

    broker_escrow.game_id = init_game_args.id;
    broker_escrow.broker_key = init_game_args.broker_key;

    let pool = &mut ctx.accounts.game_pool;

    pool.game_id = init_game_args.id;
    pool.balances = [0u64; NATION_STATES.len()];
    // All tokens in the pool have equal weight
    pool.weights = [1_000_000_000u64/(NATION_STATES.len() as u64); NATION_STATES.len()];


    let world_agent_wallet = &mut ctx.accounts.world_agent_wallet;

    world_agent_wallet.game_id = init_game_args.id;
    world_agent_wallet.authority = init_game_args.world_agent;
    world_agent_wallet.balances = [0u64; NATION_STATES.len()];

    // Tansfer starting sol into World Agent transfer fees
    transfer(
        CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer {
            from: ctx.accounts.payer.to_account_info(),
            to: ctx.accounts.world_agent_wallet.to_account_info(),
        }),
        TXN_FEE * 5_000
    )?;
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitGameArgs {
    pub id: u64,
    pub slot_start: u64,
    pub collection_uri: String,
    pub world_agent: Pubkey,
    pub broker_key: Pubkey,
    pub mint_cost: u64,
    pub bounty_pow_threshold: [u8; 32],
}

#[derive(Accounts)]
#[instruction(init_game_args: InitGameArgs)]
pub struct InitGame<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account (
        init,
        space = 8 + Game::INIT_SPACE,
        payer = payer,
        seeds = [GAME_SEED.as_bytes(), &init_game_args.id.to_le_bytes()],
        bump
    )]
    pub game_account: Account<'info, Game>,
    #[account(
        init,
        space = 8 + Wallet::INIT_SPACE,
        payer = payer,
        seeds = [WALLET_SEED.as_bytes(), &init_game_args.id.to_le_bytes(), &init_game_args.world_agent.to_bytes()],
        bump
    )]
    pub world_agent_wallet: Account<'info, Wallet>,
    #[account(
        init,
        space = 8 + Pool::INIT_SPACE,
        payer = payer,
        seeds = [POOL_SEED.as_bytes(),  &init_game_args.id.to_le_bytes()],
        bump
    )]
    pub game_pool: Account<'info, Pool>,
    #[account(
        init,
        space = 8 + BrokerEscrow::INIT_SPACE,
        payer = payer,
        seeds = [BROKER_ESCROW_SEED.as_bytes(), &init_game_args.id.to_le_bytes()],
        bump
    )]
    pub broker_escrow: Account<'info, BrokerEscrow>,
    ///CHECK
    #[account(mut)]
    pub collection: Signer<'info>,
    /// CHECK: this account is checked by the address constraint
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
