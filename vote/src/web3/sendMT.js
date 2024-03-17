import { ethers } from 'ethers';
import deployConfig from '../web3/deploy.json';
import forwarderAbi from '../abi/Forwarder.json';
import voteAbi from '../abi/Vote.json';

async function sendMessage(chainID, optionID) {
    if (!chainID || chainID.length < 1) throw new Error('Chain ID cannot be empty');
    if (!optionID || optionID.length < 1) throw new Error('Option ID cannot be empty');

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const recipient = new ethers.Contract(deployConfig.VoteAddress, voteAbi, signer);
    console.log("ChainID "+chainID);
    console.log("OptionID " + optionID);

    const accounts = await provider.send('eth_accounts');
    if (accounts.length === 0) {
        throw new Error('No Ethereum accounts found. Please connect your wallet.');
    }
    const selectedAddress = accounts[0];

    return await sendMetaTx(recipient, signer, chainID, optionID, selectedAddress);
}

async function sendMetaTx(recipient, signer, chainID, optionID, selectedAddress) {
    const forwarder = new ethers.Contract(deployConfig.ForwarderAddress, forwarderAbi, signer);
    const data = recipient.interface.encodeFunctionData('voteContent', [chainID, optionID]);
    const to = recipient.address;

    const { signature, request } = await signMetaTxRequest(forwarder, { to, from: selectedAddress, data }, signer);

    const response = await fetch('http://localhost:4000/relayTransaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request, signature }),
    });

    const responseData = await response.json();
    return responseData;
}

async function signMetaTxRequest(forwarder, input, signer) {
    const request = await buildRequest(forwarder, input);
    const toSign = await buildTypedData(request);
    const signature = await signTypedData(signer, toSign);
    return { request, signature };
}

async function buildRequest(forwarder, input) {
    const nonce = await forwarder.getNonce(input.from);
    const request = {
        value: 0,
        gas: 10000000,
        nonce: nonce.toString(),
        from: input.from,
        to: input.to,
        data: input.data,
    };
    return request;
}

async function buildTypedData(request) {
    const chainId = 11155111;
    const typeData = getMetaTxTypeData(chainId, deployConfig.ForwarderAddress);
    return {
        ...typeData,
        message: request
    };
}

function getMetaTxTypeData(chainId, forwarderAddress) {
    const EIP712Domain = [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
    ];

    const ForwardRequest = [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'gas', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'data', type: 'bytes' },
    ];

    return {
        types: {
            EIP712Domain,
            ForwardRequest,
        },
        domain: {
            name: 'Forwarder',
            version: '0.0.1',
            chainId,
            verifyingContract: forwarderAddress,
        },
        primaryType: 'ForwardRequest',
    };
}

async function signTypedData(signer, data) {
    try {
        const stringifiedData = JSON.stringify(data);
        const result = await signer.provider.send('eth_signTypedData_v4', [await signer.getAddress(), stringifiedData]);

        const types = {
            ForwardRequest: [
                { name: 'from', type: 'address' },
                { name: 'to', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'gas', type: 'uint256' },
                { name: 'nonce', type: 'uint256' },
                { name: 'data', type: 'bytes' },
            ]
        }

        const domain = {
            name: 'Forwarder',
            version: '0.0.1',
            chainId: 11155111,
            verifyingContract: deployConfig.ForwarderAddress
        }

        const recoveredAddress = ethers.utils.verifyTypedData(domain, types, data.message, result)

        console.log("sender: ", await signer.getAddress());
        console.log("recoveredAddress: ", recoveredAddress);

        return result;
    } catch (error) {
        console.error('Error signing typed data:', error);
        throw error;
    }
}

export { sendMessage };