use anchor_lang::prelude::*;

use crate::constant::MAX_NATIONS_SIZE;

#[account]
#[derive(InitSpace)]
pub struct Wallet {
    pub authority: Pubkey,
    pub game_id: u64,
    pub balances: [u64;MAX_NATIONS_SIZE]
}