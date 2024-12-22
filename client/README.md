# Frontend client

- pnpm
- sveltekit


for development
`pnpm run dev`

# wallet - @privy-io
- uses twitter for the authentication
- `$lib/wallet/txHelpers.ts` is the main file for interacting with the chain
- privy initiated on `/dash` page and passed around via `walletStore` and `privyStore`


# TODO PWA
- [ ] add notifications (working but need to link it to something dynamic)
    - check `/` (landing page) to test the notifications. Open in chrome and install as PWA.
    - on mac, open Notifications & Focus, enable Chrome and Google Chrome Helper

# TODO 2
- [ ] balances
    - [x] add a "your total sol balance" (maybe where question mark is?)
    - need a copy/paste of address
    - withdrawl sol
- [ ] deposit sol
    - modal should show stats
- [ ] inbox for bounties
    - bounties are where you can trigger PoW





    WHEN BACK
    - citizen: replace icon with number
    - modal should be for staking to a ccertain nation
    - balance modal: need to experiment if i can get appkit there locally to open a transaction?


- PoW need to add hashing
    - check this implementation: https://github.com/SPCG-NEST/sovereign/blob/develop-v2/circuits/tests/test01/test.ts
    - check out how to to do multithreading in mobile (in service worker)
    - bountyHashLimited > threshold = success
    - ```
        const bountyHash = poseidon4(inputs);
        const bountyHashLimited = reduceTo252Bits(numberToUint8Array(bountyHash));
        ```

    
    - [ ] make twitter registration block actions (mint, swap etc). check `getPlayerAccount` for the twitter handle
    - [ ] clean up the stats on citizen  (big number)
    - [ ] make copy/paste of address


---
- [x] add reown wallet - https://reown.com/
- [x] recruit citizen: move everything to the button
- [x] add toggle to show news on mobile view (root layout design)
- [x] add twitter auth to confirm your account
- [x] add stake modal to citizen (design). Just stake or not stake to a certain nation
- [x] move citizen panel to citizens page as just a button
- [x] make wallet persistent (reloads on refresh, new tab if previously logged in)
- [x] show citizens minted for current game
