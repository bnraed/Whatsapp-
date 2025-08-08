'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Settings, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar style Mantis */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white shadow-lg flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-600 p-6 border-b">WhatsApp SaaS</h1>
          <nav className="space-y-1 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-md transition ${
                    active
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-green-600'
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Header style Mantis */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-gray-700">Bonjour, Raed 👋</h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow">
              R
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
