use anchor_lang::system_program::Transfer;
use anchor_lang::system_program::transfer;
use anchor_lang::prelude::*;

use crate::state::Wallet;
use crate::{error::SovereignError, state::{Game, Pool}};

// World Agent Deposit Or Withdraw Solana
pub fn deposit_or_withdraw_solana(ctx: Context<DepositOrWithdrawSolana>, args: DepositOrWithdrawSolanaArgs) -> Result<()> {
    if args.is_deposit {
        transfer(
            CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer {
                from: ctx.accounts.world_agent.to_account_info(),
                to: ctx.accounts.game_pool.to_account_info(),
            }),
            args.lamports
        )?;
        ctx.accounts.game_pool.balances[0] += args.lamports;
    } else {
        transfer(
            CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer {
                from: ctx.accounts.game_pool.to_account_info(),
                to: ctx.accounts.world_agent.to_account_info(),
            }),
            args.lamports
        )?;
        ctx.accounts.game_pool.balances[0] -= args.lamports;
    }
    let invariant = calculate_invariant_for_pool(&ctx.accounts.game_pool);
    auto_balance_pool(&mut ctx.accounts.game_pool, invariant)?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct DepositOrWithdrawSolanaArgs {
    pub lamports: u64,
    pub is_deposit: bool,
}

#[derive(Accounts)]
pub struct DepositOrWithdrawSolana<'info> {
    #[account(mut)]
    pub world_agent: Signer<'info>,
    #[account(constraint = game_account.world_agent == world_agent.key())]
    pub game_account: Account<'info, Game>,
    #[account(
        mut,
        constraint = game_pool.game_id == game_account.id @ SovereignError::InvalidGameId
    )]
    pub game_pool: Account<'info, Pool>,
    pub system_program: Program<'info, System>,
}

// World Agent Deposit or Withdraw Token
pub fn deposit_or_withdraw_token(ctx: Context<DepositOrWithdrawToken>, args: DepositOrWithdrawTokenArgs) -> Result<()> {
    if args.token_idx == 0 {
        return Err(SovereignError::UseSolanaForDepositOrWithdraw.into());
    }

    // Transfer Token to World Agent Wallet to Pool
     if args.is_deposit {
        ctx.accounts.world_agent_wallet.balances[args.token_idx] -= args.amount;
        ctx.accounts.game_pool.balances[args.token_idx] += args.amount;
    } else {
        ctx.accounts.world_agent_wallet.balances[args.token_idx] += args.amount;
        ctx.accounts.game_pool.balances[args.token_idx] -= args.amount;
    }
    
    // Update Game Pool
    let invariant = calculate_invariant_for_pool(&ctx.accounts.game_pool);
    auto_balance_pool(&mut ctx.accounts.game_pool, invariant)?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct DepositOrWithdrawTokenArgs {
    pub token_idx: usize,
    pub amount: u64,
    pub is_deposit: bool,
}

#[derive(Accounts)]
pub struct DepositOrWithdrawToken<'info> {
    #[account(mut)]
    pub world_agent: Signer<'info>,
    #[account(
        constraint = world_agent_wallet.authority == world_agent.key()
    )]
    pub world_agent_wallet: Account<'info, Wallet>,
    #[account(constraint = game_account.world_agent == world_agent.key())]
    pub game_account: Account<'info, Game>,
    #[account(
        mut,
        constraint = game_pool.game_id == game_account.id @ SovereignError::InvalidGameId
    )]
    pub game_pool: Account<'info, Pool>,
}

