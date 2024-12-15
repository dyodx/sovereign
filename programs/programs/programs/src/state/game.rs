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
    
    // Citizen Mint Cost
    pub mint_cost: u64, //Lamports
}