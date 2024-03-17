import React, { useState } from 'react';
import styles from '../App.module.css';
import { sendMessage } from '../web3/sendMT';


const Vote = () => {
  const [contentID, setcontentID] = useState(0);
  const [optionID, setoptionID] = useState(0);

  const handleConfirm = async () => {
    try {
      const response = await sendMessage(contentID, optionID);
      if (response.status) {
        alert('Vote confirmed successfully.');
      } else {
        alert('Failed to confirm vote.');
      }
    } catch (error) {
      alert(error);
    }
    
  };

 
  return (
    <main className={styles.main}>
      <div className={styles.mainContainer}>
        <div className={styles.inputContainer}>
          <input
            id="contentID"
            type="text"
            className={styles.input}
            value={contentID}
            onChange={(e) => setcontentID(e.target.value)}
            placeholder="Voting id"
          />
          <input
            id="optionID"
            type="text"
            className={styles.input}
            value={optionID}
            onChange={(e) => setoptionID(e.target.value)}
            placeholder="Option id"
          />
          <button className={styles.button} onClick={handleConfirm}>
            Confirm
          </button>

        </div>
      </div>
    </main>
  );
};

export default Vote;