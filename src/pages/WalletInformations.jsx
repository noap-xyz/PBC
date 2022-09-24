import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import WalletInfo from "../components/WalletInfo/WalletInfo";

export default function WalletInformations() {
  return (
    <div className='walletInformationsMain'>
      <Web3ReactProvider
      getLibrary={provider => new Web3Provider(provider)}
      >
        <WalletInfo />
      </Web3ReactProvider>
    </div>
  )
}
