use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;
use mpl_core::{accounts::{BaseAssetV1, BaseCollectionV1}, fetch_plugin, instructions::UpdatePluginV1CpiBuilder, types::{Attribute, Attributes, Plugin, PluginType}, ID as MPL_CORE_ID};

use crate::{constant::{GAME_SEED, PROEFSSION_LIST}, error::SovereignError, state::Game};

pub fn upgrade_citizen(ctx: Context<UpgradeCitizen>, args: UpgradeCitizenArgs) -> Result<()> {
    let mut hash_inputs: Vec<u8> = vec![];
    hash_inputs.extend(ctx.accounts.citizen_asset.key().to_bytes());
    hash_inputs.extend(args.nonce.to_le_bytes());
    let hash_bytes = hash(&hash_inputs).to_bytes();
    let hash_threshold = ctx.accounts.game_account.hash_threshold;

    if !is_below_threshold(&hash_bytes, &hash_threshold) {
        return Err(SovereignError::HashNotBelowThreshold.into());
    }

    let signers_seeds = &[
        GAME_SEED.as_bytes(), &ctx.accounts.game_account.id.to_le_bytes(), &[ctx.bumps.game_account]
    ];

    // Check if the citizen is already at max level
    let (_, plugin, _) = fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.citizen_asset.to_account_info(), PluginType::Attributes)?;
    let current_level = plugin.attribute_list.len() - 1; // 0 is the game id
    if current_level >= ctx.accounts.game_account.max_level as usize{
        return Err(SovereignError::CitizenAlreadyAtMaxLevel.into());
    }

    let clock = Clock::get()?;
    let mut profession_idx = clock.slot as usize % PROEFSSION_LIST.len();
    let mut new_profession = PROEFSSION_LIST[profession_idx];

    while plugin.attribute_list.iter().any(|attr| attr.value == new_profession) {
        profession_idx = (profession_idx + 1) % PROEFSSION_LIST.len();
        new_profession = PROEFSSION_LIST[profession_idx];
    }

    let mut new_attribute_list = plugin.attribute_list.clone();
    new_attribute_list.push(Attribute { key: format!("{:#}", plugin.attribute_list.len()).to_string(), value: new_profession.to_string() });

    UpdatePluginV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
        .asset(&ctx.accounts.citizen_asset.to_account_info())
        .collection(Some(&ctx.accounts.collection.to_account_info()))
        .authority(Some(&ctx.accounts.game_account.to_account_info()))
        .payer(&ctx.accounts.payer.to_account_info())
        .system_program(&ctx.accounts.system_program.to_account_info())
        .plugin(Plugin::Attributes(Attributes {
            attribute_list: new_attribute_list
        }))
        .invoke_signed(&[signers_seeds])?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpgradeCitizenArgs {
    pub nonce: u64,
}

#[derive(Accounts)]
pub struct UpgradeCitizen<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub citizen_asset: Account<'info, BaseAssetV1>,
    #[account(
        seeds = [GAME_SEED.as_bytes(), &game_account.id.to_le_bytes()],
        bump,
    )]
    #[account(mut)]
    pub collection: Account<'info, BaseCollectionV1>,
    #[account(
        seeds = [GAME_SEED.as_bytes(), &game_account.id.to_le_bytes()],
        bump,
    )]
    pub game_account: Account<'info, Game>,
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

// does a byte-by-byte comparison from most significant to least significant byte
fn is_below_threshold(input: &[u8; 32], threshold: &[u8; 32]) -> bool {
    for (input_byte, threshold_byte) in input.iter().zip(threshold.iter()) {
        if input_byte < threshold_byte {
            return true;
        }
        if input_byte > threshold_byte {
            return false;
        }
    }
    // If we get here, they're equal, so it's not below
    false
}