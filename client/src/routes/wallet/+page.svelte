<script lang="ts">
	import { initializeAppKit } from '$lib/wallet/appkit';

	const appkit = initializeAppKit();

	$: network = appkit?.chainNamespaces?.[0];
	$: address = appkit?.getAddress();
	console.log('debugxxxxxx', appkit?.getWalletInfo());
</script>

<div class="grid h-screen w-screen place-items-center">
	<div class=" flex flex-col gap-4">
		<p>{network}</p>
		<p>{address}</p>

		<button onclick={() => appkit?.open()}> login </button>
		<button onclick={() => appkit?.open({ view: 'Account' })}> Account </button>
		<button onclick={() => appkit?.open({ view: 'OnRampProviders' })}> ramp </button>
	</div>
</div>
