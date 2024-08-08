import { useState, useContext } from 'react';
import { NextSeo } from 'next-seo';
import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/_dashboard';
import Button from '@/components/ui/button';
import { WalletContext } from '@/lib/hooks/use-connect';
import { addFarmer, addVVB } from '../services/services';


const WelcomePage: NextPageWithLayout = () => {
  const { contract, address } = useContext(WalletContext);
  const [role, setRole] = useState<string>('');


  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };


  const handleSubmit = async () => {
    if (!contract || !address) {
      console.error('Contract or address is not available');
      return;
    }
    const id = Math.floor(Math.random() * 10000); // Example ID generation
    try {
      if (role === 'farmer') {
        await addFarmer(address, id);
        console.log('Farmer added successfully');
      } else if (role === 'vvb') {
        await addVVB(address, id);
        console.log('VVB added successfully');
      } else {
        console.error('Invalid role selected');
      }
    } catch (error) {
      console.error('Error submitting role:', error);
    }
  };


  return (
    <>
      <NextSeo
        title="Welcome rania"
        description="Select your role and connect to the wallet"
      />
      <div className="mx-auto w-full px-4 pt-8 pb-14 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
        <h2 className="mb-6 text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-10 sm:text-2xl">
          Welcome To Alder Green Solutions
        </h2>


        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select your role:
          </label>
          <select
            value={role}
            onChange={handleRoleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select role</option>
            <option value="Farmer">Farmer</option>
            <option value="Vvb">VVB</option>
          </select>
        </div>


        <Button shape="rounded" onClick={handleSubmit} className="bg-button-green">
          Join Us
        </Button>
      </div>
    </>
  );
};


WelcomePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};


export default WelcomePage;
