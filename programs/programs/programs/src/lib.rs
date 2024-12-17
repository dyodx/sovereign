#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

mod constant;
mod instructions;
mod state;
mod error;

use instructions::*;

declare_id!("4oVhv3o16X3XR99UgbFrWNKptoNBkg2hsbNY2nYPpv4a");

#[program]
pub mod programs {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    // Initialize Game Account & Citizen Collection
    pub fn init_game(ctx: Context<InitGame>, init_game_args: InitGameArgs) -> Result<()> {
        instructions::init_game(ctx, init_game_args)
    }

    pub fn deposit_or_withdraw_solana(ctx: Context<DepositOrWithdrawSolana>, args: DepositOrWithdrawSolanaArgs) -> Result<()> {
        instructions::deposit_or_withdraw_solana(ctx, args)
    }

    pub fn deposit_or_withdraw_token(ctx: Context<DepositOrWithdrawToken>, args: DepositOrWithdrawTokenArgs) -> Result<()> {
        instructions::deposit_or_withdraw_token(ctx, args)
    }

    pub fn swap_token_to_token(ctx: Context<SwapTokenToToken>, args: SwapTokenToTokenArgs) -> Result<()> {
        instructions::swap_token_to_token(ctx, args)
    }

    pub fn swap_token_to_solana(ctx: Context<SwapTokenToSolana>, args: SwapTokenToSolanaArgs) -> Result<()> {
        instructions::swap_token_to_solana(ctx, args)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
