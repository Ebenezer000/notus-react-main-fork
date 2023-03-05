
 export const connectMetamask = async () =>{
  const web3 = window.web3;
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  console.log(accounts[0])
  return accounts[0];
}

export const getChainId = async () => {
  const web3 = window.web3;
  const networkId = await web3.eth.net.getId();
  //console.log(networkId);
  return networkId;
}



