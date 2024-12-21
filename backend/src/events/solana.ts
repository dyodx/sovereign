export interface NewGameEvent {
    game_id: bigint;
    authority: string;
}

export interface MintTokensToPlayerWalletEvent {
    game_id: bigint;
    nation_id: number;
    player: string;
    player_wallet: string;
    amount: bigint;
    slot: bigint;
}

export interface DepositToBrokerEvent {
    game_id: bigint;
    nation_id: number;
    amount: bigint;
}

export  interface GameOverEvent {
    game_id: bigint;
}

export interface ClaimBountyEvent {
    game_id: bigint;
    bounty_hash: string;
    player: string;
}

export  interface MintCitizenEvent {
    game_id: bigint;
    player: string;
    asset_id: string;
    nation_state_idx: number;
}

export  interface StakeOrUnstakeCitizenEvent {
    game_id: bigint;
    player: string;
    asset_id: string;
    is_staked: boolean;
    slot: bigint;
}

export  interface NationDissolutionEvent {
    game_id: bigint;
    nation_id: number;
}

export interface WorldDisasterEvent {
    game_id: bigint;
    nation_id: number;
    gdp_damage: bigint;
    health_damage: bigint;
    environment_damage: bigint;
    stability_damage: bigint;
}

export interface NationBoostEvent {
    game_id: bigint;
    nation_id: number;
    lamports_amount: bigint;
}