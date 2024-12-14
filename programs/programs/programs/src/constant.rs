use anchor_lang::prelude::*;
use strum_macros::{Display, EnumString};

/// PDA Seed Constants
pub const GAME_SEED: &str = "game";
pub const POOL_SEED: &str = "pool";

pub const MAX_NATIONS_SIZE: usize = 100;



// Citizen Tags
#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq, Display, EnumString, InitSpace)]
#[strum(serialize_all = "lowercase")]
pub enum Profession {
    Doctor,
    Teacher,
    Farmer,
    Engineer,
    Lawyer,
    Chef,
    Police,
    Accountant,
    Artist,
    Mechanic,
    Writer,
    Carpenter,
    Scientist,
    Electrician,
    Musician,
    Plumber,
    Journalist,
    Architect,
    Programmer,
    Therapist,
}