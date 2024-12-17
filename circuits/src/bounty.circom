pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template Bounty() {
    // game_id, issuer_pubkey, issuer_bounty_id, citizen_id
    signal private input inputs[4];
    // bounty_hash= h(game_id, issuer_pubkey, issuer_bounty_id, citizen_id)
    signal input bounty_hash; 
    signal input nonce;
    signal input threshold;

    // prove the user knows the input to bounty message
    component hasher = Poseidon(4);
    for (var i = 0; i < 4; i++) {
        hasher.inputs[i] <== inputs[i];
    }
    hasher.out === bounty_hash;

    // prove the hash of the bounty message and nonce are less than threshold
    component hasher2 = Poseidon(2);
    hasher2.inputs[0] <== bounty_hash;
    hasher2.inputs[1] <== nonce;
    
    component lessThan = LessThan(252);
    lessThan.in[0] <== hasher2.out;
    lessThan.in[1] <== threshold;
    lessThan.out === 1;
}

component main {public [bounty_hash, nonce, threshold]} = Bounty();