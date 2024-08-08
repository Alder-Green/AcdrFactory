import { ethers } from 'ethers';

// Token management functions
export const mintACDR = async (contract: ethers.Contract, amount: number) => {
  if (!contract) return;
  
  try {
    const tx = await contract.mintACDR(amount);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const retire = async (contract: ethers.Contract, amount: number) => {
  if (!contract) return;
  
  try {
    const tx = await contract.retire(amount);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const setFarmerACDR = async (contract: ethers.Contract, farmer: string, amount: number) => {
  if (!contract) return;
  
  try {
    const tx = await contract.setFarmerACDR(farmer, amount);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

// Farmer management functions
export const addFarmer = async (contract: ethers.Contract, farmer: string, farmerId: number) => {
  if (!contract) return;

  try {
    const tx = await contract.addFarmer(farmer, farmerId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const removeFarmer = async (contract: ethers.Contract, farmer: string) => {
  if (!contract) return;

  try {
    const tx = await contract.removeFarmer(farmer);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

// VVB management functions
export const addVVB = async (contract: ethers.Contract, vvb: string, vvbId: number) => {
  if (!contract) return;

  try {
    const tx = await contract.addVVB(vvb, vvbId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const removeVVB = async (contract: ethers.Contract, vvb: string) => {
  if (!contract) return;

  try {
    const tx = await contract.removeVVB(vvb);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const assignVVBToProject = async (contract: ethers.Contract, projectId: number, vvb: string) => {
  if (!contract) return;

  try {
    const tx = await contract.assignVVBToProject(projectId, vvb);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const assignVVBToMRV = async (contract: ethers.Contract, reportId: number, vvb: string) => {
  if (!contract) return;

  try {
    const tx = await contract.assignVVBToMRV(reportId, vvb);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

// Project and MRV report management functions
export const acceptProject = async (contract: ethers.Contract, projectId: number) => {
  if (!contract) return;

  try {
    const tx = await contract.acceptProject(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const rejectProject = async (contract: ethers.Contract, projectId: number) => {
  if (!contract) return;

  try {
    const tx = await contract.rejectProject(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const addMRVReport = async (contract: ethers.Contract, reportId: number, projectId: number, owner: string, date: number, blob: string) => {
  if (!contract) return;

  const blobBytes = ethers.utils.toUtf8Bytes(blob);

  try {
    const tx = await contract.addMRVReport(reportId, projectId, owner, date, blobBytes);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const removeMRVReport = async (contract: ethers.Contract, reportId: number) => {
  if (!contract) return;

  try {
    const tx = await contract.removeMRVReport(reportId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

export const addProject = async (contract: ethers.Contract, projectId: number, owner: string, dateOfSubmission: number, blob: string) => {
    if (!contract) {
      console.error('Contract is not defined');
      return;
    }
  
    const blobBytes = ethers.utils.toUtf8Bytes(blob);
  
    try {
      const tx = await contract.addProject(projectId, owner, dateOfSubmission, blobBytes);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

export const removeProject = async (contract: ethers.Contract, projectId: number) => {
  if (!contract) return;

  try {
    const tx = await contract.removeProject(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error(error);
  }
};

// Getter functions
export const getFarmerBalance = async (contract: ethers.Contract, farmer: string) => {
  if (!contract) return;

  try {
    const balance = await contract.getFarmerBalance(farmer);
    return balance;
  } catch (error) {
    console.error(error);
  }
};

export const getFarmer = async (contract: ethers.Contract, farmer: string) => {
  if (!contract) return;

  try {
    const farmerData = await contract.getFarmer(farmer);
    return farmerData;
  } catch (error) {
    console.error(error);
  }
};

export const getVVB = async (contract: ethers.Contract, vvb: string) => {
  if (!contract) return;

  try {
    const vvbData = await contract.getVVB(vvb);
    return vvbData;
  } catch (error) {
    console.error(error);
  }
};

export const getFarmerContribution = async (contract: ethers.Contract, farmer: string) => {
  if (!contract) return;

  try {
    const contribution = await contract.getFarmerContribution(farmer);
    return contribution;
  } catch (error) {
    console.error(error);
  }
};

export const getFarmerContributionPercentage = async (contract: ethers.Contract, farmer: string) => {
  if (!contract) return;

  try {
    const contributionPercentage = await contract.getFarmerContributionPercentage(farmer);
    return contributionPercentage;
  } catch (error) {
    console.error(error);
  }
};

export const getTotalPool = async (contract: ethers.Contract) => {
  if (!contract) return;

  try {
    const totalPool = await contract.getTotalPool();
    return totalPool;
  } catch (error) {
    console.error(error);
  }
};

export const getProjectDetails = async (contract: ethers.Contract, projectId: number) => {
  if (!contract) return;

  try {
    const projectDetails = await contract.getProjectDetails(projectId);
    return projectDetails;
  } catch (error) {
    console.error(error);
  }
};

export const getMRVReportDetails = async (contract: ethers.Contract, reportId: number) => {
  if (!contract) return;

  try {
    const mrvReportDetails = await contract.getMRVReportDetails(reportId);
    return mrvReportDetails;
  } catch (error) {
    console.error(error);
  }
};
