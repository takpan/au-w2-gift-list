import React from "react";
import { useState, useEffect } from "react";
import { MerkleTree } from "./MerkleTree";
import server from "./server";

function ClaimGift({ leaves }) {
  const [selectedName, setSelectedName] = useState("");
  const [merkleProof, setMerkleProof] = useState([]);
  const [receiverName, setReceiverName] = useState("");
  const [customName, setCustomName] = useState(false);
  const [isRecipient, setIsRecipient] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);

  useEffect(() => {
    setSelectedName(leaves[0]);
    setReceiverName(leaves[0]);
    updateMerkleProof(leaves[0]);
  }, []);

  const updateMerkleProof = (name) => {
    const merkleTree = new MerkleTree(leaves);
    const index = leaves.indexOf(name);
    const proof = merkleTree.getProof(index);
    setMerkleProof(proof);
  };

  const handleNameChange = (event) => {
    const name = event.target.value;
    setSelectedName(name);
    setReceiverName(name);
    updateMerkleProof(name);
    setIsResultVisible(false);
  };

  const handleCustomNameChange = (event) => {
    setReceiverName(event.target.value);
    setIsResultVisible(false);
  };

  const handleCheckboxChange = (event) => {
    setCustomName(event.target.checked);
    setReceiverName(selectedName);
    setIsResultVisible(false);
  };

  const claimGift = async () => {
    const leaf = new TextEncoder().encode(receiverName);

    try {
      const response = await server.post(`gift`, {
        proof: merkleProof,
        leaf: Array.from(leaf),
      });
      setIsRecipient(response.data.isInTheList);
    } catch (error) {
      alert(error.message);
    }

    setIsResultVisible(true);
  };

  return (
    <div className="container claimGiftContainer">
      <h1>Claim gift</h1>
      <div>
        {customName ? (
          <label>
            Name:
            <input
              placeholder="Type a name"
              value={receiverName}
              onChange={handleCustomNameChange}
            />
          </label>
        ) : (
          <label>
            Name:
            <select value={selectedName} onChange={handleNameChange}>
              {leaves.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={customName}
          onChange={handleCheckboxChange}
        />
        <label>Edit the name</label>
      </div>
      { customName && <label>Changing a name does not alter the Merkle proof, but the Root hash obtained with the Merkle proof will not match the actual Root hash.</label> }

      <div>
        <h3>Merkle Proof</h3>
        <table className="proofTable">
          <thead>
            <tr>
              <th>Data</th>
              <th>Is left?</th>
            </tr>
          </thead>
          <tbody>
            {merkleProof.map((item, index) => (
            <tr key={index}>
              <td>{item.data}</td>
              <td>{item.left.toString()}</td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="inlineContainer">
        <button className="button" onClick={claimGift}>
          Claim gift
        </button>
        { isResultVisible && (<div className="giftContainer">
          <span>{receiverName}{isRecipient ? (", you got a toy robot!") : (", you are not on the list :(")}</span>
          <img src={isRecipient ? ("../img/gift.png") : ("../img/forbidden.png")} className="giftImage"/>
        </div>)}
      </div>
    </div>
  );
}

export default ClaimGift;
