'use client'
import useAuthorize from '@/components/UserRoles';

const UserDashboard = () => {

  const { isAuthorized, authCheckDone } = useAuthorize('customer');

  if (!authCheckDone) {
    return <div>Loading...</div>; // Or render null, or a loading spinner, etc.
  }

  if (!isAuthorized) {
    // This is technically redundant because your hook will redirect,
    // but you might choose to handle it differently in the future.
    return null;
  }

  return (
    <div>
      <h1>User Dashboard</h1>
    </div>
  );
}

export default UserDashboard;
