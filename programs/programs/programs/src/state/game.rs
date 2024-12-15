use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Game {
    pub id: u64,
    pub authority: Pubkey,
    pub collection: Pubkey,
    pub slot_start: u64,

    // Authority Approved Agents
    pub world_agent: Pubkey,
    pub covert_agent: Pubkey,
    
    // Citizen Info
    pub mint_cost: u64, //Lamports
    pub max_level: u8, // 5-10 is reasonable
    pub hash_threshold: [u8; 32], // 32 bytes
}