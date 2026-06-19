import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div  className="relative py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden"
  style={{
    backgroundImage: 'url("images/maison2.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
