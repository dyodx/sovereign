use anchor_lang::prelude::*;

#[error_code]
pub enum SovereignError {
    #[msg("Hash not below threshold")]
    HashNotBelowThreshold,
    #[msg("Citizen already at max level")]
    CitizenAlreadyAtMaxLevel,
}
