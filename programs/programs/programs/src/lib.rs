#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

declare_id!("Hj7Y7LbWuCf9nx5QSmo21DoTkEUybQ2aJV72C4sBS9sd");

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
