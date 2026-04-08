import { Outlet } from 'react-router';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--background)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Topbar />
        <main style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}