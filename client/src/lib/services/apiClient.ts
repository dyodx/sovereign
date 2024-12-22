import { GAME_ID } from '$lib/wallet/constants';
import axios from 'axios';

const apiClient = axios.create({
	baseURL: 'http://localhost:5173/api' // TODO: replace with env. Proxy in VITE
});

type NationDTO = {
	pubkey: string;
	gameId: string;
	nationId: number;
	authority: string;
	mintedTokensTotal: string;
	gdp: string;
	healthcare: string;
	environment: string;
	stability: string;
	gdpRewardRate: string;
	healthcareRewardRate: string;
	environmentRewardRate: string;
	stabilityRewardRate: string;
	isAlive: boolean;
};

async function getNations() {
	const res = await apiClient.get<NationDTO[]>(`/nations?gameId=${GAME_ID}`);
	return res.data;
}

export const api = {
	fetch: {
		getNations
	}
};
