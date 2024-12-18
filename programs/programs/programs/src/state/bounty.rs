use anchor_lang::prelude::*;

// Seeds = [BOUNTY_SEED.as_bytes(), game_id.to_le_bytes().as_ref(), bounty_hash.as_ref()]
// Technically not locked to a set specific players (would require merkle inclusion proof)
// If player shares private info, anyone could generate a bounty as them
#[account]
#[derive(InitSpace)]
pub struct Bounty {
    pub game_id: u64,
    pub bounty_hash: [u8; 32], // h(game_id, issuer_pubkey, issuer_bounty_id, citizen_id)
    pub amount: u64,
    pub expiry_slot: u64,
}