CREATE MIGRATION m1rv7rxremkb7jxhvbwasykwpdyi5g4avfxycatc3nvydsu3o4hxga
    ONTO m1npwmhcauncoyh4bbrmcvkmlubukbtyfcimiblp23tjvq6n4pvigq
{
  ALTER TYPE agents::NationAgent {
      DROP PROPERTY game_id;
  };
  ALTER TYPE agents::NationAgent RENAME TO agents::Agent;
  ALTER TYPE agents::Agent {
      CREATE PROPERTY agent_id: std::int16;
  };
  DROP MODULE twitter;
};
