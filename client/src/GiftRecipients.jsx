import React from "react";
import { useState } from "react";
import server from "./server";
import { MerkleTree } from "../../utils/MerkleTree";
import niceList from "../../utils/niceList.json";

function GiftRecipients({ leaves, setLeaves, rootHashSent, setRootHashSent }) {
  const [inputNameManually, setInputNameManually] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [name, setName] = useState(niceList[0]);
  const [niceListIndex, setNiceListIndex] = useState(0);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const handleCheckboxChange = (event) => {
    setInputNameManually(event.target.checked);
    setInputDisabled(!event.target.checked);
    !event.target.checked ? setName(niceList[niceListIndex]) : setName("");
  };

  const addName = () => {
    if (rootHashSent) {
      alert("The gift list (represented by the Merkle root hash) has been set on the server. No additional recipients can be appended. You can reset the list to include new names.")
      return
    }

    const newLeaves = [...leaves, name];
    setLeaves(newLeaves);
    updateInputValue();
  }

  const updateInputValue = () => {
    if (inputDisabled) {
      setName(niceList[niceListIndex+1]);
      setNiceListIndex(niceListIndex+1);
    } else {
      setName("");
    }
  }

  const setTree = async (event) => {
    event.preventDefault();
    
    if (rootHashSent) {
      alert("The gift list has already been set on the server.")
      return;
    }

    const rootHash = new MerkleTree(leaves).getRoot();

    try {
      await server.post(`setroot`, { rootHash });
    } catch (error) {
      console.error("Failed to set root hash:", error);
      alert("Failed to set root hash. Please try again.");
      return
    }

    setRootHashSent(true);
  };

  const resetTree = async () => {
    try {
      await server.get(`reset`);
    } catch (error) {
      console.error("Failed to reset tree:", error);
      alert("Failed to reset tree. Please try again.");
      return
    }

    const newLeaves = [];
    setLeaves(newLeaves);
    setName(niceList[0])
    setNiceListIndex(1);
    setInputDisabled(true);
    setInputNameManually(false);
    setRootHashSent(false);
  }

  return (
    <div className="container recipientsContainer" style={{ width: '20vw'}}>
      <h1>Gift Recipients</h1>
      <label>
        Name: 
        <input
          placeholder="Type a name to add in the list"
          value={name}
          disabled={inputDisabled}
          onChange={setValue(setName)}
        ></input>
      </label>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={inputNameManually}
          onChange={handleCheckboxChange}
        />
        <label>Set a name manually</label>
      </div>

      <button className="button" onClick={addName}>
        Add Name into gift list
      </button>

      <label>Before claiming gifts, you have to set the gift list (Root Hash) on the server</label>
      <button className="button" onClick={setTree}>
        Set Gift list
      </button>

      <label>You can delete all names by resetting the Merkle Tree and removing the Root Hash from the server</label>
      <button className="button" onClick={resetTree}>
        Reset Gift list
      </button>
    </div>
  );
}

export default GiftRecipients;
