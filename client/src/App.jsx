import { useState } from "react";
import GiftRecipients from "./GiftRecipients";
import DisplayTree from "./DisplayTree";
import ClaimGift from "./ClaimGift";
import "./App.scss";

function App() {
  const [leaves, setLeaves] = useState([]);
  const [rootHashSent, setRootHashSent] = useState(false);

  return (
    <div className="app">
      <div className="row">
        <GiftRecipients
          leaves={leaves}
          setLeaves={setLeaves}
          rootHashSent={rootHashSent}
          setRootHashSent={setRootHashSent}
        />
        <DisplayTree leaves={leaves} />
      </div>
      {rootHashSent && (
        <div className="row">
          <ClaimGift leaves={leaves} />
        </div>
      )}
    </div>
  );
}

export default App;
