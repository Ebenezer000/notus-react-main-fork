import React, {useState, useEffect} from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import { ethers } from 'ethers';
import { notify } from '../components/Notify';
import Web3Modal from "web3modal";

import WalletConnectProvider from "@walletconnect/web3-provider";

import {Dashboard} from "views/admin/Dashboard.js";
import Settings from "views/admin/Settings.js";

export default function Admin() {

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            initConnect()
        }
    }, [])

    //wallet states
    const [address, setAddress] = useState('');
    const [chainId, setChainId] = useState('');
    const [providers, setProviders] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [idx, setIdx] = useState('');
    const [ethBalance, setEthBalance] = useState('');

    //end states

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                rpc: {
                    56: "https://bsc-dataseed1.defibit.io",
                    97: "https://data-seed-prebsc-2-s1.binance.org:8545",
                },
            }
        },
    }

    const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions // required
    });

    const initConnect = async () => {
        try {
            const providers = await web3Modal.connect()
            setProviders(providers)
            const provider = new ethers.providers.Web3Provider(providers, "any")
            setProvider(provider)
            subscribeProvider(providers, provider)
        } catch (e) {
            notify("Could not get a wallet connection", 3);
            console.log(e)
            return;
        }
    }

    const loadBlockchainData = async (provider) => {
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        setAddress(address)
        setSigner(signer);
        const networkId = await provider.getNetwork()
        const chainId = networkId.chainId
        setChainId(chainId)
        const balance = await provider.getBalance(address)
        const ethBalance = parseFloat(ethers.utils.formatEther(balance)).toPrecision(3);
        setEthBalance(ethBalance);
    }

    const subscribeProvider = async (providers, provider) => {
        providers.on("disconnect", () => {
            notify("account disconnected", 4)
        });
        providers.on("accountsChanged", () => {
            loadBlockchainData(provider)
        });
        provider.on("network", (newNetwork, oldNetwork) => {
            if (newNetwork) {
                loadBlockchainData(provider)
            }
        });

        await loadBlockchainData(provider)
    }

    const disconnect = async () => {
        if (typeof providers.close !== "undefined") {
            providers.close()
        }
        await web3Modal.clearCachedProvider()
        window.location.reload()
    }

// views
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard">
              <Dashboard
                  address={address}
                  ethBalance={ethBalance}
                  chain={chainId}
                  connect={initConnect}
                  disconnect={disconnect}
                  provider={provider} />
          </Route>
            <Route path="/admin/settings" exact component={Settings} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
