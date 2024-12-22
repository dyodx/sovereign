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
    #[msg("Invalid Citizen Asset")]
    InvalidCitizenAsset,
    #[msg("Nation Is Dead")]
    NationIsDead,
    #[msg("Invalid Broker")]
    InvalidBroker,
    #[msg("Bounty Not Expired")]
    BountyNotExpired,
    #[msg("Bounty Expired")]
    BountyExpired,
    #[msg("Game Not Over")]
    GameNotOver,
    #[msg("Invalid Collection Key")]
    InvalidCollectionKey,
    #[msg("Citizen Already Staked")]
    CitizenAlreadyStaked,
    #[msg("CitizenAttribute Not Found")]
    CitizenAttributeNotFound,
    #[msg("Invalid Attribute Value")]
    InvalidCitizenAttributeValue,
    #[msg("Stake Not Complete")]
    StakeNotComplete,
    #[msg("Citizen Not Staked")]
    CitizenNotStaked,
}
