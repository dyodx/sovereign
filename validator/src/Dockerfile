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
    cmake \
    openssl \
    jq

RUN git clone https://github.com/jito-foundation/geyser-grpc-plugin.git /grpc
COPY grpc-config.json /grpc/config.json
COPY keys /keys
COPY deps /deps

RUN chown -R solana:solana /grpc /keys /deps

# Install Rust and Cargo for the solana user
USER solana
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/home/solana/.cargo/bin:${PATH}"

# Clone the yellowstone repository
WORKDIR /grpc
RUN cargo build --release
WORKDIR /solana


# Run Solana Local Validator with gRPC and deployed programs
CMD ["solana-test-validator", \
 "--geyser-plugin-config", "/grpc/config.json", \
 "--bpf-program", "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d", "/deps/mpl_core_program.so", \
 "--bpf-program", "4oVhv3o16X3XR99UgbFrWNKptoNBkg2hsbNY2nYPpv4a", "/deps/soverign.so"]