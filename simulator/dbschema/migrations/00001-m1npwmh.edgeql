CREATE MIGRATION m1npwmhcauncoyh4bbrmcvkmlubukbtyfcimiblp23tjvq6n4pvigq
    ONTO initial
{
  CREATE MODULE agents IF NOT EXISTS;
  CREATE MODULE common IF NOT EXISTS;
  CREATE MODULE solana IF NOT EXISTS;
  CREATE MODULE twitter IF NOT EXISTS;
  CREATE TYPE agents::NationAgent {
      CREATE PROPERTY game_id: std::bigint;
      CREATE PROPERTY private_key: std::str;
  };
  CREATE TYPE common::Game {
      CREATE PROPERTY admin_private_key: std::str;
      CREATE PROPERTY broker_private_key: std::str;
      CREATE PROPERTY game_id: std::bigint;
      CREATE PROPERTY journalist_private_key: std::str;
      CREATE PROPERTY world_agent_private_key: std::str;
  };
  CREATE TYPE solana::BountyAccount {
      CREATE PROPERTY amount: std::bigint;
      CREATE PROPERTY bounty_hash: std::bytes;
      CREATE PROPERTY expiry_slot: std::bigint;
      CREATE PROPERTY game_id: std::bigint;
  };
  CREATE TYPE solana::GameAccount {
      CREATE PROPERTY authority: std::str;
      CREATE PROPERTY bounty_pow_threshold: std::bytes;
      CREATE PROPERTY broker_key: std::str;
      CREATE PROPERTY collection: std::str;
      CREATE PROPERTY game_id: std::bigint;
      CREATE PROPERTY mint_cost: std::bigint;
      CREATE PROPERTY nations_alive: std::int16;
      CREATE PROPERTY slot_start: std::bigint;
      CREATE PROPERTY world_agent: std::str;
  };
  CREATE TYPE solana::NationAccount {
      CREATE PROPERTY authority: std::str;
      CREATE PROPERTY environment: std::bigint;
      CREATE PROPERTY environment_reward_rate: std::bigint;
      CREATE PROPERTY game_id: std::bigint;
      CREATE PROPERTY gdp: std::bigint;
      CREATE PROPERTY gdp_reward_rate: std::bigint;
      CREATE PROPERTY healthcare: std::bigint;
      CREATE PROPERTY healthcare_reward_rate: std::bigint;
      CREATE PROPERTY is_alive: std::bool;
      CREATE PROPERTY minted_tokens_total: std::bigint;
      CREATE PROPERTY nation_id: std::int16;
      CREATE PROPERTY stability: std::bigint;
      CREATE PROPERTY stability_reward_rate: std::bigint;
  };
  CREATE TYPE solana::PlayerAccount {
      CREATE PROPERTY authority: std::str;
      CREATE PROPERTY game_id: std::bigint;
      CREATE PROPERTY x_username: std::str;
  };
};
