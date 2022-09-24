import { useState, useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { formatEther } from '@ethersproject/units'
import './WalletInfo.css'


function WalletInfo() {
  const { active, account, activate, chainId, library } = useWeb3React();
  const balance = useBalance();

  return (
    <div className="container walletInfo d-flex justify-content-center">
      <div>
        <div className="walletInfoHeader">
          <h1>
            Hi!
          </h1>
          <p>
            Here is your wallet Informations.
          </p>
        </div>
      
          {
            active ? (
              <>
                <div className="walletInfoContent py-5">
                  <div className="accountAddress pb-5">
                    <h3 className="accountTitle d-flex justify-content-center">
                      Account
                    </h3>
                    <p className=" d-flex justify-content-center">
                      {account}
                    </p>
                  </div>
                  <div className="accountBalanceNetwork">
                    <h3 className="accountBalanceNetworkTitle  d-flex justify-content-center">
                      {chainId === 1 ? "Mainnet" : "Testnet"} Balance
                    </h3>
                    <p className=" d-flex justify-content-center">
                      {balance}
                    </p>
                  </div>
                </div>
                
              </>
            ):(
              <>
                <div className="walletInfoContent py-5">
                  <div className="accountAddress pb-5">
                    <h3 className="accountTitle  d-flex justify-content-center py-5">
                      Account
                    </h3>
                  </div>
                  <div className="accountBalanceNetwork  d-flex justify-content-center">
                    <h3 className="accountBalanceNetworkTitle">
                      Network Balance
                    </h3>
                  </div>
                </div>
                <button 
                  className="showInfoButton"
                  onClick={()=>{
                  activate(new InjectedConnector({}));
                }}
                >
                  Show My Wallet Informations
                </button>
              </>
            )
          }
      </div>
    </div>
  )
}

function useBalance(){
  const {account, library} =  useWeb3React();
  const [balance, setBalance] = useState();

  useEffect(() => {
    if(account) {
      library.getBalance(account).then(val => setBalance(val));
    }
  }, [account, library]);

  return balance ? `${formatEther(balance)} ETH` : null;
}

export default WalletInfo
