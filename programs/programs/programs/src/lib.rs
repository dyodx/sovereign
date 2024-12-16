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

}

#[derive(Accounts)]
pub struct Initialize {}
