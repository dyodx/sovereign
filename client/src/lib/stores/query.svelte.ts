import type { QueryClient } from '@tanstack/svelte-query';
import { writable, type Writable } from 'svelte/store';

/**
 * Updated in layout, used to invalidate queries and manage cache
 * */
export const queryStore: Writable<QueryClient | null> = writable(null);

export function updateQueryStore(queryClient: QueryClient | null) {
	if (queryClient === null)
		return console.error('updateQueryStore: newQuery is null');
	queryStore.set(queryClient);
}
