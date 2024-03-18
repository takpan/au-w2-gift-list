import { keccak256 } from 'ethereum-cryptography/keccak';
import { hexToBytes, bytesToHex } from 'ethereum-cryptography/utils';

const concat = (left, right) => keccak256(Buffer.concat([left, right]));

function verifyProof(proof, leaf, root) {
  proof = proof.map(({data, left}) => ({ 
    left, data: hexToBytes(data)
  }));
  let data = keccak256(Buffer.from(leaf));

  for (let i = 0; i < proof.length; i++) {
    if (proof[i].left) {
      data = concat(proof[i].data, data);
    } else {
      data = concat(data, proof[i].data);
    }
  }

  return bytesToHex(data) === root;
}

export default verifyProof;
