#!/bin/bash

# Function to cleanup processes on exit
cleanup() {
    echo "Cleaning up..."
    # Kill solana-test-validator if it's running
    pkill solana-test-validator
    exit "${1:-0}"
}

cleanup 0