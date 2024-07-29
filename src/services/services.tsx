import { ethers } from 'ethers';
import AlderABI from './AlderABI.json'; // Adjust the path as necessary

const ganacheProviderURL = 'http://localhost:8545';
const contractAddress = "0x86854710bd42200e25D392aCDF966aDD7e29491D"; // Replace with your contract address on Ganache

const getProviderAndContract = async () => {
  const provider = new ethers.providers.JsonRpcProvider(ganacheProviderURL);
  const signer = provider.getSigner(0); // Use the first account by default
  const contract = new ethers.Contract(contractAddress, AlderABI, signer);
  return contract;
};

// Token management functions
export const mintACDR = async (amount: number) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.mintACDR(amount);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const retire = async (amount: number) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.retire(amount);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const setFarmerACDR = async (farmer: string, amount: number) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.setFarmerACDR(farmer, amount);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

// Farmer management functions
export const addFarmer = async (farmer: string, farmerId: number) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.addFarmer(farmer, farmerId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const removeFarmer = async (farmer: string) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.removeFarmer(farmer);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

// VVB management functions
export const addVVB = async (vvb: string, vvbId: number) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.addVVB(vvb, vvbId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const removeVVB = async (vvb: string) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.removeVVB(vvb);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const assignVVBToProject = async (projectId: number, vvb: string) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.assignVVBToProject(projectId, vvb);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const assignVVBToMRV = async (reportId: number, vvb: string) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.assignVVBToMRV(reportId, vvb);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

// Project and MRV report management functions
export const acceptProject = async (projectId: number) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.acceptProject(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const rejectProject = async (projectId: number) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.rejectProject(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const addMRVReport = async (reportId: number, projectId: number, owner: string, date: number, blob: string) => {
  const blobBytes = ethers.utils.toUtf8Bytes(blob);
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.addMRVReport(reportId, projectId, owner, date, blobBytes);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const removeMRVReport = async (reportId: number) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.removeMRVReport(reportId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const addProject = async (projectId: number, owner: string, dateOfSubmission: number, blob: string) => {
  const blobBytes = ethers.utils.toUtf8Bytes(blob);
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.addProject(projectId, owner, dateOfSubmission, blobBytes);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const removeProject = async (projectId: number) => {
  try {
    const contract = await getProviderAndContract();
    const tx = await contract.removeProject(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

// Getter functions
export const getFarmerBalance = async (farmer: string) => {
  try {
    const contract = await getProviderAndContract();
    const balance = await contract.getFarmerBalance(farmer);
    return balance;
  } catch (error) {
    console.error(error);
  }
};

export const getFarmer = async (farmer: string) => {
  try {
    const contract = await getProviderAndContract();
    const farmerData = await contract.getFarmer(farmer);
    return farmerData;
  } catch (error) {
    console.error(error);
  }
};

export const getVVB = async (vvb: string) => {
  try {
    const contract = await getProviderAndContract();
    const vvbData = await contract.getVVB(vvb);
    return vvbData;
  } catch (error) {
    console.error(error);
  }
};

export const getFarmerContribution = async (farmer: string) => {
  try {
    const contract = await getProviderAndContract();
    const contribution = await contract.getFarmerContribution(farmer);
    return contribution;
  } catch (error) {
    console.error(error);
  }
};

export const getFarmerContributionPercentage = async (farmer: string) => {
  try {
    const contract = await getProviderAndContract();
    const contributionPercentage = await contract.getFarmerContributionPercentage(farmer);
    return contributionPercentage;
  } catch (error) {
    console.error(error);
  }
};

export const getTotalPool = async () => {
  try {
    const contract = await getProviderAndContract();
    const totalPool = await contract.getTotalPool();
    return totalPool;
  } catch (error) {
    console.error(error);
  }
};

export const getProjectDetails = async (projectId: number) => {
  try {
    const contract = await getProviderAndContract();
    const projectDetails = await contract.getProjectDetails(projectId);
    return projectDetails;
  } catch (error) {
    console.error(error);
  }
};

export const getMRVReportDetails = async (reportId: number) => {
  try {
    const contract = await getProviderAndContract();
    const mrvReportDetails = await contract.getMRVReportDetails(reportId);
    return mrvReportDetails;
  } catch (error) {
    console.error(error);
  }
};
