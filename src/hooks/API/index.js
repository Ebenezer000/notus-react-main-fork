import { formatEther } from "@ethersproject/units";
import { etherScan } from "../AceTrack"

export const assetBalance = async (address) => {
    try {
        let response = await etherScan(`module=account&action=balance&address=${address}&tag=latest`);
        let balance = parseFloat(formatEther(response.data.result)).toPrecision(5);
        //console.log(balance);
        return balance;
    } catch (error) {
        console.log(error)
    }
}