import { poseidon2 } from 'poseidon-lite';

async function measureHashingPerformance(durationInSeconds: number) {
    console.log(`Measuring Hashing Performance for ${durationInSeconds} seconds...`);
    const endTime = Date.now() + durationInSeconds * 1000;
    let hashCount = 0;

    while (Date.now() < endTime) {
        // Example input; adjust as needed
        const input = ['0x01', '0x02'];
        const hash = poseidon2(input);
        hashCount++;
    }

    const actualDuration = (Date.now() + durationInSeconds * 1000 - endTime) / 1000;
    const hashesPerSecond = hashCount / actualDuration;

    console.log(`Total hashes computed: ${hashCount}`);
    console.log(`Actual duration: ${actualDuration.toFixed(2)} seconds`);
    console.log(`Average hashes per second: ${hashesPerSecond.toFixed(2)}`);
}

measureHashingPerformance(100);