import { api, type NationDTO } from '$lib/services/apiClient';
import { createQuery } from '@tanstack/svelte-query';

/**
 * Get all nations metadata
 * */
const queryGetNations = () =>
	createQuery({
		queryKey: [api.fetch.getNations.key],
		queryFn: api.fetch.getNations.fn
	});

/**
 * Tanstack Queries
 *
 * @example
<script lang="ts">
	import { queries } from '$lib/services/queries';
	const query = queries.getNations();
</script>

<div>
  {#if $query.isLoading}
    <p>Loading...</p>
  {:else if $query.isError}
    <p>Error: {$query.error.message}</p>
  {:else if $query.isSuccess}
    {#each $query.data as todo}
      <p>{todo.title}</p>
    {/each}
  {/if}
</div>
 * */
export const queries = {
	getNations: queryGetNations
};
