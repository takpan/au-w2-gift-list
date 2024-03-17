import { Tree } from 'react-d3-tree';
import { useState, useEffect } from "react";
import CustomNode from "./CustomNode";
import { MerkleTree } from "../../utils/MerkleTree";
import uint8ObjectToHexString from "../../utils/conversions";

function DisplayTree({ leaves }) {
  const [treeData, setTreeData] = useState({ name: "Root Node", attributes: {} });
  const [selectedNode, setSelectedNode] = useState({});

  useEffect(() => {
    if (leaves.length === 0) {
      setTreeData({ name: "Root Node", attributes: {} });
    } else {
      setTreeData(new MerkleTree(leaves).getTrie());
    }
    setSelectedNode({});
  }, [leaves]);

  const handleClearNodeSelection = () => setSelectedNode({});

  return (
    <div className='treeContainer' style={{ width: '80vw'}} onClick={handleClearNodeSelection}>
      <div className='containerHeader'>Merkle Tree</div>
      <Tree 
        data={treeData}
        orientation={"vertical"}
        nodeSize={{ x:150, y:100 }}
        separation={{ siblings:1.5, nonSiblings:1.75 }}
        translate={{ x: 600, y: 50 }}
        onNodeClick={(node, evt) => {
          evt.stopPropagation();
          setSelectedNode(node)
        }}
        renderCustomNodeElement={(rd3tProps) =>
          CustomNode({ ...rd3tProps, foreignObjectProps: { width: 200, height: 100, x: -100 }, selectedNode })
        }
      />
      <div className='hashContainer' onClick={(evt) => evt.stopPropagation()}>
        {selectedNode?.data?.attributes?.hash && (<div className="hashValue">Node hash: { uint8ObjectToHexString(selectedNode.data.attributes.hash) }</div>)}
        {selectedNode?.data?.children?.[0] && !selectedNode.data?.children?.[1] && (<div className="hashValue"> Child hash: { uint8ObjectToHexString(selectedNode.data.children[0].attributes.hash) }</div>)}
        {selectedNode?.data?.children?.[0] && selectedNode.data?.children?.[1] && (<div className="hashValue">Left child hash: { uint8ObjectToHexString(selectedNode.data.children[0].attributes.hash) }</div>)}
        {selectedNode?.data?.children?.[1] && (<div className="hashValue">Right child hash: { uint8ObjectToHexString(selectedNode.data.children[1].attributes.hash) }</div>)}
      </div>
    </div>
  );
}

export default DisplayTree;
