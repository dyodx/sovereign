#!/bin/bash

anchor build

echo "Starting solana-test-validator..."
solana-test-validator --reset \
    --bpf-program "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d" ./deps/mpl_core_program.so \
    --bpf-program "4oVhv3o16X3XR99UgbFrWNKptoNBkg2hsbNY2nYPpv4a" ./target/deploy/programs.so \
    > /dev/null 2>&1 &
sleep 5

# Configure CLI to use localhost
solana config set --url localhost

echo "Airdropping SOL to admin keypair..."
solana airdrop 10000 -k "./localnet-keys/admin.json"
sleep 5


echo "Deployment successful!"


