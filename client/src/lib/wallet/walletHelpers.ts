import Privy, {
	getAllUserEmbeddedSolanaWallets,
	type PrivyEmbeddedSolanaWalletProvider
} from '@privy-io/js-sdk-core';
import type { PrivyAuthenticatedUser } from '@privy-io/public-api';

async function createEmbeddedWallet(props: {
	privy: Privy;
	user: PrivyAuthenticatedUser;
	setAddress?: (newAddress: string | null) => void;
	setProvider?: (newProvider: PrivyEmbeddedSolanaWalletProvider | null) => void;
	setEmbeddedWallet?: (
		newEmbeddedWallet: PrivyEmbeddedSolanaWalletProvider | null
	) => void;
}) {
	const { user, privy } = props;
	if (!user || !privy) return console.error('No user or privy');
	const [account] = getAllUserEmbeddedSolanaWallets(user!.user);
	const hasEmbeddedWallet = await privy?.embeddedWallet.hasEmbeddedWallet();
	if (account && hasEmbeddedWallet) {
		if (props.setAddress) {
			props.setAddress(account.address);
		}

		const newProvider = await privy.embeddedWallet.getSolanaProvider(
			account,
			account.address,
			'solana-address-verifier'
		);
		if (props.setProvider) {
			props.setProvider(newProvider);
		}
	} else {
		if (!props.setEmbeddedWallet) return console.error('No embedded wallet');
		const solanaProvider = await privy?.embeddedWallet.createSolana();
		props.setEmbeddedWallet(solanaProvider!.provider);
	}
}

export const walletHandler = {
	createEmbeddedWallet
};
