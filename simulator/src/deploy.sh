#!/bin/bash

echo "Starting solana-test-validator..."
solana-test-validator --reset \
    --bpf-program "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d" ../programs/deps/mpl_core_program.so \
    --bpf-program "4oVhv3o16X3XR99UgbFrWNKptoNBkg2hsbNY2nYPpv4a" ../programs/target/deploy/programs.so
echo "Deployment successful!"


