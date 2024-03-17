// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import '../src/Forwarder.sol';
import '../src/Vote.sol';

contract VoteScript is Script {
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


        vm.stopBroadcast();

    }

    function run() public {
        vm.broadcast();
    }
}
