// https://dev.to/jdgamble555/async-fetching-in-svelte-5-826

export let resource = <T>(fn: () => Promise<T>, initialValue?: T) => {
	const _rune = $state<{ value: T | undefined }>({
		value: initialValue
	});

	$effect(() => {
		fn().then((data) => {
			_rune.value = data;
		});
	});

	return _rune;
};
