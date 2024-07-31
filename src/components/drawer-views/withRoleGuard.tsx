// src/hocs/withRoleGuard.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRole } from './context';

const withRoleGuard = (Component: React.ComponentType, allowedRoles: string[]) => {
  return (props: any) => {
    const { role } = useRole();
    const router = useRouter();

    useEffect(() => {
      if (!role || !allowedRoles.includes(role)) {
        router.push('/welcome');
      }
    }, [role]);

    if (!role || !allowedRoles.includes(role)) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
};

export default withRoleGuard;
