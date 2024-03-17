// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Vote {
    ERC1155 public token;

    address private _trustedForwarder;

    constructor(address trustedForwarder) {
        _trustedForwarder = trustedForwarder;
    }

    struct Voter {
        uint256 votingAmount;
        uint256 votingTime;
        uint256 optionsID;
    }

    struct Content {
        uint256 id;
        string url;
        address creator;
        bool completed;
        uint256 voteCount;
        uint256 votersAmount;
        uint256 optionsAmount;
        uint256 votingStartTime;
        uint256 votingDuration;
        address tokenAddress;
        mapping(uint256 => uint256) votesOptiponCount;
        mapping(address => Voter) votes;
    }

    modifier onlyTrustedForwarder {
        require(msg.sender == _trustedForwarder, "only the trusted forwarder can call this function");
        _;
    }

    mapping(uint256 => Content) public Contents;
    uint256 public contentCount = 0;
    
    event VoteRecorded(uint256 contentId, address voter);

    function createContent(string memory _url, address _tokenAddress, uint256 _votingDuration, uint256 _optionAmount, uint256 _voterAmount) public {
        contentCount += 1;
        Content storage newContent = Contents[contentCount];
        newContent.id = contentCount;
        newContent.completed = false;
        newContent.creator = msg.sender;
        newContent.url = _url;
        newContent.tokenAddress = _tokenAddress; 
        newContent.votingStartTime = block.timestamp;
        newContent.votingDuration = _votingDuration * 60; 
        newContent.voteCount = 0;
        newContent.votersAmount = _voterAmount;
        newContent.optionsAmount = _optionAmount;

      
        for (uint256 i = 1; i <= _optionAmount; i++) {
            newContent.votesOptiponCount[i] = 0;
        }

    }
 
    function voteContent(uint256 _contentId, uint256 _voteID) public onlyTrustedForwarder {
        require(Contents[_contentId].id != 0, "Content does not exist");
        require(!Contents[_contentId].completed, "Content voting has been completed");
        require(Contents[_contentId].votersAmount > Contents[_contentId].voteCount, "All users have voted");

        address sender;
        assembly {
            sender := shr(96, calldataload(sub(calldatasize(), 20)))
        }
        token = ERC1155(Contents[_contentId].tokenAddress);
        require(token.balanceOf(sender, 0) > 0, "Not enough tokens to vote");
        require(Contents[_contentId].votes[sender].optionsID == 0, "Already voted for this content");

        
        if (block.timestamp > Contents[_contentId].votingStartTime + Contents[_contentId].votingDuration) {
            
            Contents[_contentId].completed = true;
            revert("Voting period has ended");
        }

        Contents[_contentId].votesOptiponCount[_voteID] += token.balanceOf(sender, 0);
        Contents[_contentId].voteCount += 1;
        if(Contents[_contentId].voteCount == Contents[_contentId].votersAmount){
            Contents[_contentId].completed = true;
        }
        Contents[_contentId].votes[sender].optionsID = _voteID;
        Contents[_contentId].votes[sender].votingAmount += 1;
        Contents[_contentId].votes[sender].votingTime = block.timestamp;

        emit VoteRecorded(_contentId, sender);
    }

    function getbalanceOf(address tokenAddress) public view returns (uint256) {
        ERC1155 tokenContract = ERC1155(tokenAddress);
        return tokenContract.balanceOf(msg.sender, 0);
    }


    function getVoterVotes(uint256 _contentId, address _voter) public view returns (uint256, uint256, uint256) {
        Voter memory voter = Contents[_contentId].votes[_voter];
        return (voter.votingAmount, voter.optionsID, voter.votingTime);
    }


    function getOptionVotes(uint256 _contentId, uint256 _optionId) public view returns (uint256) {
        return Contents[_contentId].votesOptiponCount[_optionId];
    }
}