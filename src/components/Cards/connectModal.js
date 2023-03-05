import React from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Web3ReactModal } from "@bitiumagency/web3-react-modal"
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'


const getLibrary = provider => {
    const lib = new Web3Provider(provider)
    return lib
  }

export default function ConnectWallet (props) {
    
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactModal
        useWeb3React={useWeb3React}
        supportedChains={[
          {
            chainId: 1
          }
        ]}
        connectors={[
          {
            title: "Wallet Connect",
            id: "walletconnect",
            connector: WalletConnectConnector,
            options: {
              rpc: {
                1: "https://mainnet.infura.io/v3/70d9c70a15ad4cdd91f57979fd0d9e21"
              },
              qrcode: true
            }
          }
        ]}
      />
    </Web3ReactProvider>
    
}