import React, { useState } from 'react';
import { ethers } from 'ethers';
import VoteABI from '../abi/Vote.json'; 
import deploy from '../web3/deploy.json';
import styles from '../App.module.css';

const VotingCreate = () => {

    const [url, setUrl] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [votingDuration, setVotingDuration] = useState('');
    const [optionCount, setOptionCount] = useState('');
    const [voterCount, setVoterCount] = useState('');

    const createContent = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(deploy.VoteAddress, VoteABI, signer);

            try {
                const tx = await contract.createContent(url, tokenAddress, votingDuration, optionCount, voterCount);
                await tx.wait();
                alert('Content created successfully');
            } catch (error) {
                console.error('Failed to create content:', error);
            }
        } else {
            alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.mainContainer}>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Token Address"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Voting Duration (minutes)"
                        value={votingDuration}
                        onChange={(e) => setVotingDuration(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Option Amount"
                        value={optionCount}
                        onChange={(e) => setOptionCount(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Voter Amount"
                        value={voterCount}
                        onChange={(e) => setVoterCount(e.target.value)}
                        className={styles.input}
                    />
                    <button onClick={createContent} className={styles.button}>
                        Create Content
                    </button>
                </div>
            </div>
        </main>
    );
};

export default VotingCreate;