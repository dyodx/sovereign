use anchor_lang::prelude::*;

use crate::constant::MAX_NATIONS_SIZE;

#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub game_id: u64,
    pub balances: [u64;MAX_NATIONS_SIZE]
}