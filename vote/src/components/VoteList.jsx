import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styles from '../App.module.css';
import voteAbi from '../abi/Vote.json';
import deploy from '../web3/deploy.json';

const VoteList = () => {
 const [contents, setContents] = useState([]);
 const [tokenAddress, setTokenAddress] = useState('');
 const [contentId, setContentId] = useState('');
 const [voterAddress, setVoterAddress] = useState('');
 const [balance, setBalance] = useState(0);
 const [voterVotes, setVoterVotes] = useState({});
 const [optionVotes, setOptionVotes] = useState([]);

 useEffect(() => {
   loadContents();
 }, []);
 const initializeContract = async () => {
    if (!window.ethereum) {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error("User denied account access");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(deploy.VoteAddress, voteAbi, signer);
    return { provider, signer, contract };
 };

 const loadContents = async () => {
    const { contract } = await initializeContract();
    const contentCount = await contract.contentCount();
    const contents = [];
    for (let i = 1; i <= contentCount; i++) {
      const content = await contract.Contents(i);
      if (content.id !== 0) {
        contents.push({
          id: content.id,
          url: content.url,
          creator: content.creator,
          completed: content.completed,
          voteCount: content.voteCount,
          votersAmount: content.votersAmount,
          optionsAmount: content.optionsAmount,
          votingStartTime: content.votingStartTime,
          votingDuration: content.votingDuration,
          tokenAddress: content.tokenAddress,
        });
      }
    }
    setContents(contents);
 };

 const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); 
    return date.toLocaleString(); 
 };

 const formatDuration = (durationInSeconds) => {
    return Math.floor(durationInSeconds / 60) + ' minutes';
 };
 const getBalance = async () => {
    const { contract } = await initializeContract();
    const balance = await contract.getbalanceOf(tokenAddress);
    setBalance(balance);
 };

 const getVoterVotes = async () => {
    const { contract } = await initializeContract();
    const [votingAmount, optionsID, votingTime] = await contract.getVoterVotes(contentId, voterAddress);
    setVoterVotes({ votingAmount, optionsID, votingTime });
 };

  const getOptionVotes = async () => {
    const { contract } = await initializeContract();
    const content = contents.find(content => content.id === contentId);
    if (!content) {
      console.log('Content not found with the given contentId:', contentId);
      console.log('Contents:', contents);
      alert("Content not found with the given contentId");
      return;
    }
    console.log('Found content:', content);
    console.log('Content ID:', content.id, 'Type:', typeof content.id);
    console.log('Input Content ID:', contentId, 'Type:', typeof contentId);

    const optionsAmount = content.optionsAmount;
    let votesForEachOption = [];

    for (let i = 1; i <= optionsAmount; i++) {
      const optionVotes = await contract.getOptionVotes(contentId, i);
      votesForEachOption.push(optionVotes);
    }

    setOptionVotes(votesForEachOption);
  };
    
 return (
   <div className={styles.container}>
     <div>
     <h1 className={styles.headerText}>Voting List</h1>
       <div className={styles.scrollableListContainer}>
      <ul>
        {contents.map(content => (
          <li key={content.id} className={styles.listItem}>
            Content ID: {content.id.toString()}
            <br />
            URL: {content.url.toString()}
            <br />
            Creator: {content.creator.toString()}
            <br />
            Voting Completed: {content.completed ? 'Yes' : 'No'}
            <br />
            Vote Count: {content.voteCount.toString()}
            <br />
            Voters Amount: {content.votersAmount.toString()}
            <br />
            Voting Start Time: {formatDate(content.votingStartTime)}
            <br />
            Voting Duration: {formatDuration(content.votingDuration)}
            <br />
            Token Address: {content.tokenAddress.toString()}
          </li>
        ))}
      </ul>   
       </div>   
     </div>
     <div className={styles.interact}>
        <h2 className={styles.headerText}>Interact with Contract</h2>
        <input
          type="text"
          className={styles.input}
          placeholder="Token Address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <button className={styles.button} onClick={getBalance}>Get Balance</button>
        <p className={styles.headerText}>Balance: {balance.toString()}</p>

        <input
          type="text"
          className={styles.input}
          placeholder="Content ID"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Voter Address"
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
        />
        <button className={styles.button} onClick={getVoterVotes}>Get Voter Votes</button>
       <p className={styles.headerText}>Voter Votes: Voting Amount: {voterVotes.votingAmount?.toString() || '0'}, Options ID: {voterVotes.optionsID?.toString() || '0'}, Voting Time: {formatDate(voterVotes.votingTime)}</p>
        <input
          type="text"
          className={styles.input}
          placeholder="Content ID"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
        />

        <button className={styles.button} onClick={getOptionVotes}>Get Option Votes</button>
       <p className={styles.headerText}>Option Votes:</p>
       {optionVotes.map((votes, index) => (
         <p key={index} className={styles.headerText}>
            Option {index + 1}: {votes} votes
          </p>
        ))}
      </div>
    </div>
 );
};

export default VoteList;