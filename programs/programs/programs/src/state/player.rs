use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Player {
    pub game_id: u64,
    pub authority: Pubkey,
    #[max_len(32)]
    pub x_username: String,
}