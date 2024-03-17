import React from "react";
import "./App.scss";

function CustomNode({ nodeDatum, onNodeClick, toggleNode, foreignObjectProps, selectedNode }) {
  const isSelected = selectedNode?.data?.__rd3t.id === nodeDatum.__rd3t.id;
  const { name, attributes, children, __rd3t } = nodeDatum;

  return (
    <g>
      <foreignObject {...foreignObjectProps}>
        <div className={`nodeContainer ${isSelected ? 'nodeHighlight' : ''}`}>
          <div onClick={onNodeClick}>
            <h5 className="nodeHeader">{name}</h5>
            {attributes.value && (<label className="nodeValue">{attributes.value}</label>)}
            {attributes.partialHash &&(<label className="nodeHash">{attributes.partialHash}</label>)}
          </div>
          {children && (
            <div>
              <button  onClick={toggleNode} style={{ width: "100%" }}>
                {__rd3t.collapsed ? "Expand" : "Collapse"}
              </button>
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
}

export default CustomNode;
