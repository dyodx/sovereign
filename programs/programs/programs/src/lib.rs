#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

mod constant;
mod instructions;
mod state;

declare_id!("4oVhv3o16X3XR99UgbFrWNKptoNBkg2hsbNY2nYPpv4a");

#[program]
pub mod programs {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
