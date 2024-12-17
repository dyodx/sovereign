use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};

use crate::{constant::TXN_FEE, error::SovereignError, state::{Game, Nation}};


pub fn world_disaster(ctx: Context<WorldDisaster>, args: WorldDisasterArgs) -> Result<()> {

    emit!(WorldDisasterEvent {
        game_id: ctx.accounts.game_account.id,
        nation_id: ctx.accounts.nation.nation_id,
        gdp_damage: args.gdp_damage,
        health_damage: args.health_damage,
        environment_damage: args.environment_damage,
        stability_damage: args.stability_damage,
    });

    let nation = &mut ctx.accounts.nation;
    // If nation is dead, transfer all it's SOL to the world agent
    if nation.gdp.checked_sub(args.gdp_damage).is_none() {
        // Nation is dead
        nation.is_alive = false;
        nation.gdp = 0;
    } else {
        nation.gdp -= args.gdp_damage;
    }

    if nation.healthcare.checked_sub(args.health_damage).is_none() {
        // Nation is dead
        nation.is_alive = false;
        nation.gdp = 0;
    } else {
        nation.healthcare -= args.health_damage;
    }

    if nation.environment.checked_sub(args.environment_damage).is_none() {
        // Nation is dead
        nation.is_alive = false;
        nation.environment = 0;
    } else {
        nation.environment -= args.environment_damage;
    }

    if nation.stability.checked_sub(args.stability_damage).is_none() {
        // Nation is dead
        nation.is_alive = false;
        nation.stability = 0;
    } else {
        nation.stability -= args.stability_damage;
    }

    if !nation.is_alive {
        emit!(NationDissolutionEvent {
            game_id: ctx.accounts.game_account.id,
            nation_id: nation.nation_id,
        });

        transfer(
            CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer {
                from: nation.to_account_info(),
                to: ctx.accounts.world_authority.to_account_info(),
            }),
            nation.to_account_info().lamports() - TXN_FEE // leave some for transfer fee
        )?;
    }

    Ok(())
}

#[event]
pub struct WorldDisasterEvent {
    pub game_id: u64,
    pub nation_id: u8,
    pub gdp_damage: u64,
    pub health_damage: u64,
    pub environment_damage: u64,
    pub stability_damage: u64,
}

#[event]
pub struct NationDissolutionEvent {
    pub game_id: u64,
    pub nation_id: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct WorldDisasterArgs {
    pub gdp_damage: u64,
    pub health_damage: u64,
    pub environment_damage: u64,
    pub stability_damage: u64,
}

#[derive(Accounts)]
pub struct WorldDisaster<'info> {
    pub world_authority: Signer<'info>,
    #[account(
        constraint = game_account.world_agent == world_authority.key() @ SovereignError::InvalidAuthority
    )]
    pub game_account: Account<'info, Game>,
    #[account(
        mut,
        constraint = nation.game_id == game_account.id @ SovereignError::InvalidGameId
    )]
    pub nation: Account<'info, Nation>,
    pub system_program: Program<'info, System>,
}

pub fn nation_boost(ctx: Context<NationBoost>, args: NationBoostArgs) -> Result<()> {
    transfer(
        CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer {
            from: ctx.accounts.world_authority.to_account_info(),
            to: ctx.accounts.nation.to_account_info(),
        }),
        args.lamports_amount
    )?;

    emit!(NationBoostEvent {
        game_id: ctx.accounts.game_account.id,
        nation_id: ctx.accounts.nation.nation_id,
        lamports_amount: args.lamports_amount,
    });

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct NationBoostArgs {
    pub lamports_amount: u64,
}

#[event]
pub struct NationBoostEvent {
    pub game_id: u64,
    pub nation_id: u8,
    pub lamports_amount: u64,
}

#[derive(Accounts)]
pub struct NationBoost<'info> {
    pub world_authority: Signer<'info>,
    #[account(
        constraint = game_account.world_agent == world_authority.key() @ SovereignError::InvalidAuthority
    )]
    pub game_account: Account<'info, Game>,
    #[account(
        mut,
        constraint = nation.game_id == game_account.id @ SovereignError::InvalidGameId
    )]
    pub nation: Account<'info, Nation>,
    pub system_program: Program<'info, System>,
}