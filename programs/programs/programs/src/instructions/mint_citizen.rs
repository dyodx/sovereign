use anchor_lang::prelude::*;
use mpl_core::{accounts::BaseCollectionV1, instructions::CreateV2CpiBuilder, types::{Attribute, Attributes, PluginAuthority, PluginAuthorityPair, Plugin}, ID as MPL_CORE_ID};
use strum::IntoEnumIterator;

use crate::{constant::{Profession, GAME_SEED}, state::Game};

pub fn mint_citizen(ctx: Context<MintCitizen>) -> Result<()> {
    
    let signers_seeds = &[
        GAME_SEED.as_bytes(), &ctx.accounts.game_account.id.to_be_bytes(), &[ctx.bumps.game_account]
    ];

    let clock = Clock::get()?;
    let profession = Profession::iter().nth(clock.slot as usize % Profession::iter().len()).unwrap();


    CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
        .asset(&ctx.accounts.citizen_asset.to_account_info())
        .collection(Some(&ctx.accounts.collection.to_account_info()))
        .authority(Some(&ctx.accounts.game_account.to_account_info()))
        .payer(&ctx.accounts.payer.to_account_info())
        .system_program(&ctx.accounts.system_program.to_account_info())
        .name(format!("Citizen NFT - {}", ctx.accounts.game_account.id).to_string())
        .uri(ctx.accounts.collection.uri.to_string())
        .plugins(vec![
          PluginAuthorityPair {
            plugin: Plugin::Attributes(
                Attributes {
                    attribute_list:vec![
                        Attribute { key: "game".to_string(), value: ctx.accounts.game_account.id.to_string() },
                        Attribute { key: "1".to_string(), value: profession.to_string() }
                    ] 
                }
            ),
            authority: Some(PluginAuthority::UpdateAuthority),
          }  
        ])
        .invoke_signed(&[signers_seeds])?;
    
    Ok(())
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct MintCitizenArgs {}

#[derive(Accounts)]
pub struct MintCitizen<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub collection: Account<'info, BaseCollectionV1>,
    pub citizen_asset: Signer<'info>,
    #[account(
        seeds = [GAME_SEED.as_bytes(), &game_account.id.to_be_bytes()],
        bump,
    )]
    pub game_account: Account<'info, Game>,
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
