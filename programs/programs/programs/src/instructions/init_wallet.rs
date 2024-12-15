use anchor_lang::prelude::*;

use crate::{constant::{GAME_SEED, MAX_NATIONS_SIZE, WALLET_SEED}, state::{Game, Wallet}};

pub fn init_wallet(ctx: Context<InitWallet>) -> Result<()> {
    let wallet = &mut ctx.accounts.wallet;
    wallet.authority = ctx.accounts.payer.key();
    wallet.game_id = ctx.accounts.game_account.id;
    wallet.balances = [0; MAX_NATIONS_SIZE];
    Ok(())
}

#[derive(Accounts)]
pub struct InitWallet<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + Wallet::INIT_SPACE,   
        seeds = [WALLET_SEED.as_bytes(), &payer.key().to_bytes()],
        bump,
    )]
    pub wallet: Account<'info, Wallet>,
    #[account(
        seeds = [GAME_SEED.as_bytes(), &game_account.id.to_le_bytes()],
        bump,
    )]
    pub game_account: Account<'info, Game>,
    pub system_program: Program<'info, System>,
}
