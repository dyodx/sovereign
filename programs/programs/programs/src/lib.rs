#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

mod constant;
mod instructions;
mod state;

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

    // Mint Citizen with rising and falling costs
    pub fn mint_citizen(ctx: Context<MintCitizen>) -> Result<()> {
        instructions::mint_citizen(ctx)
    }


    // Upgrade Citizen with Hash

    // Register On Chain AI Nation
        // Will mint an SPL Token for AI Nation

    // Burn Citizen to benefit AI Nation

    // Mint AI Nation Token to Keypair

}

#[derive(Accounts)]
pub struct Initialize {}
