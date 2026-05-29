import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
