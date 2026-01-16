import { Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
