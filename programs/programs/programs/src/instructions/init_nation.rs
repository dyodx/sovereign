use anchor_lang::prelude::*;

use crate::{constant::{GAME_SEED, NATION_STATE_SEED}, state::{Game, Nation}};

pub fn init_nation(ctx: Context<InitNation>, args: InitNationArgs) -> Result<()> {
    let nation = &mut ctx.accounts.nation;
    let game = &ctx.accounts.game_account;

    nation.game_id = game.id ;
    nation.nation_id = args.nation_id;
    nation.authority = ctx.accounts.nation_signer.key();
    nation.stability = args.stability;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitNationArgs {
    pub nation_id: u8,
    pub stability: u64,
}

#[derive(Accounts)]
pub struct InitNation<'info> {
    #[account(mut)]
    pub game_authority: Signer<'info>,
    pub nation_signer: Signer<'info>,
    #[account(
        seeds = [GAME_SEED.as_bytes(), &game_authority.key().to_bytes()],
        bump,
    )]
    pub game_account: Account<'info, Game>,
    #[account(
        init,
        payer = game_authority,
        space = 8 + Nation::INIT_SPACE,
        seeds = [NATION_STATE_SEED.as_bytes(), &nation_signer.key().to_bytes()],
        bump,
    )]
    pub nation: Account<'info, Nation>,

    pub system_program: Program<'info, System>,
}
