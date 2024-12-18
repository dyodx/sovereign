pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

template Bounty() {
    // game_id, issuer_pubkey, issuer_bounty_id, citizen_id
    signal input inputs[4];
    // bounty_hash = reduceTo252Bits(h(game_id, issuer_pubkey, issuer_bounty_id, citizen_id))
    signal input bounty_hash_num; 
    signal input nonce;
    signal input threshold;

    // intermediate signals
    signal bounty_hash_bits[252];
    signal bounty_hash_limited_num;
    signal bounty_hash_with_nonce_bits[252];
    signal bounty_hash_with_nonce_limited_num;

    // Prove that the private inputs hash to the bounty_hash
    component private_hasher_num = Poseidon(4);
    for (var i = 0; i < 4; i++) {
        private_hasher_num.inputs[i] <== inputs[i];
    }
    
    // reduce to 252 bits
    component n2b_bounty_hash = Num2Bits(254);
    n2b_bounty_hash.in <== private_hasher_num.out;
    for (var i = 0; i < 252; i++) {
        bounty_hash_bits[i] <== n2b_bounty_hash.out[i];
    } // leaving off 253 and 254

    // convert back to number
    component b2n_bounty_hash_limited = Bits2Num(252);
    b2n_bounty_hash_limited.in <== bounty_hash_bits;
    bounty_hash_limited_num <== b2n_bounty_hash_limited.out;

    // Assert
    bounty_hash_limited_num === bounty_hash_num;

    // Prove that the bounty_hash and nonce hash to less than threshold
    component threshold_hasher = Poseidon(2);
    threshold_hasher.inputs[0] <== bounty_hash_num;
    threshold_hasher.inputs[1] <== nonce;
    component n2b_threshold_hasher = Num2Bits(254);
    n2b_threshold_hasher.in <== threshold_hasher.out;
    for (var i = 0; i < 252; i++) {
        bounty_hash_with_nonce_bits[i] <== n2b_threshold_hasher.out[i];
    } // leaving off 253 and 254

    // convert the 252 bounty_hash_with_nonce_bits to bounty_hash_with_nonce_limited_num
    component b2n_bounty_hash_with_nonce_limited = Bits2Num(252);
    b2n_bounty_hash_with_nonce_limited.in <== bounty_hash_with_nonce_bits;
    bounty_hash_with_nonce_limited_num <== b2n_bounty_hash_with_nonce_limited.out;

    // Assert that bounty_hash_with_nonce_limited_num is less than threshold
    component lessThan = LessThan(252);
    lessThan.in[0] <== bounty_hash_with_nonce_limited_num;
    lessThan.in[1] <== threshold;
    lessThan.out === 1;
}
component main {public [bounty_hash_num, nonce, threshold]} = Bounty();
