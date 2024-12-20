interface NewGameEvent {
    game_id: bigint;
    authority: string;
}

interface MintTokensToPlayerWalletEvent {
    game_id: bigint;
    nation_id: number;
    player: string;
    player_wallet: string;
    amount: bigint;
    slot: bigint;
}

interface DepositToBrokerEvent {
    game_id: bigint;
    nation_id: number;
    amount: bigint;
}

interface GameOverEvent {
    game_id: bigint;
}

interface ClaimBountyEvent {
    game_id: bigint;
    bounty_hash: string;
    player: string;
}

interface MintCitizenEvent {
    game_id: bigint;
    player: string;
    asset_id: string;
    nation_state_idx: number;
}

interface StakeOrUnstakeCitizenEvent {
    game_id: bigint;
    player: string;
    asset_id: string;
    is_staked: boolean;
    slot: bigint;
}