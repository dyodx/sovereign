use anchor_lang::prelude::*;

use crate::constant::NATION_STATES;

// Seeds = [POOL_SEED.as_bytes(), &game_id.to_le_bytes()]
#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub game_id: u64,
    pub balances: [u64;NATION_STATES.len()],
    pub weights: [u64;NATION_STATES.len()], //normalized sum to 1e9
}