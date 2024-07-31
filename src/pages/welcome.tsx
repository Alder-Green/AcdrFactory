import { useState } from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import type { NextPageWithLayout } from '@/types';
import Button from '@/components/ui/button';
import { useAtom } from 'jotai';
import { userRoleAtom } from '@/atoms';

const WelcomePage: NextPageWithLayout = () => {
  const [role, setRole] = useState<string>('');
  const [, setUserRole] = useAtom(userRoleAtom);
  const router = useRouter();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  const handleSubmit = () => {
    if (!role) {
      console.error('Role not selected');
      return;
    }
    setUserRole(role);
    if (role === 'farmer') {
      router.push('/farmer-profile');
    } else if (role === 'vvb') {
      router.push('/vvb-profile');
    }
  };

  return (
    <>
      <NextSeo
        title="Welcome"
        description="Select your role and connect to the wallet"
      />
      <div className="mx-auto w-full px-4 pt-8 pb-14 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
        <h2 className="mb-6 text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-10 sm:text-2xl">
          Welcome
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
            <option value="farmer">Farmer</option>
            <option value="vvb">VVB</option>
          </select>
        </div>

        <Button shape="rounded" onClick={handleSubmit} className="bg-button-green">
          Submit
        </Button>
      </div>
    </>
  );
};

WelcomePage.getLayout = function getLayout(page) {
  return <>{page}</>;
};

export default WelcomePage;
