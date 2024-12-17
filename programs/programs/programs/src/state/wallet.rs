use anchor_lang::prelude::*;

use crate::constant::NATION_STATES;


// Seeds = [WALLET_SEED.as_bytes(), &game_id.to_le_bytes(), &authority.to_bytes()]
#[account]
#[derive(InitSpace)]
pub struct Wallet {
    pub game_id: u64,
    pub authority: Pubkey,
    pub balances: [u64;NATION_STATES.len()]
}