module common {
    type Game {
        game_id: bigint;
        admin_private_key: str;
        world_agent_private_key: str;
        journalist_private_key: str;
        broker_private_key: str;
    }
}