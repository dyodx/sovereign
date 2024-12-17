use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Nation {
    pub game_id: u64,
    pub nation_id: u8, // 0-MAX_NATIONS_SIZE
    pub authority: Pubkey,

    // Stats
    pub gdp: u64,
    pub healthcare: u64,
    pub environment: u64,
    pub stability: u64,

    // Stake Rewards Rate
    pub gdp_reward_rate: u64,
    pub healthcare_reward_rate: u64,
    pub environment_reward_rate: u64,
    pub stability_reward_rate: u64

}