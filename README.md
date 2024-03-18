# Voting App With Meta Transaciton

## Steps to install

### Clone to local

```bash
 git clone https://github.com/murathankagan/VotingWithMT.git
 cd VotingWithMT/contracts/vote
 forge install OpenZeppelin/openzeppelin-contracts 
```
 İf you don't have Foundry You can setup in your environment with the following [link](https://book.getfoundry.sh/getting-started/installation): 

### Configure the Contracts


```solidity
    function setUp() public {

        bytes4 voteContentSignature = bytes4(keccak256("voteContent(uint256,uint256)"));
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
```

- In the ``setUp()`` function in the ``Vote.s.sol`` file in the ``/script`` path, add the functions you want users to pay gas fee from the ``bytes4 voteContentSignature = bytes4(keccak256("voteContent(uint256,uint256)"));`` section as in the ``voteContent(uint256,uint256)`` example and include them in the ``allowedFunctionSignatures[0] = voteContentSignature;`` array.
- Followed by 
```bash
source .env
forge script script/Vote.s.sol:VoteScript --rpc-url $ETH_RPC_URL --private-key $DEPLOYER_PRIVATE_KEY --broadcast```
and paste the addresses of the deployed contracts ``Forwarder.sol`` and ``Vote.sol`` into the ``Forwarder`` and ``Vote`` sections of the ``/vote/src/web3/deploy.json`` path.


### Trying the Demo

#### Voting APP


- Now open a new terminal 
```bash

cd vote
npm install
npm run start

```
Let's open the demo by running the commands

- Then open a new terminal 
```bash
cd vote
node server.js 
```
Let's run our server code with the command. 

![Image](https://i.hizliresim.com/621tmi7.png)


#### Vote Create

- Now let's go to the Vote Create page by clicking on the button.
``URL:`` Here you must enter the url address of the vote to be created.
``Token Address:`` Here you should enter the ERC-1155 token address to be taken into account in the vote.
``Voting Duration:`` Here you must enter the duration of the vote in minutes.
``Option Amount:`` Here you must enter the number of options that can be voted for in the voting.
``Voters Amount:`` Here you must enter the maximum number of voters that can participate in the vote.

-After filling in these fields, confirm the transaction in the window that will open by pressing the ``Create Content`` button and start a vote.

#### Vote List 

- Now you can view the page where the votes are listed by clicking on the Voting List button in the navigation section above. 
- Find the id of the vote you created.
- ``Interact with Contract:`` In this section there are inputs that you can interact with the voting contract.
- ``Get Balance:`` In this section you can get the balance address of the public key that runs the function by entering the token address you used in your vote.
- ``Get Voter Votes:`` In this section, you can view the votes of the given public key address in the specified Content Id.
- ``Get Option Votes:`` In this section, you can view the voting results in the given content Id.



#### Vote

- In this section, enter the id of a vote you see on the Vote List page in the Conten ID field and in the option ID field, you can vote for the optionID value in the vote with the specified content ID.
- Since voting is a Meta Transaction, you do not need to pay any gas fee during this process.