// Swap Token<>Solana
pub fn swap_token_to_solana(ctx: Context<SwapTokenToSolana>, args: SwapTokenToSolanaArgs) -> Result<()> {
    require!(args.token_idx < ctx.accounts.game_pool.balances.len(), SovereignError::InvalidTokenIdx);
    require!((args.amount_in > 0 || args.sol_in > 0) && (args.amount_in != 0 || args.sol_in != 0), SovereignError::InvalidAmount);

    if args.sol_in > 0 {
        let old_balance_in = ctx.accounts.game_pool.balances[0];
        let old_balance_out = ctx.accounts.game_pool.balances[args.token_idx];
        
        transfer(
            CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer {
                from: ctx.accounts.wallet_authority.to_account_info(),
                to: ctx.accounts.game_pool.to_account_info(),
            }),
            args.sol_in
        )?;
        ctx.accounts.game_pool.balances[0] += args.sol_in;

        let amount_out = calculate_amount_out(
            &ctx.accounts.game_pool,
            0,
            args.token_idx,
            args.sol_in,
            old_balance_in,
            old_balance_out
        )?;

        ctx.accounts.game_pool.balances[args.token_idx] = old_balance_out.checked_sub(amount_out).ok_or(SovereignError::MathOverflow)?;
        ctx.accounts.wallet.balances[args.token_idx] = ctx.accounts.wallet.balances[args.token_idx].checked_add(amount_out).ok_or(SovereignError::MathOverflow)?;
    } else {
        let old_balance_in = ctx.accounts.game_pool.balances[args.token_idx];
        let old_balance_out = ctx.accounts.game_pool.balances[0];

        ctx.accounts.game_pool.balances[args.token_idx] = old_balance_in.checked_sub(args.amount_in).ok_or(SovereignError::MathOverflow)?;
        ctx.accounts.game_pool.balances[0] = old_balance_out.checked_add(args.amount_in).ok_or(SovereignError::MathOverflow)?;

        let amount_out = calculate_amount_out(
            &ctx.accounts.game_pool,
            args.token_idx,
            0,
            args.amount_in,
            old_balance_in,
            old_balance_out
        )?;

        ctx.accounts.game_pool.balances[0] = old_balance_out.checked_sub(amount_out).ok_or(SovereignError::MathOverflow)?;
        transfer(
            CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer {
                from: ctx.accounts.game_pool.to_account_info(),
                to: ctx.accounts.wallet_authority.to_account_info(),
            }),
            amount_out
        )?;
    }
    
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SwapTokenToSolanaArgs {
    pub token_idx: usize,
    pub amount_in: u64,
    pub sol_in: u64,
}

#[derive(Accounts)]
pub struct SwapTokenToSolana<'info> {
    #[account(mut)]
    pub wallet_authority: Signer<'info>,
    #[account(mut, constraint = wallet.authority == wallet_authority.key())]
    pub wallet: Account<'info, Wallet>,
    #[account(mut, constraint = game_pool.game_id == wallet.game_id @ SovereignError::InvalidGameId)]
    pub game_pool: Account<'info, Pool>,
    pub system_program: Program<'info, System>,
}

// Swap Token<>Token
pub fn swap_token_to_token(ctx: Context<SwapTokenToToken>, args: SwapTokenToTokenArgs) -> Result<()> {
    require!(args.from_token_idx < ctx.accounts.game_pool.balances.len(), SovereignError::InvalidTokenIdx);
    require!(args.to_token_idx < ctx.accounts.game_pool.balances.len(), SovereignError::InvalidTokenIdx);
    require!(args.from_token_idx != args.to_token_idx, SovereignError::InvalidTokenIdx);
    require!(args.amount_in > 0, SovereignError::InvalidAmount);
    require!(ctx.accounts.wallet.balances[args.from_token_idx] >= args.amount_in, SovereignError::InsufficientFunds);

    let old_in_balance = ctx.accounts.game_pool.balances[args.from_token_idx];
    let old_out_balance = ctx.accounts.game_pool.balances[args.to_token_idx];

    // Add input amount to pool
    ctx.accounts.game_pool.balances[args.from_token_idx] = old_in_balance.checked_add(args.amount_in).ok_or(SovereignError::MathOverflow)?;

    // Calculate new output amount
    let amount_out = calculate_amount_out(
        &ctx.accounts.game_pool,
        args.from_token_idx,
        args.to_token_idx,
        args.amount_in,
        old_in_balance,
        old_out_balance
    )?;

    // Remove output amount from pool
    ctx.accounts.game_pool.balances[args.to_token_idx] = old_out_balance.checked_sub(amount_out).ok_or(SovereignError::MathOverflow)?;

    // Update Wallet
    ctx.accounts.wallet.balances[args.from_token_idx] = old_in_balance.checked_sub(args.amount_in).ok_or(SovereignError::MathOverflow)?;
    ctx.accounts.wallet.balances[args.to_token_idx] = old_out_balance.checked_add(amount_out).ok_or(SovereignError::MathOverflow)?;

    Ok(())
}

