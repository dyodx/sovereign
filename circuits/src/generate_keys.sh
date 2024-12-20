#!/bin/bash

# Exit on any error
set -e
circom src/bounty.circom --r1cs --wasm --output src/
snarkjs powersoftau new bn128 12 src/pot12_0000.ptau -v
snarkjs powersoftau contribute src/pot12_0000.ptau src/pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau contribute src/pot12_0001.ptau src/pot12_0002.ptau --name="Second contribution" -v
snarkjs powersoftau prepare phase2 src/pot12_0002.ptau src/pot12_final.ptau -v
snarkjs groth16 setup src/bounty.r1cs src/pot12_final.ptau src/bounty_0000.zkey
snarkjs zkey contribute src/bounty_0000.zkey src/bounty_0001.zkey --name="First contribution" -v
snarkjs zkey contribute src/bounty_0001.zkey src/bounty_0002.zkey --name="Second contribution" -v
snarkjs zkey export verificationkey src/bounty_0002.zkey src/vk_bounty.json -v
rm -f src/pot12_0001.ptau src/pot12_0002.ptau src/pot12_0000.ptau cicuit/pot12_final.ptau
rm -f src/bounty_0000.zkey src/bounty_0001.zkey

## Generate the .rs file
bun add ffjavascript && bun install
bun src/vk_to_rs.js src/vk_bounty.json ../programs/programs/programs/src

echo "Done!"