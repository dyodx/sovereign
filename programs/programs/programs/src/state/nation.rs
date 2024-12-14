use anchor_lang::prelude::*;

use crate::constant::Profession;

#[account]
#[derive(InitSpace)]
pub struct Nation {
    pub game_id: u64,
    pub nation_id: u8, // 0-MAX_NATIONS_SIZE
    pub authority: Pubkey,

    // Stats
    pub stability: u64
}

#[account]
#[derive(InitSpace)]
pub struct TradeOffer {
    pub game_id: u64,
    pub nation_id: u8,
    pub required_profession: Profession,
    pub requried_amount: u64,
    pub offered_tokens_per_profession_per_level: u64,
}