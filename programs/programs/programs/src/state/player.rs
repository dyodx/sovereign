use anchor_lang::prelude::*;

// Seeds = [PLAYER_SEED.as_bytes(), &game_id.to_le_bytes(), &authority.to_bytes()]
#[account]
#[derive(InitSpace)]
pub struct Player {
    pub game_id: u64,
    pub authority: Pubkey,
    #[max_len(32)]
    pub x_username: String,
}