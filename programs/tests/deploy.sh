#!/bin/bash

# Start solana-test-validator in background
echo "Starting solana-test-validator..."
solana-test-validator --reset \
    --bpf-program "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d" ./deps/mpl_core.so \
    > /dev/null 2>&1 &
sleep 5

# Configure CLI to use localhost
solana config set --url localhost

echo "Airdropping SOL to admin keypair..."
solana airdrop 100 -k "./localnet-keys/admin.json"
sleep 5

# Deploy program 
echo "Deploying program..."
solana program deploy ./target/deploy/programs.so --program-id ./localnet-keys/deploy-key.json
sleep 2

echo "Deployment successful!"


