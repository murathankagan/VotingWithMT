// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Vote} from "../src/Vote.sol";
import {Forwarder} from "../src/Forwarder.sol";

contract VoteTest is Test {
    Vote vote;
    Forwarder forwarder;

    function setUp() public {

        bytes4 voteContentSignature = bytes4(keccak256("voteContent(uint256, uint256)"));
        bytes4[] memory allowedFunctionSignatures = new bytes4[](1);
        allowedFunctionSignatures[0] = voteContentSignature;

        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        address sponsorAddress = 0x97E7f2B08a14e4C0A8Dca87fbEB1F68b397c91df;
        
        Forwarder forwarder = new Forwarder(allowedFunctionSignatures, sponsorAddress);

        address forwarderAddress = address(forwarder);


        Vote vote = new Vote(forwarderAddress);

    }

    
    function testCreateContent() public {
       
        string memory contentUrl = "https://example.com/content";
        address tokenAddress = 0xCbc2E05E9B1bB477Bf620EF0704A8A504a43358d;
        uint256 votingDuration = 60 * 60 * 24; 
        uint256 options = 3; 
        uint256 voterCount = 3; 

        vote.createContent(contentUrl, tokenAddress, votingDuration, options, voterCount);
    }

    function testVoteContent() public {
        uint256 contentId = 1;
        uint256 voteId = 1;

        vote.voteContent(contentId, voteId);
    }

    function testGetBalanceOf() public {

        address tokenAddress = 0xCbc2E05E9B1bB477Bf620EF0704A8A504a43358d;

        uint256 balance = vote.getbalanceOf(tokenAddress);

        assertEq(balance, 100); 
    }
}
