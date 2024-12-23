import { NATION_STATES } from './constants/nations';

export function getNationId(nationName: string) {
	return NATION_STATES.findIndex((e) => e === nationName);
}

export function getNationName(nationId: number) {
	return NATION_STATES[nationId];
}
