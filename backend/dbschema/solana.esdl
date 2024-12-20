# Tracks Solana Accounts and Log Data
# Ingests via WS RPC

module solana {
    type GameAccount {
        game_id: bigint;
        authority: str;
        collection: str;
        slot_start: bigint;
        world_agent: str;
        broker_key: str;
        mint_cost: bigint;
        bounty_pow_threshold: bytes;
        nations_alive: int16;
    }

    type BountyAccount {
        game_id: bigint;
        bounty_hash: bytes;
        amount: bigint;
        expiry_slot: bigint;
    }

    type NationAccount {
        game_id: bigint;
        nation_id: int16;
        authority: str;
        minted_tokens_total: bigint;
        gdp: bigint;
        healthcare: bigint;
        environment: bigint;
        stability: bigint;
        gdp_reward_rate: bigint;
        healthcare_reward_rate: bigint;
        environment_reward_rate: bigint;
        stability_reward_rate: bigint;
        is_alive: bool;
    }

    type PlayerAccount {
        game_id: bigint;
        authority: str;
        x_username: str;
    }
}