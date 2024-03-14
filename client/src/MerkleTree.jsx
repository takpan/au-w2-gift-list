import { Tree } from 'react-d3-tree';

function MerkleTree({treeData}) {

  // Update Merkle tree each time a new name is added.

  // Display the hash value in each node and the gift recipient name in the leaf nodes.

  // When clicking on a node, highlight it and display the full hash value at the bottom of the container.

  return (
    <div id="treeWrapper" style={{ width: '50em', height: '20em' }}>
      <Tree data={treeData} orientation={"vertical"} />
    </div>
  );
}

export default MerkleTree;
