import React from "react";

// components
import CardLineChart from "components/Cards/CardLineChart.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardBarChart from "components/Cards/CardBarChart";
import { ethers } from 'ethers';
import { notify } from '../../components/Notify';
import { alertifyCloseAllPrompt, alertifyPrompt } from '../../components/Alertify';
import { initPendingInterval } from '../../hooks/AceTrack';
import { hex2Int, ether2wei } from '../../utils/utilities'

export const Dashboard = ({ address, provider, ethBalance, chain, connect, disconnect }) => {

    const [afiAmount, setAfiAmount] = useState(0);
    const [afiExchangeRate, setAfiExchangeRate] = useState(0.000103);
    const [rwtBalance, setRwtBalance] = useState('');

    const [ethBuyAmount, setEthBuyAmount] = useState(afiExchangeRate || 0);

    const calculateSale = (event) => {
        const amount = parseFloat(event.target.value);
        setEthBuyAmount(amount);
        const eqiAmount = amount / afiExchangeRate;
        setAfiAmount(eqiAmount.toPrecision(10));
    }

    const REF_ADDRESS = '0x0000000000000000000000000000000000000000';

    const getRWTBalance = async (address) => {

        try {
            const signer = provider.getSigner();
            const contract = new ethers.Contract('0xe8fe8fFf991dDBC45360Fb8c14B5d53c3D4467c7', TOKENICO_ABI, signer);
            const fullBal = await contract.BUYERS(address);
            const bal = fullBal[1];
            console.log({ bal: parseFloat(hex2Int(bal._hex), 15) })
            return parseFloat(bal);
        } catch (e) {
            console.log({ balanceError: e })
        }
    }

    const loadWallet = async () => {
        const rwtBalance = await getRWTBalance(address)
        setRwtBalance(rwtBalance);
    }

    useEffect(() => {
        async function fetchData() {
            loadWallet()
        }
        if (provider !== null) {
            fetchData();
        }

    }, [address]);


    const buyICO = async () => {
        const signer = provider.getSigner();

        try {
            {/**
            alertifyPrompt(
                `<div class="text-center small mb-4"><div>Payment request sent to 0x80803D835A1Aba452261eeD93e0976a779Ea82C0 wallet! Please <b>Authorize/Reject</b> request</div><div class="loader-spin"></div><small class="mb-4"><b> info: </b> restart metamask or any compatible wallet connect app to trigger request. refresh page if unable to trigger request.</small></div>`
            )
            **/}
            const contract = new ethers.Contract('0xe8fe8fFf991dDBC45360Fb8c14B5d53c3D4467c7', TOKENICO_ABI, signer);
            console.log(contract)
            await contract.userDeposit(
                0,
                REF_ADDRESS, {
                from: address,
                value: ethers.utils.parseEther(`${ethBuyAmount}`)
            }).then((tx) => {
                {/**
                alertifyPrompt(
                    `<div class="text-center small mb-4"><div>Transaction submitted! Waiting for confirmation</div><div class="loader-spin"></div><small class="mb-4"><b> info: </b> RWT will be transfered after block confirmation.</small></div>`
                )
                **/}
                initPendingInterval(tx.hash)
                console.log('txHash', tx.hash);
            });

        } catch (error) {
            alertifyCloseAllPrompt()
            notify(`${error.code} | ${error.message}`, 4);
        }

    }

    const courImages = [
        {
            original: 'wp-content/themes/therewardtoken/img/c2.jpg',
            description: 'Tickets for Comic Con? ',
            sizes: '100px'
        },
        {
            original: 'wp-content/themes/therewardtoken/img/nc3.jpg',
            description: 'Seven Star Burj Al Arab Evening',
        },
        {
            original: 'wp-content/themes/therewardtoken/img/c5.jpg',
            description: 'Gucci bags, Loui Vuitton Shoes, Iphone Latest & Chanel Dresses ',
        },
    ]


  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardLineChart />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardBarChart />
        </div>
      </div>
      <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardPageVisits />
        </div>
      </div>
    </>
  );
}
