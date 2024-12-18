use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};

use crate::{constant::{NATION_SEED, TXN_FEE}, error::SovereignError, state::{BrokerEscrow, Game, Nation, Wallet}};

pub fn init_nation(ctx: Context<InitNation>, init_nation_args: InitNationArgs) -> Result<()> {

    ctx.accounts.nation.game_id = ctx.accounts.game.id;
    ctx.accounts.nation.nation_id = init_nation_args.id;
    ctx.accounts.nation.authority = ctx.accounts.nation_authority.key();
    ctx.accounts.nation.gdp = init_nation_args.gdp;
    ctx.accounts.nation.healthcare = init_nation_args.healthcare;
    ctx.accounts.nation.environment = init_nation_args.environment;
    ctx.accounts.nation.stability = init_nation_args.stability;

    ctx.accounts.nation.gdp_reward_rate = init_nation_args.gdp_reward_rate;
    ctx.accounts.nation.healthcare_reward_rate = init_nation_args.healthcare_reward_rate;
    ctx.accounts.nation.environment_reward_rate = init_nation_args.environment_reward_rate;
    ctx.accounts.nation.stability_reward_rate = init_nation_args.stability_reward_rate;

    ctx.accounts.nation.is_alive = true;
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitNationArgs {
    pub id: u8,
    pub gdp: u64,
    pub healthcare: u64,
    pub environment: u64,
    pub stability: u64,
    pub gdp_reward_rate: u64,
    pub healthcare_reward_rate: u64,
    pub environment_reward_rate: u64,
    pub stability_reward_rate: u64
}

#[derive(Accounts)]
#[instruction(init_nation_args: InitNationArgs)]
pub struct InitNation<'info> {
    #[account(mut)]
    pub game_authority: Signer<'info>,
    pub nation_authority: Signer<'info>,
    pub game: Account<'info, Game>,
    #[account(
        init,
        payer = game_authority,
        space = 8 + Nation::INIT_SPACE,
        seeds = [NATION_SEED.as_bytes(), game.id.to_le_bytes().as_ref(), init_nation_args.id.to_le_bytes().as_ref()],
        bump
    )]
    pub nation: Account<'info, Nation>,
    pub system_program: Program<'info, System>,
}

pub fn update_nation_reward_rate(ctx: Context<UpdateNationRewardRate>, update_nation_reward_rate_args: UpdateNationRewardRateArgs) -> Result<()> {
    require!(ctx.accounts.nation.is_alive, SovereignError::NationIsDead);

    ctx.accounts.nation.gdp_reward_rate = update_nation_reward_rate_args.gdp_reward_rate;
    ctx.accounts.nation.healthcare_reward_rate = update_nation_reward_rate_args.healthcare_reward_rate;
    ctx.accounts.nation.environment_reward_rate = update_nation_reward_rate_args.environment_reward_rate;
    ctx.accounts.nation.stability_reward_rate = update_nation_reward_rate_args.stability_reward_rate;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateNationRewardRateArgs {
    pub gdp_reward_rate: u64,
    pub healthcare_reward_rate: u64,
    pub environment_reward_rate: u64,
    pub stability_reward_rate: u64
}

#[derive(Accounts)]
pub struct UpdateNationRewardRate<'info> {
    pub nation_authority: Signer<'info>,
    #[account(
        mut,    
        constraint = nation.authority == nation_authority.key() @ SovereignError::InvalidAuthority
    )]
    pub nation: Account<'info, Nation>,
}


pub fn mint_tokens_to_player_wallet(ctx: Context<MintTokensToPlayerWallet>, args: MintTokensToPlayerWalletArgs) -> Result<()> {
    require!(ctx.accounts.nation.is_alive, SovereignError::NationIsDead);

    ctx.accounts.player_wallet.balances[ctx.accounts.nation.nation_id as usize] = ctx.accounts.player_wallet.balances[ctx.accounts.nation.nation_id as usize].checked_add(args.amount).unwrap();

    emit!(MintTokensToPlayerWalletEvent {
        player: args.player_authority.key(),
        player_wallet: ctx.accounts.player_wallet.key(),
        amount: args.amount,
        slot: Clock::get()?.slot,
    });

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MintTokensToPlayerWalletArgs {
    pub player_authority: Pubkey,
    pub amount: u64,
}

#[event]
pub struct MintTokensToPlayerWalletEvent {
    pub player: Pubkey,
    pub player_wallet: Pubkey,
    pub amount: u64,
    pub slot: u64,
}

#[derive(Accounts)]
pub struct MintTokensToPlayerWallet<'info> {
    pub nation_authority: Signer<'info>,
    #[account(
        mut,    
        constraint = nation.authority == nation_authority.key() @ SovereignError::InvalidAuthority
    )]
    pub nation: Account<'info, Nation>,
    pub player_wallet: Account<'info, Wallet>,
}

pub fn deposit_to_broker(ctx: Context<DepositToBroker>, args: DepositToBrokerArgs) -> Result<()> {
    require!(ctx.accounts.nation.is_alive, SovereignError::NationIsDead);

    transfer(
        CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer {
            from: ctx.accounts.nation_authority.to_account_info(),
            to: ctx.accounts.broker_escrow.to_account_info(),
        }),
        args.amount + TXN_FEE //pay for claim fee
    )?;

    emit!(DepositToBrokerEvent {
        game_id: ctx.accounts.game.id,
        nation_id: ctx.accounts.nation.nation_id,
        amount: args.amount,
    });

    Ok(())
}

#[event]
pub struct DepositToBrokerEvent {
    pub game_id: u64,
    pub nation_id: u8,
    pub amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct DepositToBrokerArgs {
    pub amount: u64,
}

#[derive(Accounts)]
pub struct DepositToBroker<'info> {
    pub nation_authority: Signer<'info>,
    #[account(
        mut,    
        constraint = nation.authority == nation_authority.key() @ SovereignError::InvalidAuthority
    )]
    pub nation: Account<'info, Nation>,
    #[account(
        constraint = game.id == nation.game_id @ SovereignError::InvalidGameId
    )]
    pub game: Account<'info, Game>,
    #[account(
        mut,
        constraint = game.id == broker_escrow.game_id @ SovereignError::InvalidBroker
    )]
    pub broker_escrow: Account<'info, BrokerEscrow>,
    pub system_program: Program<'info, System>,
}