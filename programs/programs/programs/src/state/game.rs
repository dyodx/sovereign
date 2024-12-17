use anchor_lang::prelude::*;

// Seeds = [GAME_SEED.as_bytes(), &game_id.to_le_bytes()]
#[account]
#[derive(InitSpace)]
pub struct Game {
    pub id: u64,
    pub authority: Pubkey,
    pub collection: Pubkey,
    pub slot_start: u64,

    // Authority Approved Agents
    pub world_agent: Pubkey,
    pub broker_key: Pubkey, // Not a true agent, just processing Algo
    
    // Citizen Info
    pub mint_cost: u64, //Lamports
}

// Seeds = [BROKER_ESCROW_SEED.as_bytes(), &game_id.to_le_bytes()]
#[account]
#[derive(InitSpace)]
pub struct BrokerEscrow {
    pub game_id: u64,
    pub broker_key: Pubkey,
}