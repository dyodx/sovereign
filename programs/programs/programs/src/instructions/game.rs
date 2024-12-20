use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};
use mpl_core::{instructions::*, ID as MPL_CORE_ID};

use crate::{constant::{BROKER_ESCROW_SEED, GAME_SEED, NATION_STATES, POOL_SEED, TXN_FEE, WALLET_SEED}, state::{BrokerEscrow, Game, Pool, Wallet}};

pub fn init_game(ctx: Context<InitGame>, game_id: u64, init_game_args: InitGameArgs) -> Result<()> {
    // First, prepare all the data we need to copy
    let payer_key = ctx.accounts.payer.key();
    let collection_key = ctx.accounts.collection.key();
    let game_id = game_id;
    let world_agent = init_game_args.world_agent;
    let broker_key = init_game_args.broker_key;
    
    // Create collection first
    let signers_seeds = &[
        GAME_SEED.as_bytes(), 
        &game_id.to_le_bytes(), 
        &[ctx.bumps.game_account]
    ];

    CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
        .collection(&ctx.accounts.collection.to_account_info())
        .payer(&ctx.accounts.payer.to_account_info())
        .update_authority(Some(&ctx.accounts.game_account.to_account_info()))
        .system_program(&ctx.accounts.system_program.to_account_info())
        .name(format!("Soverign {:#}", game_id).to_string())
        .uri(init_game_args.collection_uri.to_string())
        .invoke_signed(&[signers_seeds])?;

    // Initialize game account
    ctx.accounts.game_account.set_inner(Game {
        id: game_id,
        authority: payer_key,
        collection: collection_key,
        slot_start: init_game_args.slot_start,
        world_agent,
        broker_key,
        mint_cost: init_game_args.mint_cost,
        bounty_pow_threshold: [0u8; 32],
        nations_alive: 0,
    });

    // Initialize broker escrow
    ctx.accounts.broker_escrow.game_id = game_id;
    ctx.accounts.broker_escrow.broker_key = broker_key;

    // Initialize pool
    ctx.accounts.game_pool.game_id = game_id;
    ctx.accounts.game_pool.balances = [0u64; NATION_STATES.len()];
    ctx.accounts.game_pool.weights = [1_000_000_000u64/(NATION_STATES.len() as u64); NATION_STATES.len()];

    // Initialize world agent wallet
    ctx.accounts.world_agent_wallet.game_id = game_id;
    ctx.accounts.world_agent_wallet.authority = world_agent;
    ctx.accounts.world_agent_wallet.balances = [0u64; NATION_STATES.len()];

    // Transfer sol
    let transfer_accounts = Transfer {
        from: ctx.accounts.payer.to_account_info(),
        to: ctx.accounts.world_agent_wallet.to_account_info(),
    };
    
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(), 
            transfer_accounts
        ),
        TXN_FEE * 25_000
    )?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitGameArgs {
    pub slot_start: u64,
    pub collection_uri: String,
    pub world_agent: Pubkey,
    pub broker_key: Pubkey,
    pub mint_cost: u64,
    pub bounty_pow_threshold: [u8; 32],
}

#[derive(Accounts)]
#[instruction(game_id: u64, init_game_args: InitGameArgs)]
pub struct InitGame<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account (
        init,
        space = 8 + Game::INIT_SPACE,
        payer = payer,
        seeds = [GAME_SEED.as_bytes().as_ref(), &game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub game_account: Box<Account<'info, Game>>,
    #[account(
        init,
        space = 8 + Wallet::INIT_SPACE,
        payer = payer,
        seeds = [WALLET_SEED.as_bytes().as_ref(), &game_id.to_le_bytes().as_ref(), &init_game_args.world_agent.to_bytes().as_ref()],
        bump
    )]
    pub world_agent_wallet: Box<Account<'info, Wallet>>,
    #[account(
        init,
        space = 8 + Pool::INIT_SPACE,
        payer = payer,
        seeds = [POOL_SEED.as_bytes().as_ref(),  &game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub game_pool: Box<Account<'info, Pool>>,
    #[account(
        init,
        space = 8 + BrokerEscrow::INIT_SPACE,
        payer = payer,
        seeds = [BROKER_ESCROW_SEED.as_bytes().as_ref(), &game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub broker_escrow: Box<Account<'info, BrokerEscrow>>,
    ///CHECK: Created by CPI
    #[account(mut)]
    pub collection: Signer<'info>,
    /// CHECK: this account is checked by the address constraint
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
