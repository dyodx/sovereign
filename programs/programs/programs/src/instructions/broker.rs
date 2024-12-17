use anchor_lang::prelude::*;

use crate::{constant::BOUNTY_SEED, error::SovereignError, state::{Bounty, BrokerEscrow, Game}};

pub fn create_bounty(ctx: Context<CreateBounty>, args: CreateBountyArgs) -> Result<()> {
    let bounty = &mut ctx.accounts.bounty;
    bounty.game_id = ctx.accounts.game.id;
    bounty.bounty_hash = args.bounty_hash;
    bounty.amount = args.amount;
    bounty.expiry_slot = args.expiry_slot;
    Ok(())
}  

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateBountyArgs {
    pub bounty_hash: [u8; 32],
    pub amount: u64,
    pub expiry_slot: u64,
}

#[derive(Accounts)]
#[instruction(args: CreateBountyArgs)]
pub struct CreateBounty<'info> {
    #[account(mut)]
    pub broker_key: Signer<'info>,
    #[account(
        constraint = game.broker_key == broker_key.key() @ SovereignError::InvalidBroker
    )]
    pub game: Account<'info, Game>,
    #[account(
        init,
        payer = broker_key,
        space = 8 + Bounty::INIT_SPACE,
        seeds = [BOUNTY_SEED.as_bytes(), game.id.to_le_bytes().as_ref(), args.bounty_hash.as_ref()],
        bump
    )]
    pub bounty: Account<'info, Bounty>,
    pub system_program: Program<'info, System>,
}

pub fn cleanup_bounty(ctx: Context<CleanupBounty>) -> Result<()> {
    require!(ctx.accounts.bounty.expiry_slot >= Clock::get()?.slot, SovereignError::BountyNotExpired);    
    Ok(())
}

#[derive(Accounts)]
pub struct CleanupBounty<'info> {
    #[account(mut)]
    pub broker_key: Signer<'info>,
    #[account(
        constraint = bounty.game_id == game.id @ SovereignError::InvalidGameId
    )]
    pub game: Account<'info, Game>,
    #[account(
        mut,
        close = broker_key,
    )]
    pub bounty: Account<'info, Bounty>,
    pub system_program: Program<'info, System>,
}