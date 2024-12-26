import {z} from 'zod';

export interface SolanaEvent {
    txn: string;
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

export const NewGameEvent = z.object({
    gameId: z.string(),
    authority: z.string(),
});

export const MintTokensToPlayerWalletEvent = z.object({
    gameId: z.string(),
    nationId: z.number(),
    playerAuthority: z.string(),
    playerWallet: z.string(),
    amount: z.string(),
    slot: z.string(),
});

export const DepositToBrokerEvent = z.object({
    gameId: z.string(),
    nationId: z.number(),
    amount: z.string(),
});

export const GameOverEvent = z.object({
    gameId: z.string(),
});

export const ClaimBountyEvent = z.object({
    gameId: z.string(),
    bountyHash: z.string(),
    playerAuthority: z.string(),
    amount: z.string(),
    citizenAssetId: z.string(),
});

export const MintCitizenEvent = z.object({
    gameId: z.string(),
    playerAuthority: z.string(),
    assetId: z.string(),
    nationStateIdx: z.number(),
});

export const WorldDisasterEvent = z.object({
    gameId: z.string(),
    nationId: z.number(),
    gdpDamage: z.string(),
    healthDamage: z.string(),
    environmentDamage: z.string(),
    stabilityDamage: z.string(),
});

export const NationBoostEvent = z.object({
    gameId: z.string(),
    nationId: z.number(),
    lamportsAmount: z.string(),
});

export const StakeCitizenEvent = z.object({
    gameId: z.string(),
    playerAuthority: z.string(),
    citizenAssetId: z.string(),
    nationId: z.number(),
    slot: z.string(),
});

export const CompleteStakeEvent = z.object({
    gameId: z.string(),
    playerAuthority: z.string(),
    citizenAssetId: z.string(),
    nationId: z.number(),
    rewardAmount: z.string(),
    slot: z.string(),
});

export const NationDissolutionEvent = z.object({
    gameId: z.string(),
    nationId: z.number(),
});
