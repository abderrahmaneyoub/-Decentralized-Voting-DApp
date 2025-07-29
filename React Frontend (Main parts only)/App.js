import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingABI from './VotingABI.json';

const CONTRACT_ADDRESS = '0xYourContractAddress';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState('');

  const connectWallet = async () => {
    const prov = new ethers.providers.Web3Provider(window.ethereum);
    await prov.send('eth_requestAccounts', []);
    const signer = prov.getSigner();
    const votingContract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI, signer);
    setProvider(prov);
    setContract(votingContract);

    const candidatesList = await votingContract.getCandidates();
    setCandidates(candidatesList);
  };

  const vote = async () => {
    try {
      const tx = await contract.vote(selected);
      await tx.wait();
      setMessage(`Voted for ${selected} successfully!`);
    } catch (err) {
      setMessage('Voting failed: ' + err.message);
    }
  };

  useEffect(() => {
    if (window.ethereum) connectWallet();
  }, []);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Decentralized Voting</h1>
      <select
        className="border p-2 mb-4 w-full"
        onChange={e => setSelected(e.target.value)}
        value={selected}
      >
        <option>Select Candidate</option>
        {candidates.map((cand, i) => (
          <option key={i} value={cand}>{cand}</option>
        ))}
      </select>
      <button onClick={vote} className="bg-blue-500 text-white px-4 py-2 rounded">Vote</button>
      <p className="mt-4 text-green-600">{message}</p>
    </div>
  );
}

export default App;
