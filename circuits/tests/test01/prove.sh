#!/bin/bash

# Exit on any error
set -e
bun src/bounty_js/generate_witness.js src/bounty_js/bounty.wasm tests/test01/input.json tests/test01/witness.wtns

# Generate the proof
snarkjs groth16 prove src/bounty_0002.zkey tests/test01/witness.wtns tests/test01/proof.json tests/test01/public.json

# Verify the proof
snarkjs groth16 verify src/vk_bounty.json tests/test01/public.json tests/test01/proof.json
