import { NATION_STATES } from './constants/nations';

export function getNationId(nationName: string) {
	return NATION_STATES.findIndex((e) => e === nationName);
}

export function getNationName(nationId: number) {
	return NATION_STATES[nationId];
}

export function getNationCurrencyName(nation: string | number) {
	let name = nation as string;
	if (typeof nation === 'number') {
		name = getNationName(nation);
	}

	const currencyRegex = /\b(?:and|of|the|Democratic)\b|\s+|'/gi;
	return name.replace(currencyRegex, '');
}
