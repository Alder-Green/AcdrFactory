import { useState, useContext } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard';
import Input from '@/components/ui/forms/input';
import dynamic from 'next/dynamic';
import { WalletContext } from '@/lib/hooks/use-connect';
import { addMRVReport } from '../services/services';

const MapWithDraw = dynamic(() => import('./proposals/MapWithDraw'), { ssr: false });

const CreateNFTPage: NextPageWithLayout = () => {
  const { contract, address } = useContext(WalletContext);
  const [step, setStep] = useState(1);
  const [geojson, setGeojson] = useState('');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);

  const handleGeojsonChange = (geojson: string) => {
    setGeojson(geojson);
  };

  const handleSave = () => {
    setStep(1);
  };

  const handleStart = () => {
    setStep(3);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setValue(100);
    }, 2000);
  };

  const handleMint = async () => {
    if (!contract || !address) {
      console.error('Contract or address is not available');
      return;
    }

    const reportId = Math.floor(Math.random() * 10000); // Example ID generation
    const projectId = 12345; // Example project ID
    const owner = address;
    const date = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const blob = geojson; // Using geojson as the blob data

    try {
      await addMRVReport(contract, reportId, projectId, owner, date, blob);
      console.log('MRV added successfully');
    } catch (error) {
      console.error('Error adding MRV:', error);
    }
  };

  return (
    <>
      <NextSeo
        title="Create NFT"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="mx-auto w-full px-4 pt-8 pb-14 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
        <h2 className="mb-6 text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-10 sm:text-2xl">
          {step === 1 && 'Select the Area'}
          {step === 2 && 'Map with Draw'}
          {step === 3 && 'Loading'}
          {step === 4 && 'Mint'}
        </h2>

        {step === 1 && (
          <div className="mb-8">
            <Input
              type="text"
              value={geojson}
              placeholder="Click to select area"
              readOnly
              onClick={() => setStep(2)}
              className="input-dark mb-4" // Added margin-bottom
            />
            <Button shape="rounded" onClick={handleStart} className="bg-button-green">
              Start dMRV
            </Button>
          </div>
        )}

        {step === 2 && (
          <MapWithDraw onGeojsonChange={handleGeojsonChange} onSave={handleSave} />
        )}

        {step === 3 && loading && (
          <div className="flex items-center justify-center">
            <div className="loader">Loading...</div>
          </div>
        )}

        {step === 3 && !loading && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold">{value}, tCO2</div>
            <Button shape="rounded" onClick={handleMint} className="bg-button-green mt-4">
              Mint aCDR
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

CreateNFTPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;};

export default CreateNFTPage;
