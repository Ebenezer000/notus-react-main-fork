import axios from 'axios';
import { alertifyCloseAllPrompt, alertifyPrompt } from '../../components/Alertify';
import { notify } from '../../components/Notify';
import { ACETRACK_API, ALLOWED_CHAIN, CHAIN, CHAIN_API, CHAIN_API_KEY } from '../../constants';

export async function etherScan(endpoint, data = {}){
    return await axios.post(`https://${CHAIN_API[ALLOWED_CHAIN]}.bscscan.com/api?${endpoint}&apikey=${CHAIN_API_KEY}`, data);
}

export const verifyChain = (chainId) => {
    if(chainId !== ALLOWED_CHAIN && CHAIN[chainId] !== undefined){
        //console.log('no entry');
        alertifyPrompt(
            `<b><center>${CHAIN[chainId]} Detected! Please connect to ${CHAIN[ALLOWED_CHAIN]} to access ACETrack</center></b>`
        );
        return;
    }
    alertifyCloseAllPrompt();
    return;
}

export const trimAccount = (address = false) =>{
    return (address) ? address.toString(16).slice(-4) : Math.random().toString(16).slice(-4);
}
export const generateId = (address) =>{
    return trimAccount(false) + trimAccount(false) +
    '-' + trimAccount(false) +
    '-' + trimAccount(false) +
    '-' + trimAccount(false) +
    '-' + trimAccount(false) + trimAccount(false) + trimAccount(address)
}

export const executeAcetrackAPI = async (endpoint, payload, method) =>{
    const response = await axios[method](`${ACETRACK_API}${endpoint}`,payload);
    return response.data.data;
}

export const authAccount = async (address) =>{
    const payload = {
        sponsor: "",
        account: address,
        idx: generateId(address),
        date: Date.now()
    }
    const response = await executeAcetrackAPI('authAccount', payload, 'post');
    //notify(response.message, 0)
    return response.idx
}

export const fetchActivities = async (idx) =>{
    const payload = {}
    const response = await executeAcetrackAPI(`getActivities/${idx}`, payload, 'get')
    return response
}

export const fetchTransactions = async (idx) =>{
    const payload = {}
    const response = await executeAcetrackAPI(`getTransactions/${idx}`, payload, 'get')
    // console.log(response)
    return response
}

let handle;

export const initPendingInterval = (txHash) =>{
    handle = setInterval(() => {
        lookupPendingHash(txHash)
    }, 5000);
    return handle;
}

export const lookupPendingHash = async (txHash) =>{
    await etherScan(`module=transaction&action=gettxreceiptstatus&txhash=${txHash}`).then(function (response) {
        if (response.data.result.blockHash !== null) {
            console.log(response);
            alertifyCloseAllPrompt()
            notify('Transaction confirmed!', 2);
            removeInterval();
        }


    }).catch(error => {
        console.log("Error:" + error);
    });
}

export function removeInterval() {
    clearInterval(handle);
}