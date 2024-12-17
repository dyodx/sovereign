use anchor_lang::prelude::*;

use crate::{constant::NATION_SEED, state::{Game, Nation}};

pub fn init_nation(ctx: Context<InitNation>, init_nation_args: InitNationArgs) -> Result<()> {

    ctx.accounts.nation.game_id = ctx.accounts.game.id;
    ctx.accounts.nation.nation_id = init_nation_args.id;
    ctx.accounts.nation.authority = ctx.accounts.nation_authority.key();
    ctx.accounts.nation.gdp = init_nation_args.gdp;
    ctx.accounts.nation.healthcare = init_nation_args.healthcare;
    ctx.accounts.nation.environment = init_nation_args.environment;
    ctx.accounts.nation.stability = init_nation_args.stability;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitNationArgs {
    pub id: u8,
    pub gdp: u64,
    pub healthcare: u64,
    pub environment: u64,
    pub stability: u64
}

#[derive(Accounts)]
#[instruction(init_nation_args: InitNationArgs)]
pub struct InitNation<'info> {
    #[account(mut)]
    pub game_authority: Signer<'info>,
    pub nation_authority: Signer<'info>,
    pub game: Account<'info, Game>,
    #[account(
        init,
        payer = game_authority,
        space = 8 + Nation::INIT_SPACE,
        seeds = [NATION_SEED.as_bytes(), game.id.to_le_bytes().as_ref(), init_nation_args.id.to_le_bytes().as_ref()],
        bump
    )]
    pub nation: Account<'info, Nation>,
    pub system_program: Program<'info, System>,
}