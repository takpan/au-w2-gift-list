// Import modules
const express = require('express');
const cors = require("cors");
const verifyProof = require('./verifyProof');

// Express
const app = express();
const port = 3042;

// Middleware
app.use(cors());
app.use(express.json());

let merkleRoot = '';

// Set Merkle root
app.post('/setroot', (req, res) => {
  const { rootHash } = req.body;
  if (!rootHash) {
    return res.status(400).send({ message: "No root hash value received" });
  }

  merkleRoot = rootHash;
  res.sendStatus(204);
});

// Verify git recipient
app.post('/gift', (req, res) => {
  const { proof, leaf } = req.body;

  const isInTheList = verifyProof(proof, leaf, merkleRoot);
  res.send({ isInTheList });
});

// Reset Merkle root
app.get('/reset', (req, res) => {
  merkleRoot = '';
  res.sendStatus(204);
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
