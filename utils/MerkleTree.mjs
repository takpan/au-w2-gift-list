import { keccak256 } from 'ethereum-cryptography/keccak';
import { bytesToHex } from 'ethereum-cryptography/utils';
import uint8ObjectToHexString from "./conversions.mjs";

export class MerkleTree {
  constructor(leaves) {
    const encoder = new TextEncoder();
    this.leafNodes = leaves.map(value => {
      const hashValue = keccak256(encoder.encode(value))
      return {
          name: "Leaf",
          attributes: {
            value: value,
            hash: hashValue,
            partialHash: this.partialHash(uint8ObjectToHexString(hashValue))
          },
      };
    });
    this.leavesHashed = this.leafNodes.map(node => node.attributes.hash);
    
    // Hash function
    this.concat = (left, right) => keccak256(Uint8Array.from([...left, ...right]));
  }

  partialHash(hash, visibleCharacters = 9) {
    const hashPrefix = hash.substring(0, visibleCharacters);
    const hashSuffix = hash.substring(hash.length - visibleCharacters);
    return hashPrefix + '...' + hashSuffix;
  }

  getTrie() {
    return this._getTrie(this.leafNodes)[0];
  }

  getRoot() {
    return bytesToHex(this._getTrie(this.leafNodes)[0].attributes.hash);
  }

  getProof(index, layer = this.leavesHashed, proof = []) {
    if (layer.length === 1) {
      return proof;
    }

    const newLayer = [];

    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = layer[i + 1];

      if (!right) {
        newLayer.push(left);
      } else {
        newLayer.push(this.concat(left, right));

        if (i === index || i === index - 1) {
          let isLeft = !(index % 2);
          proof.push({
            data: isLeft ? bytesToHex(right) : bytesToHex(left),
            left: !isLeft,
          });
        }
      }
    }

    return this.getProof(
      Math.floor(index / 2),
      newLayer,
      proof
    );
  }

  // private function
  _getTrie(nodes = this.leafNodes) {
    if (nodes.length === 0) {
      return
    }
    
    if (nodes.length === 1) {
      nodes[0].name = "Root Node"; 
      return nodes;
    }

    const layer = [];

    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i];
      const right = nodes[i + 1];
      let hashValue;

      if (right) {
        hashValue = this.concat(left.attributes.hash, right.attributes.hash)
        layer.push({
          name: "Node",
          attributes: {
            hash: hashValue,
            partialHash: this.partialHash(uint8ObjectToHexString(hashValue))
          },
          children: [left, right]});
      } else {
        hashValue = left.attributes.hash;
        layer.push({
          name: "Node",
          attributes: {
            hash: hashValue,
            partialHash: this.partialHash(uint8ObjectToHexString(hashValue))
          },
          children: [left]});
      }
    }

    return this._getTrie(layer);
  }
}

export default MerkleTree;
