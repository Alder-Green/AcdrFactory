import React, { useEffect, useState, createContext, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import AlderABI from './AlderABI.json';

const web3modalStorageKey = 'WEB3_CONNECT_CACHED_PROVIDER';

export const WalletContext = createContext<any>({});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [contract, setContract] = useState<any>(null);
  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });

  const contractAddress = "0x9d00cc16e02ce6D8c708F537D010A48Ef633C670";

  useEffect(() => {
    async function checkConnection() {
      try {
        if (window && window.ethereum) {
          if (localStorage.getItem(web3modalStorageKey)) {
            await connectToWallet();
          }
        } else {
          console.log('window or window.ethereum is not available');
        }
      } catch (error) {
        console.log(error, 'Catch error Account is not connected');
      }
    }
    checkConnection();
  }, []);

  const setWalletAddress = async (provider: any) => {
    try {
      const signer = provider.getSigner();
      if (signer) {
        const web3Address = await signer.getAddress();
        setAddress(web3Address);
        getBalance(provider, web3Address);
      }
    } catch (error) {
      console.log('Account not connected; logged from setWalletAddress function');
    }
  };

  const getBalance = async (provider: any, walletAddress: string) => {
    const walletBalance = await provider.getBalance(walletAddress);
    const balanceInEth = ethers.utils.formatEther(walletBalance);
    setBalance(balanceInEth);
  };

  const disconnectWallet = () => {
    setAddress(undefined);
    web3Modal && web3Modal.clearCachedProvider();
  };

  const checkIfExtensionIsAvailable = () => {
    if (
      (window && window.web3 === undefined) ||
      (window && window.ethereum === undefined)
    ) {
      setError(true);
      web3Modal && web3Modal.toggleModal();
    }
  };

  const getContract = async (connection: any) => {
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, AlderABI, signer);
  };

  const connectToWallet = async () => {
    try {
      setLoading(true);
      checkIfExtensionIsAvailable();
      const connection = web3Modal && (await web3Modal.connect());
      const provider = new ethers.providers.Web3Provider(connection);
      await subscribeProvider(connection);

      setWalletAddress(provider);
      const contractInstance = await getContract(provider);
      setContract(contractInstance);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error, 'got this error on connectToWallet catch block while connecting the wallet');
    }
  };

  const subscribeProvider = async (connection: any) => {
    connection.on('close', () => {
      disconnectWallet();
    });
    connection.on('accountsChanged', async (accounts: string[]) => {
      if (accounts?.length) {
        setAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(connection);
        getBalance(provider, accounts[0]);
        const contractInstance = await getContract(provider);
        setContract(contractInstance);
      } else {
        disconnectWallet();
      }
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        loading,
        error,
        connectToWallet,
        disconnectWallet,
        contract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
