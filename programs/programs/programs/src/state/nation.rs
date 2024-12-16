use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Nation {
    pub game_id: u64,
    pub nation_id: u8, // 0-MAX_NATIONS_SIZE
    pub authority: Pubkey,

    // Stats
    pub stability: u64,
}