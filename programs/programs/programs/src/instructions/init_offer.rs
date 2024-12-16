use anchor_lang::prelude::*;

use crate::{constant::{NATION_STATE_SEED, OFFER_SEED, PROEFSSION_LIST}, error::SovereignError, state::{Nation, TradeOffer}};

pub fn init_offer(ctx: Context<InitOffer>, args: InitOfferArgs) -> Result<()> {
    let offer = &mut ctx.accounts.offer;
    let nation = &mut ctx.accounts.nation;

    offer.game_id = nation.game_id;
    offer.nation_id = nation.nation_id;

    if !PROEFSSION_LIST.contains(&args.required_profession.as_str()) {
        return Err(SovereignError::InvalidProfession.into());
    }
    offer.required_profession = args.required_profession;
    offer.requried_amount = args.requried_amount;
    offer.offered_tokens_per_profession_per_level = args.offered_tokens_per_profession_per_level;

    nation.offer_count += 1;
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq, Eq)]
pub struct InitOfferArgs {
    pub required_profession: String,
    pub requried_amount: u64,
    pub offered_tokens_per_profession_per_level: u64,
}

#[derive(Accounts)]
pub struct InitOffer<'info> {
    #[account(mut)]
    pub game_authority: Signer<'info>, //payer
    pub nation_signer: Signer<'info>,
    #[account(
        seeds = [NATION_STATE_SEED.as_bytes(), &nation_signer.key().to_bytes()],
        bump,
    )]
    pub nation: Account<'info, Nation>,

    #[account(
        init,
        payer = game_authority,
        space = 8 + TradeOffer::INIT_SPACE,
        seeds = [OFFER_SEED.as_bytes(), &nation_signer.key().to_bytes(), nation.offer_count.to_le_bytes().as_ref()],
        bump,
    )]
    pub offer: Account<'info, TradeOffer>,

    pub system_program: Program<'info, System>,
}