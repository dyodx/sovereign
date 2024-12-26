# Frontend client

- pnpm
- sveltekit


for development
`pnpm run dev`

# wallet - @privy-io
- uses twitter for the authentication
- `$lib/wallet/txHelpers.ts` is the main file for interacting with the chain
- privy initiated on `/dash` page and passed around via `walletStore` and `privyStore`
- working example: mintCitizen in `src/routes/dash/Modals/ModalRecruit.svelte`
    - use `$walletStore` from `/stores/wallet.svelte.ts` for `connection` and `address`

# fetching data - @tanstack/svelte-query
- api functions are in `src/lib/services/apiClient.ts`
    - use the `api` object which groups functions with keys
    - keys used in query for cache management
- queries are in `src/lib/services/queries.ts`
- to invalidate a query (refresh), use `$queryStore.invalidateQueries(queryKey)`
- example in `src/routes/dash/State.svelte`



# TODO PWA
- [x] add notifications (working but need to link it to something dynamic)
    - check `/` (landing page) to test the notifications. Open in chrome and install as PWA.
    - on mac, open Notifications & Focus, enable Chrome and Google Chrome Helper
- [ ] connect notifications to outside server

# TODO GENERAL
- [ ] add designs for operations
- [ ] change citizen design: only show flag if staked

- [ ] balances
    - [x] add a "your total sol balance" (maybe where question mark is?)
    - [x] need a copy/paste of address
    - withdrawl sol
- [ ] replace ai news/tweets with real data (use `getNations()` tanstack example)
- [ ] inbox for bounties
    - bounties are where you can trigger PoW
    - empty placeholders are on `src/routes/dash/States.svelte` (under table)

# PoW (hashing)
    - will be used for sabotage. Players claim bounties and hash them and submit proof.
    - check this implementation: https://github.com/SPCG-NEST/sovereign/blob/develop-v2/circuits/tests/test01/test.ts
    - check out how to to do multithreading in mobile (in service worker)
    - bountyHashLimited > threshold = success
        ```
        const bountyHash = poseidon4(inputs);
        const bountyHashLimited = reduceTo252Bits(numberToUint8Array(bountyHash));
        ```

---

- [x] add reown wallet - https://reown.com/
- [x] recruit citizen: move everything to the button
- [x] add toggle to show news on mobile view (root layout design)
- [x] add twitter auth to confirm your account
- [x] add stake modal to citizen (design). Just stake or not stake to a certain nation
- [x] move citizen panel to citizens page as just a button
- [x] make wallet persistent (reloads on refresh, new tab if previously logged in)
- [x] show citizens minted for current game
- [x] make twitter registration block actions (mint, swap etc). check `getPlayerAccount` for the twitter handle
- [x] table stats for nation states
- [x] add search and sorting for nation states
- [x] clean up the stats on citizen (how to represent numbers)
- [x] add rewards for staking (real data)
- [x] make copy/paste of address to deposit sol
