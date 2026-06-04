import { Outlet } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
