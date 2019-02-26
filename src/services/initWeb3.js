import Web3 from 'web3'
var ProviderEngine = require('web3-provider-engine');
var RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
var LedgerWalletSubproviderFactory = require('./ledger-wallet-provider').default;

import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import FetchSubprovider from "web3-provider-engine/subproviders/fetch";



export const connectToMetamask = async () => {

  let web3js
  if (window.ethereum) {
    window.web3 = new Web3(ethereum)
    web3js = new Web3(ethereum)
    await ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
    web3js = new Web3(window.web3.currentProvider)
  } else {
    throw new Error('Metamask is not Enabled')
  }
  
  if(web3js) {
    return web3js
  }

}

export const initWeb3Hardware = () => {

  return new Promise(
    async (resolve, reject) => { 
      let Transport = TransportWebUSB
      let supported = await Transport.isSupported()
      if (!supported) {
        Transport = TransportU2F
        supported = await Transport.isSupported()
      }
      if (!supported) {
        return reject(new Error("No supported ledger transport available"))
      }         
      const engine = new ProviderEngine();
      const getTransport = () => Transport.create();
      const ledger = createLedgerSubprovider(getTransport, {
        networkId:1,
        accountsLength: 5
      });

      ledger.signMessage = ledger.signPersonalMessage;
      engine.addProvider(ledger);
      engine.addProvider(new FetchSubprovider({ rpcUrl: "https://mainnet.infura.io/5Ic91y0T9nLh6qUg33K0"}));
      engine.start();
      resolve(new Web3(engine))
    }
  )

}

export const initWeb3 = () => {

  return new Promise(
    async (resolve, reject) => {
      let myWeb3 = null      
      if(window.ethereum) {
        myWeb3 = new Web3(ethereum)
        try {
          await ethereum.enable()
        } catch(err) {          
          reject("User denied access to Metamask")
        }
      } else if(window.web3) {
        myWeb3 = new Web3(window.web3.currentProvider)
      } else {
        reject("no Metamask installation detected")
      }
      window.web3 = myWeb3
      resolve(myWeb3)

    }
  )

}


export const init2 = async () => {
  let web3js
  if (window.ethereum) {
    window.web3 = new Web3(ethereum)
    web3js = new Web3(ethereum)
    try {
      await ethereum.enable();
    } catch (err) {
      // this.setErrorMsg("User denied access to Metamask")
      console.error(err)
      return
    }
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
    web3js = new Web3(window.web3.currentProvider)
  } else {
    // this.setErrorMsg('Metamask is not Enabled')
  }

  return web3js
}