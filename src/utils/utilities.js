import { EXPLORER } from "../constants";

export function ellipseAddress(
    address = "",
    width = 5
    ) {
    return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function formatDate(timestamp){
    const ts = new Date(timestamp);
    return ts.toLocaleTimeString();
}

export function txExplorer(chainId, txHash){
  window.open(`https://${EXPLORER[chainId]}etherscan.io/tx/${txHash}`);
}

export function ether2wei(ether) {
    ether = parseFloat(ether);
    return ether * Math.pow(10, 18);
}

export function wei2ether(wei) {
    wei = parseFloat(wei);
    return (wei / Math.pow(10, 18));
}

export function hex2Int(hex) {
    return parseInt(hex, 16);
}