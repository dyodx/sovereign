# Frontend client

- pnpm
- sveltekit


for development
`pnpm run dev`


# Reown
- using js implementation (no svelte)
- use the appkit actions to manually open stuff https://docs.reown.com/appkit/javascript/core/actions#open-and-close-the-modal

# Todo
- [ ] add PoW
- [x] add toggle to show news on mobile view (root layout design)



# TODO PWA
- [ ] add notifications

# TODO 2
- [x] recruit citizen: move everything to the button
    - move it above my citizens with recruit
    - ditch modal and just go to confirmation screen
- [ ] balances
    - add a "your total sol balance" (maybe where question mark is?)
    - need a deposit sol button
    - withdrawl sol
- [x] add reown wallet - https://reown.com/
- [ ] add stake modal to citizen (design)
- [ ] add PoW


- PoW need to add hashing
    - check this implementation: https://github.com/SPCG-NEST/sovereign/blob/develop-v2/circuits/tests/test01/test.ts
    - check out how to to do multithreading in mobile (in service worker)
    - bountyHashLimited > threshold = success
    - ```
        const bountyHash = poseidon4(inputs);
        const bountyHashLimited = reduceTo252Bits(numberToUint8Array(bountyHash));
        ```

    
