use anchor_lang::prelude::*;

use crate::constant::{NATION_STATES};

#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub game_id: u64,
    pub balances: [u64;NATION_STATES.len()]
}