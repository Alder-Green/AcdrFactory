import { AppProps } from 'next/app';
import { useAtom } from 'jotai';
import { userRoleAtom } from '@/atoms';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from 'next-themes';
import ModalsContainer from '@/components/modal-views/container';
import DrawersContainer from '@/components/drawer-views/container';
import SettingsButton from '@/components/settings/settings-button';
import SettingsDrawer from '@/components/settings/settings-drawer';
import { WalletProvider } from '@/lib/hooks/use-connect';
import FarmerDashboardLayout from '@/layouts/sidebar/FarmerDashboardLayout';
import VVBDashboardLayout from '@/layouts/sidebar/VVBDashboardLayout';
import DashboardLayout from '@/layouts/_dashboard';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import 'swiper/css';
import '@/assets/css/scrollbar.css';
import '@/assets/css/globals.css';
import '@/assets/css/range-slider.css';

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [userRole] = useAtom(userRoleAtom);

  // Redirect to Welcome page if not already there and role is not selected
  useEffect(() => {
    if (!userRole && router.pathname !== '/welcome') {
      router.push('/welcome');
    }
  }, [userRole, router]);

  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => page);

  const Layout = ({ children }: { children: React.ReactNode }) => {
    if (router.pathname === '/welcome') {
      return <>{children}</>;
    }
    if (userRole === 'farmer') {
      return <FarmerDashboardLayout>{children}</FarmerDashboardLayout>;
    }
    if (userRole === 'vvb') {
      return <VVBDashboardLayout>{children}</VVBDashboardLayout>;
    }
    return <DashboardLayout>{children}</DashboardLayout>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
          <WalletProvider>
            <Layout>
              {getLayout(<Component {...pageProps} />)}
              
              <SettingsDrawer />
              <ModalsContainer />
              <DrawersContainer />
            </Layout>
          </WalletProvider>
        </ThemeProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default CustomApp;
