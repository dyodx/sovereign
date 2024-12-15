use anchor_lang::prelude::*;
use mpl_core::{instructions::*, ID as MPL_CORE_ID};

use crate::{constant::{GAME_SEED, POOL_SEED}, state::{Game, Pool}};

pub fn init_game(ctx: Context<InitGame>, init_game_args: InitGameArgs) -> Result<()> {

    let signers_seeds = &[
        GAME_SEED.as_bytes(), &init_game_args.id.to_le_bytes(), &[ctx.bumps.game_account]
    ];

    CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
        .collection(&ctx.accounts.collection.to_account_info())
        .payer(&ctx.accounts.payer.to_account_info())
        .update_authority(Some(&ctx.accounts.game_account.to_account_info()))
        .system_program(&ctx.accounts.system_program.to_account_info())
        .name("sovereign".to_string())
        .uri(init_game_args.collection_uri.to_string())
        .invoke_signed(&[signers_seeds])?;

    let game = &mut ctx.accounts.game_account;

    let new_game = Game {
        id: init_game_args.id,
        authority: game.key(),
        collection: ctx.accounts.collection.key(),
        slot_start: init_game_args.slot_start,
        world_agent: init_game_args.world_agent,
        covert_agent: init_game_args.covert_agent,
        mint_cost: init_game_args.mint_cost,
        max_level: init_game_args.max_level,
        hash_threshold: init_game_args.hash_threshold,
    };

    game.set_inner(new_game);

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitGameArgs {
    pub id: u64,
    pub slot_start: u64,
    pub collection_uri: String,
    pub world_agent: Pubkey,
    pub covert_agent: Pubkey,
    pub mint_cost: u64,
    pub max_level: u8,
    pub hash_threshold: [u8; 32],
}

#[derive(Accounts)]
#[instruction(init_game_args: InitGameArgs)]
pub struct InitGame<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account (
        init,
        space = 8 + Game::INIT_SPACE,
        payer = payer,
        seeds = [GAME_SEED.as_bytes(), &init_game_args.id.to_le_bytes()],
        bump
    )]
    pub game_account: Account<'info, Game>,
    #[account(
        init,
        space = 8 + Pool::INIT_SPACE,
        payer = payer,
        seeds = [POOL_SEED.as_bytes(),  &init_game_args.id.to_le_bytes()],
        bump
    )]
    pub game_pool: Account<'info, Pool>,
    ///CHECK
    #[account(mut)]
    pub collection: Signer<'info>,
    /// CHECK: this account is checked by the address constraint
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
