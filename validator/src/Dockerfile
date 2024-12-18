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

# Create certificates directory and generate TLS files
RUN mkdir -p /opt/solana/certs && \
    openssl req -x509 -newkey rsa:4096 \
    -keyout /opt/solana/certs/key.pem \
    -out /opt/solana/certs/cert.pem \
    -days 365 -nodes \
    -subj "/CN=localhost" && \
    chown -R solana:solana /opt/solana/certs && \
    chmod 600 /opt/solana/certs/*

COPY yellowstone /yellowstone
COPY keys /keys
COPY deps /deps

# Update the config.json with the correct TLS paths
RUN jq '.grpc.tls_config.cert_path = "/opt/solana/certs/cert.pem" | .grpc.tls_config.key_path = "/opt/solana/certs/key.pem" | .libpath = "/yellowstone/target/release/libyellowstone_grpc_geyser.so"' \
    /yellowstone/yellowstone-grpc-geyser/config.json > /tmp/config.json.tmp && \
    mv /tmp/config.json.tmp /yellowstone/yellowstone-grpc-geyser/config.json

RUN chown -R solana:solana /yellowstone /keys /deps

# Install Rust and Cargo for the solana user
USER solana
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/home/solana/.cargo/bin:${PATH}"

# Clone the yellowstone repository
WORKDIR /yellowstone
RUN cargo build --release -p yellowstone-grpc-geyser
WORKDIR /solana



# Run Solana Local Validator with gRPC and deployed programs
CMD ["solana-test-validator", \
 "--geyser-plugin-config", "/yellowstone/yellowstone-grpc-geyser/config.json", \
 "--bpf-program", "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d", "/deps/mpl_core_program.so", \
 "--bpf-program", "4oVhv3o16X3XR99UgbFrWNKptoNBkg2hsbNY2nYPpv4a", "/deps/soverign.so"]