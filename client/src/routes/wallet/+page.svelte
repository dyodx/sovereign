<script lang="ts">
	import { initializeAppKit } from '$lib/wallet/appkit';

	function handler(state: any) {
		console.log('xxxxx', state);
	}

	const appkit = initializeAppKit();
	const props = appkit?.subscribeWalletInfo(handler);
	const state = appkit?.getState();
	const wallet = appkit?.getWalletInfo();

	$: address = appkit?.getAddress();
	$: network = appkit?.getState()?.selectedNetworkId;
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
