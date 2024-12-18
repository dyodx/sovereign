FROM ghcr.io/beeman/solana-test-validator:latest

# Install required packages
USER root
RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    pkg-config \
    libssl-dev \
    protobuf-compiler \
    cmake

# Install Rust and Cargo for the solana user
USER solana
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/home/solana/.cargo/bin:${PATH}"

# Switch back to root for directory creation and permissions
USER root
RUN mkdir /yellowstone && chown solana:solana /yellowstone
COPY deps /deps
COPY keys /keys
RUN chown -R solana:solana /deps /keys

# Switch back to solana user for remaining operations
USER solana
# Clone the yellowstone repository
RUN git clone https://github.com/rpcpool/yellowstone-grpc.git /yellowstone
WORKDIR /yellowstone
RUN cargo build --release -p yellowstone-grpc-geyser
WORKDIR /solana

# Run Solana Local Validator with gRPC and deployed programs
CMD ["solana-test-validator", \
 "--geyser-plugin-config", "/yellowstone/yellowstone-grpc-geyser/config.json", \
 "--bpf-program", "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d", "/deps/mpl_core_program.so", \
 "--bpf-program", "4oVhv3o16X3XR99UgbFrWNKptoNBkg2hsbNY2nYPpv4a", "/deps/soverign.so"]