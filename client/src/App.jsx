import GiftRecipients from "./GiftRecipients";
import MerkleTree from "./MerkleTree";
import ClaimGift from "./ClaimGift";
import "./App.scss";

function App() {

  return (
      <div className="app">
        <div className="row">
          <GiftRecipients
          />
          <MerkleTree treeData={treeData}
          />
        </div>
        <div>
          <ClaimGift
          />
        </div>
      </div>
  );
}

export default App;
