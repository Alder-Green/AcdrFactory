import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/_dashboard';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Button from '@/components/ui/button';
import InputLabel from '@/components/ui/input-label';
import Uploader from '@/components/ui/forms/uploader';
import dynamic from 'next/dynamic';
import { addProject } from '../services/services';

const MapWithDraw = dynamic(() => import('./proposals/MapWithDraw'), { ssr: false });

const CreateNFTPage: NextPageWithLayout = () => {
  const [step, setStep] = useState(1);
  const [owner, setOwner] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<number>(0); // Add state for project ID
  const [geojsonInputs, setGeojsonInputs] = useState({
    fertilizerApplication: '',
    organicFertilizer: '',
    nitrogenFertilizers: '',
    waterManagement: '',
    groundwaterManagement: '',
    tillageManagement: '',
    cropPlanting: '',
    grazingPractices: '',
    coverCrops: '',
    partialCoverCrops: '',
    projectLocation: '',
    ureaQuantityPerHectare: '',
    ureaNitrogenContent: '',
    ureaQuantityPerYear: '',
  });
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    projectDescription: '',
    projectLocation: '',
    vegetationType: '',
    totalLand: '',
    numberOfTrees: '',
    averageHeight: '',
    dateOfPlanting: '',
  });
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [onboardingDate, setOnboardingDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  });

  const steps = [
    { title: 'Project Information' },
    { title: 'Land Application' },
    { title: 'Fertilizers & Pesticides' },
    { title: 'Land Use Changes' },
    { title: 'Project Finalisation' },
  ];

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setOwner(address);
        } else {
          console.error('No Ethereum wallet found');
        }
      } catch (error) {
        console.error('Error fetching wallet address:', error);
      }
    };

    fetchWalletAddress();
  }, []);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleGeojsonChange = (geojson: string) => {
    if (currentField) {
      setGeojsonInputs({
        ...geojsonInputs,
        [currentField]: geojson,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in projectInfo) {
      setProjectInfo({
        ...projectInfo,
        [name]: value,
      });
    } else if (name in geojsonInputs) {
      setGeojsonInputs({
        ...geojsonInputs,
        [name]: value,
      });
    }
  };

  const toggleMap = (field: string) => {
    setCurrentField(currentField === field ? null : field);
  };

  const handleSave = () => {
    setCurrentField(null);
  };

  const createProject = async () => {
    const dateOfSubmission = Math.floor(Date.now() / 1000); // Current timestamp in seconds

    const blob = JSON.stringify({
      projectInfo,
      geojsonInputs,
      onboardingDate,
    });

    try {
      if (!owner) {
        console.error('Owner address is not set');
        return;
      }
      const tx = await addProject(projectId, owner, dateOfSubmission, blob);
      console.log('Project created successfully', tx);
      setProjectId(projectId + 1); // Increment the project ID for the next project
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <>
      <NextSeo title="Create Project" description="Create a new project" />
      <div className="mx-auto w-full px-4 pt-8 pb-14 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
        <h2 className="mb-6 text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-10 sm:text-2xl">
          Create New Project
        </h2>

        <div className="mb-8">
          <ul className="flex justify-between">
            {steps.map((item, index) => (
              <li key={index} className={`flex-1 text-center ${index + 1 <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                {item.title}
                {index + 1 < steps.length && (
                  <span className="mx-2">→</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {step === 1 && (
          <div>
            <h3 className="mb-6 text-lg font-medium text-gray-900 dark:text-white">Project Information</h3>
            <div className="mb-8">
              <InputLabel title="Project Name" important />
              <Input type="text" name="projectName" value={projectInfo.projectName} onChange={handleInputChange} placeholder="Enter the project name" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="Project Description" important />
              <Textarea name="projectDescription" value={projectInfo.projectDescription} onChange={handleInputChange} placeholder="Provide a detailed description of the project" className="input-dark" />
            </div>
            <h3 className="mb-6 text-lg font-medium text-gray-900 dark:text-white">Location and Vegetation</h3>
            <div className="mb-8">
              <InputLabel title="Project Location" important />
              <Input type="text" name="projectLocation" value={projectInfo.projectLocation} onChange={handleInputChange} placeholder="Enter the location (Region, GPS coordinates, etc.)" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="Vegetation Type" important />
              <Input type="text" name="vegetationType" value={projectInfo.vegetationType} onChange={handleInputChange} placeholder="Enter the type of vegetation involved in the project" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="Total Land (Hectares)" important />
              <Input type="number" name="totalLand" value={projectInfo.totalLand} onChange={handleInputChange} placeholder="Enter the total land area" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="Number of Trees" important />
              <Input type="number" name="numberOfTrees" value={projectInfo.numberOfTrees} onChange={handleInputChange} placeholder="Enter the number of trees" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="Average Height (meters)" important />
              <Input type="number" name="averageHeight" value={projectInfo.averageHeight} onChange={handleInputChange} placeholder="Enter the average height of the trees" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="Date of Planting" important />
              <Input type="date" name="dateOfPlanting" value={projectInfo.dateOfPlanting} onChange={handleInputChange} placeholder="Enter the date of planting" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="Upload Proof of Ownership" important />
              <Uploader />
            </div>
            <Button shape="rounded" onClick={nextStep} className="bg-button-green mr-4">Next</Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="mb-6 text-lg font-medium text-gray-900 dark:text-white">Land Application (Regenerative Activities)</h3>
            
            <div className="mb-8">
              <InputLabel title="Optimization of fertilizer application (Hectares)" important />
              <Input type="number" name="fertilizerApplication" value={geojsonInputs.fertilizerApplication} onChange={handleInputChange} placeholder="Enter the area where fertilizer application is optimized" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="Organic fertilizer application (Hectares)" important />
              <Input type="number" name="organicFertilizer" value={geojsonInputs.organicFertilizer} onChange={handleInputChange} placeholder="Enter the area where organic fertilizers are applied" className="input-dark" />
            </div>
            <div className="mb-8">
            <InputLabel title="Enhanced efficiency nitrogen fertilizers (Hectares)" important />
              <Input type="number" name="nitrogenFertilizers" value={geojsonInputs.nitrogenFertilizers} onChange={handleInputChange} placeholder="Enter the area where enhanced efficiency nitrogen fertilizers are used" className="input-dark" />
            </div>
            
            <h4 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Improve Water Management/Irrigation</h4>
            <div className="mb-8">
              <InputLabel title="Alteration of irrigation (Hectares)" important />
              <Input type="number" name="waterManagement" value={geojsonInputs.waterManagement} onChange={handleInputChange} placeholder="Enter the area where irrigation practices are altered" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="Groundwater level management (Hectares)" important />
              <Input type="number" name="groundwaterManagement" value={geojsonInputs.groundwaterManagement} onChange={handleInputChange} placeholder="Enter the area where groundwater level management is implemented" className="input-dark" />
            </div>
            
            <div className="flex space-x-4">
              <Button shape="rounded" onClick={prevStep} className="bg-button-green">Previous</Button>
              <Button shape="rounded" onClick={nextStep} className="bg-button-green">Next</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="mb-6 text-lg font-medium text-gray-900 dark:text-white">Fertilizers & Pesticides</h3>
            
            <h4 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Urea</h4>
            <div className="mb-8">
              <InputLabel title="Quantity (per hectare)" important />
              <Input type="number" name="ureaQuantityPerHectare" value={geojsonInputs.ureaQuantityPerHectare} onChange={handleInputChange} placeholder="Enter the amount of urea applied per hectare" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="Nitrogen Content (kg per hectare)" important />
              <Input type="number" name="ureaNitrogenContent" value={geojsonInputs.ureaNitrogenContent} onChange={handleInputChange} placeholder="Enter the nitrogen content of the urea applied per hectare" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="Quantity Use (per year)" important />
              <Input type="number" name="ureaQuantityPerYear" value={geojsonInputs.ureaQuantityPerYear} onChange={handleInputChange} placeholder="Enter the total annual quantity of urea used" className="input-dark" />
            </div>
            
            <div className="flex space-x-4">
              <Button shape="rounded" onClick={prevStep} className="bg-button-green">Previous</Button>
              <Button shape="rounded" onClick={nextStep} className="bg-button-green">Next</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="mb-6 text-lg font-medium text-gray-900 dark:text-white">Land Use Changes</h3>
            
            <h4 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Cover Crops</h4>
            <div className="mb-8">
              <InputLabel title="From no cover crop to seasonal cover crop (Hectares)" important />
              <Input type="number" name="coverCrops" value={geojsonInputs.coverCrops} onChange={handleInputChange} placeholder="Enter the area transitioned from no cover crop to seasonal cover crop" className="input-dark" />
            </div>
            <div className="mb-8">
              <InputLabel title="From no cover crop to 50% cover seasonal crop or between rows (Hectares)" important />
              <Input type="number" name="partialCoverCrops" value={geojsonInputs.partialCoverCrops} onChange={handleInputChange} placeholder="Enter the area transitioned to partial cover crop" className="input-dark" />
            </div>
            
            <div className="flex space-x-4">
              <Button shape="rounded" onClick={prevStep} className="bg-button-green">Previous</Button>
              <Button shape="rounded" onClick={nextStep} className="bg-button-green">Next</Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="mb-6 text-lg font-medium text-gray-900 dark:text-white">Project Finalisation</h3>
            
            <div className="mb-8">
              <InputLabel title="Project Location" important />
              <Input
                type="text"
                name="projectLocation"
                value={geojsonInputs.projectLocation}
                placeholder="Enter the project location"
                onClick={() => toggleMap('projectLocation')}
                readOnly
                className="input-dark"
              />
              {currentField === 'projectLocation' && (
                <MapWithDraw onGeojsonChange={handleGeojsonChange} onSave={handleSave} />
              )}
            </div>
            <div className="mb-8">
              <InputLabel title="Date of Onboarding" important />
              <Input
                type="date"
                value={onboardingDate}
                onChange={(e) => setOnboardingDate(e.target.value)}
                className="input-dark"
              />
            </div>
            
            <div className="flex space-x-4">
              <Button shape="rounded" onClick={prevStep} className="bg-button-green">Previous</Button>
              <Button shape="rounded" onClick={createProject} className="bg-button-green">Create Project</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

CreateNFTPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreateNFTPage;
