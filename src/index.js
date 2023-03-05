import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import Admin from "layouts/Admin.js";
import { notify } from "components/Notify";
import {Navbar} from "components/Navbars/IndexNavbar.js";
import Index from "views/Index.js";
import Web3Modal from "web3modal";

import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from 'ethers';

export const RoutePages = () => {

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

return (
  <>
    <BrowserRouter>
      <Navbar address={address} ethBalance={ethBalance} chain={chainId} connect={initConnect} disconnect={disconnect} />
      <Switch>
          <Route path="/" component={Index} />
          <Route path="/admin" component={Admin}>
              <Admin
                  address={address}
                  ethBalance={ethBalance}
                  chain={chainId}
                  connect={initConnect}
                  disconnect={disconnect}
                  provider={provider} />
          </Route>
      </Switch>
    </BrowserRouter>
  </>
)
}
