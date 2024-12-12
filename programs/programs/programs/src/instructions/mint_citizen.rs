use anchor_lang::prelude::*;

pub fn mint_citizen(ctx: Context<MintCitizen>) -> Result<()> {
    Ok(())
}


#[derive(Accounts)]
pub struct MintCitizen<'info> {
    pub payer: Signer<'info>,
}
