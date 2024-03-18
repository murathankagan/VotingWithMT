import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import styles from './App.module.css'
import Vote from './components/Vote';
import VoteList from './components/VoteList';
import VotingCreate from './components/VotingCreate';

function App() {
  

  // const switchNetworkToSepolia = async () => {
  //   if (window.ethereum) {
  //     try {
  //       await window.ethereum.request({
  //         method: 'wallet_addEthereumChain',
  //         params: [{
  //           chainId: '0x' + parseInt('11155111', 10).toString(16),
  //           chainName: 'Sepolia',
  //           nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  //           rpcUrls: ['https://rpc.sepolia.org'],
  //           blockExplorerUrls: ['https://sepolia.etherscan.io'],
  //         }],
  //       });
  //     } catch (error) {
  //       console.error("Failed to switch network:", error);
  //     }
  //   } else {
  //     alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
  //   }
  // };

  const switchNetworkToArbitrumSepolia = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x' + parseInt('421614', 10).toString(16),
            chainName: 'Arbitrum Sepolia',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
            blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
          }],
        });
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    } else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  // switchNetworkToSepolia();
  switchNetworkToArbitrumSepolia();
  const [nav, setNav] = useState('vote');
  const voteButton = nav === "" ? styles.button : styles.voteButton;
  const voteListButton = nav === "" ? styles.button : styles.voteListButton;
  const voteCreateButton = nav === "" ? styles.button : styles.voteCreateButton;
  const [connectedStatus, setConnectedStatus] = useState(false);



  const handleClick = (value) => {
    setNav(value);
  };

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          throw new Error('Please connect to MetaMask.');
        } else {
          console.log('Connected to MetaMask with account:', accounts[0]);
          setConnectedStatus(true);
        }
      } catch (error) {
        console.error("User denied account access...", error);
      }
    } else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  const handleButtonClick = async () => {
    if (connectedStatus) {
      alert('Already connected');
    } else {
      await connectMetamask();
    }
  };


  return (
    <React.StrictMode>
      <button className={styles.connectButton} onClick={handleButtonClick}>
        {connectedStatus ? `${window.ethereum.selectedAddress.slice(0, 10)}` : 'Connect'}
      </button>
      <button className={voteButton} onClick={() => handleClick('vote')}>Vote</button>


      <button className={voteCreateButton} onClick={() => handleClick('voteCreate')}>Create a Voting</button>

      <button className={voteListButton} onClick={() => handleClick('voteList')}>Voting List</button>
        {nav === 'vote' ? <Vote /> : nav === 'voteList' ? <VoteList /> : nav === 'voteCreate' && <VotingCreate />}
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
