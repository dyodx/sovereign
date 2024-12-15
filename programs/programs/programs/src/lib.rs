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

    // Mint Citizen with rising and falling costs
    pub fn mint_citizen(ctx: Context<MintCitizen>) -> Result<()> {
        instructions::mint_citizen(ctx)
    }

    // Upgrade Citizen NFT up to Max
    pub fn upgrade_citizen(ctx: Context<UpgradeCitizen>, args: UpgradeCitizenArgs) -> Result<()> {
        instructions::upgrade_citizen(ctx, args)
    }

    // Init Wallet for any User
    pub fn init_wallet(ctx: Context<InitWallet>) -> Result<()> {
        instructions::init_wallet(ctx)
    }

    // Init Nation State
    pub fn init_nation(ctx: Context<InitNation>, args: InitNationArgs) -> Result<()> {
        instructions::init_nation(ctx, args)
    }

    // Create Trade Offer
    // Use Trade Offer
    // Make Disaster
    // Deposit LP into Pool
    // Mitigate Disaster with NFT
}

#[derive(Accounts)]
pub struct Initialize {}
