#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

mod constant;
mod instructions;
mod state;
mod error;
mod verifying_key;

use instructions::*;

declare_id!("4oVhv3o16X3XR99UgbFrWNKptoNBkg2hsbNY2nYPpv4a");

#[program]
pub mod programs {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    // Initialize Game Account & Citizen Collection
    pub fn init_game(ctx: Context<InitGame>, game_id: u64, init_game_args: InitGameArgs) -> Result<()> {
        instructions::init_game(ctx, game_id, init_game_args)
    }

    pub fn deposit_or_withdraw_sol_to_wallet(ctx: Context<DepositOrWithdrawSol>, args: DepositOrWithdrawSolArgs) -> Result<()> {
        instructions::deposit_or_withdraw_sol_to_wallet(ctx, args)
    }

    pub fn deposit_or_withdraw_token_from_wallet_to_pool(ctx: Context<DepositOrWithdrawToken>, args: DepositOrWithdrawTokenArgs) -> Result<()> {
        instructions::deposit_or_withdraw_token_from_wallet_to_pool(ctx, args)
    }

    pub fn swap_token_to_token(ctx: Context<SwapTokenToToken>, args: SwapTokenToTokenArgs) -> Result<()> {
        instructions::swap_token_to_token(ctx, args)
    }

    pub fn transfer_tokens_from_wallet_to_wallet(ctx: Context<TransferTokens>, args: TransferTokensArgs) -> Result<()> {
        instructions::transfer_tokens(ctx, args)
    }

    pub fn init_nation(ctx: Context<InitNation>, args: InitNationArgs) -> Result<()> {
        instructions::init_nation(ctx, args)
    }

    pub fn update_nation_reward_rate(ctx: Context<UpdateNationRewardRate>, args: UpdateNationRewardRateArgs) -> Result<()> {
        instructions::update_nation_reward_rate(ctx, args)
    }

    pub fn register_player(ctx: Context<RegisterPlayer>, args: RegisterPlayerArgs) -> Result<()> {
        instructions::register_player(ctx, args)
    }

    pub fn mint_citizen(ctx: Context<MintCitizen>) -> Result<()> {
        instructions::mint_citizen(ctx)
    }

    pub fn stake_or_unstake_citizen(ctx: Context<StakeOrUnstakeCitizen>, args: StakeOrUnstakeCitizenArgs) -> Result<()> {
        instructions::stake_or_unstake_citizen(ctx, args)
    }

    pub fn mint_tokens_to_player_wallet(ctx: Context<MintTokensToPlayerWallet>, args: MintTokensToPlayerWalletArgs) -> Result<()> {
        instructions::mint_tokens_to_player_wallet(ctx, args)
    }

    pub fn world_disaster(ctx: Context<WorldDisaster>, args: WorldDisasterArgs) -> Result<()> {
        instructions::world_disaster(ctx, args)
    }

    pub fn nation_boost(ctx: Context<NationBoost>, args: NationBoostArgs) -> Result<()> {
        instructions::nation_boost(ctx, args)
    }

    pub fn deposit_to_broker(ctx: Context<DepositToBroker>, args: DepositToBrokerArgs) -> Result<()> {
        instructions::deposit_to_broker(ctx, args)
    }

    pub fn create_bounty(ctx: Context<CreateBounty>, args: CreateBountyArgs) -> Result<()> {
        instructions::create_bounty(ctx, args)
    }

    pub fn cleanup_bounty(ctx: Context<CleanupBounty>) -> Result<()> {
        instructions::cleanup_bounty(ctx)
    }

    pub fn claim_bounty(ctx: Context<ClaimBounty>, args: ClaimBountyArgs) -> Result<()> {
        instructions::claim_bounty(ctx, args)   
    }

    pub fn coup_nation(ctx: Context<CoupNation>) -> Result<()> {
        instructions::coup_nation(ctx)
    }

    pub fn loot_nation(ctx: Context<LootNation>) -> Result<()> {
        instructions::loot_nation(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}