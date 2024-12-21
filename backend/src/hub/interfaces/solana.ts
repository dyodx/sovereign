export interface SolanaEvent {
    name: string;
    data: any;
}

export interface AccountUpdate {
    context: {
        slot: string
    },
    value: {
        pubkey: string,
        account: {
            lamports: string,
            owner: string,
            data: string,
            executable: boolean,
            rentEpoch: string,
            space: string,
        }
    }
}

export interface NewGameEvent {
    game_id: string;
    authority: string;
}

export interface MintTokensToPlayerWalletEvent {
    game_id: string;
    nation_id: number;
    player: string;
    player_wallet: string;
    amount: string;
    slot: string;
}

export interface DepositToBrokerEvent {
    game_id: string;
    nation_id: number;
    amount: string;
}

export  interface GameOverEvent {
    game_id: string;
}

export interface ClaimBountyEvent {
    game_id: string;
    bounty_hash: string;
    player: string;
}

export  interface MintCitizenEvent {
    game_id: string;
    player: string;
    asset_id: string;
    nation_state_idx: number;
}

export  interface StakeOrUnstakeCitizenEvent {
    game_id: string;
    player: string;
    asset_id: string;
    is_staked: boolean;
    slot: string;
}

export  interface NationDissolutionEvent {
    game_id: string;
    nation_id: number;
}

export interface WorldDisasterEvent {
    game_id: string;
    nation_id: number;
    gdp_damage: string;
    health_damage: string;
    environment_damage: string;
    stability_damage: string;
}

export interface NationBoostEvent {
    game_id: string;
    nation_id: number;
    lamports_amount: string;
}