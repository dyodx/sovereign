use anchor_lang::prelude::*;
use mpl_core::instructions::*;

use crate::{
    constant::{GAME_SEED, MPL_CORE_ID},
    state::Game,
};

pub fn init_game(ctx: Context<InitGame>, id: u64) -> Result<()> {
    CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
        .collection(&ctx.accounts.collection.to_account_info())
        .payer(&ctx.accounts.payer.to_account_info())
        .update_authority(Some(&ctx.accounts.authority.to_account_info()))
        .system_program(&ctx.accounts.system_program.to_account_info())
        .name("sovereign".to_string())
        .uri("https://api.npoint.io/946a471967c993ba9239".to_string())
        .invoke()?;

    let game = &mut ctx.accounts.game_account;

    let new_game = Game {
        id,
        authority: ctx.accounts.authority.key(),
        collection: ctx.accounts.collection.key(),
    };

    game.set_inner(new_game);

    Ok(())
}

#[derive(Accounts)]
pub struct InitGame<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK:
    pub authority: AccountInfo<'info>,
    #[account (
        init,
        space = 8 + Game::INIT_SPACE,
        payer = payer,
        seeds = [GAME_SEED.as_bytes(), authority.key().as_ref()],
        bump
    )]
    pub game_account: Account<'info, Game>,
    ///CHECK
    #[account(mut)]
    pub collection: Signer<'info>,
    /// CHECK: this account is checked by the address constraint
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
