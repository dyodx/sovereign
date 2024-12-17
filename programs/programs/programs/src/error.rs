use anchor_lang::prelude::*;

#[error_code]
pub enum SovereignError {
    #[msg("Invalid Game ID")]
    InvalidGameId,
    #[msg("Math Overflow")]
    MathOverflow,
    #[msg("Use Solana for Deposit or Withdraw")]
    UseSolanaForDepositOrWithdraw,
    #[msg("Invalid Token Index")]  
    InvalidTokenIdx,
    #[msg("Insufficient Funds")]
    InsufficientFunds,
    #[msg("Invalid Amount")]
    InvalidAmount,
    #[msg("Invalid Authority")]
    InvalidAuthority,
    #[msg("Invalid World Agent")]
    InvalidWorldAgent,
}