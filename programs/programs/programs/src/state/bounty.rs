use anchor_lang::prelude::*;

// Seeds = [BOUNTY_SEED.as_bytes(), game_id.to_le_bytes().as_ref(), bounty_hash.as_ref()]
#[account]
#[derive(InitSpace)]
pub struct Bounty {
    pub game_id: u64,
    pub bounty_hash: [u8; 32],
    pub amount: u64,
    pub expiry_slot: u64,
}