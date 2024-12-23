/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/programs.json`.
 */
export type Programs = {
  "address": "4oVhv3o16X3XR99UgbFrWNKptoNBkg2hsbNY2nYPpv4a",
  "metadata": {
    "name": "programs",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimBounty",
      "discriminator": [
        225,
        157,
        163,
        238,
        239,
        169,
        75,
        226
      ],
      "accounts": [
        {
          "name": "playerAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "brokerEscrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "game.broker_key",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "bounty",
          "writable": true
        },
        {
          "name": "nation",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "nation.nation_id",
                "account": "nation"
              }
            ]
          }
        },
        {
          "name": "citizenAsset"
        },
        {
          "name": "stakedCitizen",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  99,
                  105,
                  116,
                  105,
                  122,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "nation.nation_id",
                "account": "nation"
              },
              {
                "kind": "account",
                "path": "citizenAsset"
              }
            ]
          }
        },
        {
          "name": "game",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "claimBountyArgs"
            }
          }
        }
      ]
    },
    {
      "name": "cleanupBounty",
      "discriminator": [
        183,
        247,
        240,
        116,
        75,
        113,
        38,
        64
      ],
      "accounts": [
        {
          "name": "brokerKey",
          "writable": true,
          "signer": true
        },
        {
          "name": "game"
        },
        {
          "name": "bounty",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "completeStake",
      "discriminator": [
        140,
        11,
        27,
        124,
        153,
        43,
        255,
        117
      ],
      "accounts": [
        {
          "name": "playerAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "citizenAsset",
          "writable": true
        },
        {
          "name": "game",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "nation",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "nation.nation_id",
                "account": "nation"
              }
            ]
          }
        },
        {
          "name": "stakedCitizen",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  99,
                  105,
                  116,
                  105,
                  122,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "nation.nation_id",
                "account": "nation"
              },
              {
                "kind": "account",
                "path": "citizenAsset"
              }
            ]
          }
        },
        {
          "name": "playerWallet",
          "writable": true
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "completeStakeArgs"
            }
          }
        }
      ]
    },
    {
      "name": "coupNation",
      "discriminator": [
        167,
        85,
        9,
        72,
        126,
        31,
        246,
        100
      ],
      "accounts": [
        {
          "name": "gameAccount"
        },
        {
          "name": "nation",
          "writable": true
        },
        {
          "name": "nationAuthority"
        },
        {
          "name": "brokerEscrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  114,
                  111,
                  107,
                  101,
                  114,
                  95,
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "game_account.id",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "worldAgentWallet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "game_account.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "game_account.world_agent",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createBounty",
      "discriminator": [
        122,
        90,
        14,
        143,
        8,
        125,
        200,
        2
      ],
      "accounts": [
        {
          "name": "brokerKey",
          "writable": true,
          "signer": true
        },
        {
          "name": "game"
        },
        {
          "name": "bounty",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  111,
                  117,
                  110,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "arg",
                "path": "args.bounty_hash"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createBountyArgs"
            }
          }
        }
      ]
    },
    {
      "name": "depositOrWithdrawSolToWallet",
      "discriminator": [
        98,
        58,
        181,
        117,
        143,
        160,
        69,
        152
      ],
      "accounts": [
        {
          "name": "walletAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "wallet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "game_account.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "walletAuthority"
              }
            ]
          }
        },
        {
          "name": "gameAccount"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "depositOrWithdrawSolArgs"
            }
          }
        }
      ]
    },
    {
      "name": "depositOrWithdrawTokenFromWalletToPool",
      "discriminator": [
        91,
        148,
        31,
        217,
        17,
        193,
        43,
        16
      ],
      "accounts": [
        {
          "name": "worldAgent",
          "signer": true
        },
        {
          "name": "worldAgentWallet"
        },
        {
          "name": "gameAccount"
        },
        {
          "name": "gamePool",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "depositOrWithdrawTokenArgs"
            }
          }
        }
      ]
    },
    {
      "name": "depositToBroker",
      "discriminator": [
        37,
        118,
        8,
        211,
        39,
        197,
        235,
        7
      ],
      "accounts": [
        {
          "name": "nationAuthority",
          "signer": true
        },
        {
          "name": "nation",
          "writable": true
        },
        {
          "name": "game"
        },
        {
          "name": "brokerEscrow",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "depositToBrokerArgs"
            }
          }
        }
      ]
    },
    {
      "name": "initGame",
      "discriminator": [
        251,
        46,
        12,
        208,
        184,
        148,
        157,
        73
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "gameAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "gameId"
              }
            ]
          }
        },
        {
          "name": "worldAgentWallet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "gameId"
              },
              {
                "kind": "arg",
                "path": "init_game_args.world_agent"
              }
            ]
          }
        },
        {
          "name": "gamePool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "gameId"
              }
            ]
          }
        },
        {
          "name": "brokerEscrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  114,
                  111,
                  107,
                  101,
                  114,
                  95,
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "arg",
                "path": "gameId"
              }
            ]
          }
        },
        {
          "name": "collection",
          "writable": true,
          "signer": true
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u64"
        },
        {
          "name": "initGameArgs",
          "type": {
            "defined": {
              "name": "initGameArgs"
            }
          }
        }
      ]
    },
    {
      "name": "initNation",
      "discriminator": [
        181,
        80,
        22,
        57,
        240,
        37,
        182,
        71
      ],
      "accounts": [
        {
          "name": "gameAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "nationAuthority",
          "signer": true
        },
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "nation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "arg",
                "path": "init_nation_args.id"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initNationArgs"
            }
          }
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [],
      "args": []
    },
    {
      "name": "lootNation",
      "discriminator": [
        96,
        228,
        67,
        232,
        30,
        26,
        117,
        5
      ],
      "accounts": [
        {
          "name": "gameAccount"
        },
        {
          "name": "nation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "nation.game_id",
                "account": "nation"
              },
              {
                "kind": "account",
                "path": "nation.authority",
                "account": "nation"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "playerAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "playerWallet",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "mintCitizen",
      "discriminator": [
        17,
        164,
        11,
        250,
        142,
        8,
        137,
        120
      ],
      "accounts": [
        {
          "name": "playerAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "worldAgentWallet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "game.world_agent",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "collection",
          "writable": true
        },
        {
          "name": "citizenAsset",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "mintTokensToPlayerWallet",
      "discriminator": [
        181,
        254,
        23,
        245,
        4,
        237,
        5,
        213
      ],
      "accounts": [
        {
          "name": "nationAuthority",
          "signer": true
        },
        {
          "name": "nation",
          "writable": true
        },
        {
          "name": "playerWallet"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "mintTokensToPlayerWalletArgs"
            }
          }
        }
      ]
    },
    {
      "name": "nationBoost",
      "discriminator": [
        243,
        190,
        143,
        205,
        147,
        3,
        167,
        144
      ],
      "accounts": [
        {
          "name": "worldAuthority",
          "signer": true
        },
        {
          "name": "worldAgentWallet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "game_account.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "game_account.world_agent",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "gameAccount"
        },
        {
          "name": "nation",
          "writable": true
        },
        {
          "name": "nationAuthority"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "nationBoostArgs"
            }
          }
        }
      ]
    },
    {
      "name": "registerPlayer",
      "discriminator": [
        242,
        146,
        194,
        234,
        234,
        145,
        228,
        42
      ],
      "accounts": [
        {
          "name": "playerAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "game"
        },
        {
          "name": "player",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "playerAuthority"
              }
            ]
          }
        },
        {
          "name": "playerWallet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "playerAuthority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "registerPlayerArgs"
            }
          }
        }
      ]
    },
    {
      "name": "stakeCitizen",
      "discriminator": [
        129,
        35,
        148,
        252,
        96,
        177,
        145,
        61
      ],
      "accounts": [
        {
          "name": "playerAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "citizenAsset",
          "writable": true
        },
        {
          "name": "game",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "nation",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "nation.nation_id",
                "account": "nation"
              }
            ]
          }
        },
        {
          "name": "stakedCitizen",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  99,
                  105,
                  116,
                  105,
                  122,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "nation.nation_id",
                "account": "nation"
              },
              {
                "kind": "account",
                "path": "citizenAsset"
              }
            ]
          }
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "stakeCitizenArgs"
            }
          }
        }
      ]
    },
    {
      "name": "swapTokenToToken",
      "discriminator": [
        56,
        160,
        13,
        242,
        193,
        120,
        57,
        194
      ],
      "accounts": [
        {
          "name": "walletAuthority",
          "signer": true
        },
        {
          "name": "wallet",
          "writable": true
        },
        {
          "name": "gamePool",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "swapTokenToTokenArgs"
            }
          }
        }
      ]
    },
    {
      "name": "transferTokensFromWalletToWallet",
      "discriminator": [
        219,
        252,
        5,
        11,
        243,
        61,
        137,
        253
      ],
      "accounts": [
        {
          "name": "walletAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "wallet",
          "writable": true
        },
        {
          "name": "receiver",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "transferTokensArgs"
            }
          }
        }
      ]
    },
    {
      "name": "updateNationRewardRate",
      "discriminator": [
        236,
        59,
        23,
        69,
        197,
        81,
        189,
        10
      ],
      "accounts": [
        {
          "name": "nationAuthority",
          "signer": true
        },
        {
          "name": "nation",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateNationRewardRateArgs"
            }
          }
        }
      ]
    },
    {
      "name": "worldDisaster",
      "discriminator": [
        59,
        221,
        230,
        44,
        5,
        230,
        89,
        235
      ],
      "accounts": [
        {
          "name": "worldAuthority",
          "signer": true
        },
        {
          "name": "worldAgentWallet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "game_account.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "game_account.world_agent",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "gameAccount",
          "writable": true
        },
        {
          "name": "nation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "game_account.id",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "nation.authority",
                "account": "nation"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "worldDisasterArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "baseAssetV1",
      "discriminator": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "name": "baseCollectionV1",
      "discriminator": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      "name": "bounty",
      "discriminator": [
        237,
        16,
        105,
        198,
        19,
        69,
        242,
        234
      ]
    },
    {
      "name": "brokerEscrow",
      "discriminator": [
        63,
        68,
        116,
        182,
        187,
        189,
        197,
        245
      ]
    },
    {
      "name": "game",
      "discriminator": [
        27,
        90,
        166,
        125,
        74,
        100,
        121,
        18
      ]
    },
    {
      "name": "nation",
      "discriminator": [
        3,
        57,
        73,
        252,
        71,
        101,
        109,
        205
      ]
    },
    {
      "name": "player",
      "discriminator": [
        205,
        222,
        112,
        7,
        165,
        155,
        206,
        218
      ]
    },
    {
      "name": "pool",
      "discriminator": [
        241,
        154,
        109,
        4,
        17,
        177,
        109,
        188
      ]
    },
    {
      "name": "stakedCitizen",
      "discriminator": [
        158,
        87,
        64,
        127,
        50,
        37,
        53,
        182
      ]
    },
    {
      "name": "wallet",
      "discriminator": [
        24,
        89,
        59,
        139,
        81,
        154,
        232,
        95
      ]
    }
  ],
  "events": [
    {
      "name": "claimBountyEvent",
      "discriminator": [
        212,
        75,
        77,
        76,
        213,
        234,
        176,
        222
      ]
    },
    {
      "name": "completeStakeEvent",
      "discriminator": [
        136,
        131,
        132,
        20,
        223,
        62,
        8,
        159
      ]
    },
    {
      "name": "depositToBrokerEvent",
      "discriminator": [
        98,
        232,
        18,
        208,
        154,
        127,
        39,
        105
      ]
    },
    {
      "name": "gameOverEvent",
      "discriminator": [
        38,
        254,
        214,
        145,
        206,
        19,
        233,
        62
      ]
    },
    {
      "name": "mintCitizenEvent",
      "discriminator": [
        19,
        235,
        124,
        59,
        184,
        139,
        99,
        123
      ]
    },
    {
      "name": "mintTokensToPlayerWalletEvent",
      "discriminator": [
        167,
        94,
        181,
        211,
        236,
        234,
        103,
        118
      ]
    },
    {
      "name": "nationBoostEvent",
      "discriminator": [
        172,
        156,
        107,
        25,
        190,
        113,
        167,
        75
      ]
    },
    {
      "name": "nationDissolutionEvent",
      "discriminator": [
        183,
        188,
        155,
        94,
        1,
        68,
        201,
        195
      ]
    },
    {
      "name": "newGameEvent",
      "discriminator": [
        136,
        229,
        226,
        33,
        167,
        103,
        141,
        246
      ]
    },
    {
      "name": "stakeCitizenEvent",
      "discriminator": [
        87,
        35,
        40,
        73,
        203,
        144,
        124,
        90
      ]
    },
    {
      "name": "worldDisasterEvent",
      "discriminator": [
        50,
        221,
        82,
        162,
        167,
        221,
        148,
        156
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidGameId",
      "msg": "Invalid Game ID"
    },
    {
      "code": 6001,
      "name": "mathOverflow",
      "msg": "Math Overflow"
    },
    {
      "code": 6002,
      "name": "useSolanaForDepositOrWithdraw",
      "msg": "Use Solana for Deposit or Withdraw"
    },
    {
      "code": 6003,
      "name": "invalidTokenIdx",
      "msg": "Invalid Token Index"
    },
    {
      "code": 6004,
      "name": "insufficientFunds",
      "msg": "Insufficient Funds"
    },
    {
      "code": 6005,
      "name": "invalidAmount",
      "msg": "Invalid Amount"
    },
    {
      "code": 6006,
      "name": "invalidAuthority",
      "msg": "Invalid Authority"
    },
    {
      "code": 6007,
      "name": "invalidWorldAgent",
      "msg": "Invalid World Agent"
    },
    {
      "code": 6008,
      "name": "invalidCitizenAsset",
      "msg": "Invalid Citizen Asset"
    },
    {
      "code": 6009,
      "name": "nationIsDead",
      "msg": "Nation Is Dead"
    },
    {
      "code": 6010,
      "name": "invalidBroker",
      "msg": "Invalid Broker"
    },
    {
      "code": 6011,
      "name": "bountyNotExpired",
      "msg": "Bounty Not Expired"
    },
    {
      "code": 6012,
      "name": "bountyExpired",
      "msg": "Bounty Expired"
    },
    {
      "code": 6013,
      "name": "gameNotOver",
      "msg": "Game Not Over"
    },
    {
      "code": 6014,
      "name": "invalidCollectionKey",
      "msg": "Invalid Collection Key"
    },
    {
      "code": 6015,
      "name": "citizenAlreadyStaked",
      "msg": "Citizen Already Staked"
    },
    {
      "code": 6016,
      "name": "citizenAttributeNotFound",
      "msg": "CitizenAttribute Not Found"
    },
    {
      "code": 6017,
      "name": "invalidCitizenAttributeValue",
      "msg": "Invalid Attribute Value"
    },
    {
      "code": 6018,
      "name": "stakeNotComplete",
      "msg": "Stake Not Complete"
    },
    {
      "code": 6019,
      "name": "citizenNotStaked",
      "msg": "Citizen Not Staked"
    },
    {
      "code": 6020,
      "name": "invalidCitizenOwner",
      "msg": "Invalid Citizen Owner"
    }
  ],
  "types": [
    {
      "name": "baseAssetV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": {
              "defined": {
                "name": "key"
              }
            }
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "updateAuthority",
            "type": {
              "defined": {
                "name": "updateAuthority"
              }
            }
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "seq",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "baseCollectionV1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": {
              "defined": {
                "name": "key"
              }
            }
          },
          {
            "name": "updateAuthority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "numMinted",
            "type": "u32"
          },
          {
            "name": "currentSize",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "bounty",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "bountyHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "expirySlot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "brokerEscrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "brokerKey",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "claimBountyArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bountyNonce",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "bountyProof",
            "type": {
              "array": [
                "u8",
                256
              ]
            }
          }
        ]
      }
    },
    {
      "name": "claimBountyEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "bountyHash",
            "type": "string"
          },
          {
            "name": "playerAuthority",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "citizenAssetId",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "completeStakeArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "completeStakeEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "playerAuthority",
            "type": "string"
          },
          {
            "name": "citizenAssetId",
            "type": "string"
          },
          {
            "name": "nationId",
            "type": "u8"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "nationFixedGdp",
            "type": "u64"
          },
          {
            "name": "nationFixedHealthcare",
            "type": "u64"
          },
          {
            "name": "nationFixedEnvironment",
            "type": "u64"
          },
          {
            "name": "nationFixedStability",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "createBountyArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bountyHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "expirySlot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "depositOrWithdrawSolArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "isDeposit",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "depositOrWithdrawTokenArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenIdx",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "isDeposit",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "depositToBrokerArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "depositToBrokerEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "nationId",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "collection",
            "type": "pubkey"
          },
          {
            "name": "slotStart",
            "type": "u64"
          },
          {
            "name": "worldAgent",
            "type": "pubkey"
          },
          {
            "name": "brokerKey",
            "type": "pubkey"
          },
          {
            "name": "mintCost",
            "type": "u64"
          },
          {
            "name": "bountyPowThreshold",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "nationsAlive",
            "type": "u8"
          },
          {
            "name": "citizenStakeLength",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "gameOverEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "initGameArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slotStart",
            "type": "u64"
          },
          {
            "name": "collectionUri",
            "type": "string"
          },
          {
            "name": "worldAgent",
            "type": "pubkey"
          },
          {
            "name": "brokerKey",
            "type": "pubkey"
          },
          {
            "name": "mintCost",
            "type": "u64"
          },
          {
            "name": "bountyPowThreshold",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "initNationArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "gdp",
            "type": "u64"
          },
          {
            "name": "healthcare",
            "type": "u64"
          },
          {
            "name": "environment",
            "type": "u64"
          },
          {
            "name": "stability",
            "type": "u64"
          },
          {
            "name": "gdpRewardRate",
            "type": "u64"
          },
          {
            "name": "healthcareRewardRate",
            "type": "u64"
          },
          {
            "name": "environmentRewardRate",
            "type": "u64"
          },
          {
            "name": "stabilityRewardRate",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "key",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "uninitialized"
          },
          {
            "name": "assetV1"
          },
          {
            "name": "hashedAssetV1"
          },
          {
            "name": "pluginHeaderV1"
          },
          {
            "name": "pluginRegistryV1"
          },
          {
            "name": "collectionV1"
          }
        ]
      }
    },
    {
      "name": "mintCitizenEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "playerAuthority",
            "type": "string"
          },
          {
            "name": "assetId",
            "type": "string"
          },
          {
            "name": "nationStateIdx",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "mintTokensToPlayerWalletArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerAuthority",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "mintTokensToPlayerWalletEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "nationId",
            "type": "u8"
          },
          {
            "name": "player",
            "type": "string"
          },
          {
            "name": "playerWallet",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "slot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "nation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "nationId",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "mintedTokensTotal",
            "type": "u64"
          },
          {
            "name": "gdp",
            "type": "u64"
          },
          {
            "name": "healthcare",
            "type": "u64"
          },
          {
            "name": "environment",
            "type": "u64"
          },
          {
            "name": "stability",
            "type": "u64"
          },
          {
            "name": "gdpRewardRate",
            "type": "u64"
          },
          {
            "name": "healthcareRewardRate",
            "type": "u64"
          },
          {
            "name": "environmentRewardRate",
            "type": "u64"
          },
          {
            "name": "stabilityRewardRate",
            "type": "u64"
          },
          {
            "name": "isAlive",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "nationBoostArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lamportsAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "nationBoostEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "nationId",
            "type": "u8"
          },
          {
            "name": "lamportsAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "nationDissolutionEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "nationId",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "newGameEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "xUsername",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "balances",
            "type": {
              "array": [
                "u64",
                193
              ]
            }
          },
          {
            "name": "weights",
            "type": {
              "array": [
                "u64",
                193
              ]
            }
          }
        ]
      }
    },
    {
      "name": "registerPlayerArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "xUsername",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "stakeCitizenArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "stakeCitizenEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "playerAuthority",
            "type": "string"
          },
          {
            "name": "citizenAssetId",
            "type": "string"
          },
          {
            "name": "nationId",
            "type": "u8"
          },
          {
            "name": "slot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "stakedCitizen",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "citizenAsset",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "nationId",
            "type": "u8"
          },
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "completeSlot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "swapTokenToTokenArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fromTokenIdx",
            "type": "u8"
          },
          {
            "name": "toTokenIdx",
            "type": "u8"
          },
          {
            "name": "amountIn",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "transferTokensArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenIdx",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateAuthority",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "none"
          },
          {
            "name": "address",
            "fields": [
              "pubkey"
            ]
          },
          {
            "name": "collection",
            "fields": [
              "pubkey"
            ]
          }
        ]
      }
    },
    {
      "name": "updateNationRewardRateArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gdpRewardRate",
            "type": "u64"
          },
          {
            "name": "healthcareRewardRate",
            "type": "u64"
          },
          {
            "name": "environmentRewardRate",
            "type": "u64"
          },
          {
            "name": "stabilityRewardRate",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "wallet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "balances",
            "type": {
              "array": [
                "u64",
                193
              ]
            }
          }
        ]
      }
    },
    {
      "name": "worldDisasterArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gdpDamage",
            "type": "u64"
          },
          {
            "name": "healthDamage",
            "type": "u64"
          },
          {
            "name": "environmentDamage",
            "type": "u64"
          },
          {
            "name": "stabilityDamage",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "worldDisasterEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "nationId",
            "type": "u8"
          },
          {
            "name": "gdpDamage",
            "type": "u64"
          },
          {
            "name": "healthDamage",
            "type": "u64"
          },
          {
            "name": "environmentDamage",
            "type": "u64"
          },
          {
            "name": "stabilityDamage",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