fn calculate_amount_out(pool: &Pool, from_token_idx: usize, to_token_idx: usize, amount_in: u64, old_in_balance: u64, old_out_balance: u64) -> Result<u64> {
    let weight_in = pool.weights[from_token_idx];
    let weight_out = pool.weights[to_token_idx];

    let amount_out = (old_out_balance as u128)
    .checked_mul(
        (amount_in as u128)
            .checked_mul(weight_out as u128)
            .ok_or(SovereignError::MathOverflow)?
    )
    .ok_or(SovereignError::MathOverflow)?
    .checked_div(
        (old_in_balance as u128)
            .checked_mul(weight_in as u128)
            .ok_or(SovereignError::MathOverflow)?
    )
    .ok_or(SovereignError::MathOverflow)? as u64;    

    Ok(amount_out)
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SwapTokenToTokenArgs {
    pub from_token_idx: usize,
    pub to_token_idx: usize,
    pub amount_in: u64,
}

#[derive(Accounts)]
pub struct SwapTokenToToken<'info> {
    pub wallet_authority: Signer<'info>,
    #[account(mut, constraint = wallet.authority == wallet_authority.key())]
    pub wallet: Account<'info, Wallet>,
    #[account(mut, constraint = game_pool.game_id == wallet.game_id @ SovereignError::InvalidGameId)]
    pub game_pool: Account<'info, Pool>,
}



//// Util Functions
fn calculate_invariant_for_pool(pool: &Pool) -> u128 {
    let mut invariant = 1u128;
    for i in 0..pool.balances.len() {
        invariant = invariant.checked_mul(
            u128::pow(pool.balances[i] as u128, pool.weights[i] as u32)
        ).unwrap();
    }
    invariant
}

fn calculate_optimal_reserve_for_token(pool: &Pool, token_idx: usize, target_invariant: u128) -> Result<u64> {
    let weight_sum = pool.weights.iter().sum::<u64>();
    let token_weight = pool.weights[token_idx];

    let mut product = 1u128;
    for i in 0..pool.balances.len() {
        if i != token_idx {
            product = product.checked_mul(
                u128::pow(pool.balances[i] as u128, pool.weights[i] as u32)
            ).ok_or(SovereignError::MathOverflow)?;
        }
    }

    let optimal_reserve = (target_invariant / product)
        .pow(weight_sum as u32 / token_weight as u32) as u64;
    Ok(optimal_reserve)
}


fn auto_balance_pool(pool: &mut Pool, target_invariant: u128) -> Result<()> {
    let mut new_balances = pool.balances.clone();
    // Tolerance for considering balancing complete (0.01% deviation)
    let tolerance: i128 = (target_invariant as i128) / 10000;
        
    // Track convergence
    let mut last_invariant_diff = i128::MAX;
    
    // Iteratively adjust reserves to maintain constant product
    for iteration in 0..5 { // Reduced from 10 to 5 iterations
        let current_invariant = calculate_invariant_for_pool(pool);
        let invariant_diff = (current_invariant as i128 - target_invariant as i128).abs();
        
        // Break if we're within tolerance
        if invariant_diff < tolerance {
            msg!("Converged in {} iterations", iteration);
            break;
        }
        
        // Break if we're no longer making meaningful progress
        if invariant_diff >= last_invariant_diff {
            msg!("Stopped converging at iteration {}", iteration);
            break;
        }
        
        last_invariant_diff = invariant_diff;
        
        for i in 0..pool.balances.len() {
            if pool.weights[i] == 0 {
                continue;
            }
            
            let optimal_balance =  calculate_optimal_reserve_for_token(
                pool,
                i,
                target_invariant
            )?;
            
            new_balances[i] = optimal_balance;
        }
    }
        
    pool.balances = new_balances;
    Ok(())
}


pub fn transfer_tokens(ctx: Context<TransferTokens>, args: TransferTokensArgs) -> Result<()> {
    require!(args.token_idx < ctx.accounts.wallet.balances.len(), SovereignError::InvalidTokenIdx);
    require!(ctx.accounts.wallet.balances[args.token_idx] >= args.amount, SovereignError::InsufficientFunds);

    ctx.accounts.wallet.balances[args.token_idx] = ctx.accounts.wallet.balances[args.token_idx].checked_sub(args.amount).ok_or(SovereignError::MathOverflow)?;
    ctx.accounts.receiver.balances[args.token_idx] = ctx.accounts.receiver.balances[args.token_idx].checked_add(args.amount).ok_or(SovereignError::MathOverflow)?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct TransferTokensArgs {
    pub token_idx: usize,
    pub amount: u64,
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub wallet_authority: Signer<'info>,
    #[account(mut, constraint = wallet.authority == wallet_authority.key())]
    pub wallet: Account<'info, Wallet>,
    #[account(mut)]
    pub receiver: Account<'info, Wallet>,
}