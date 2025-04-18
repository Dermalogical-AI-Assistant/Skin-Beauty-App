import React from 'react';
import { Home } from 'lucide-react';
import BrandLogo from '../../components/BrandLogo';
import { useLocation, Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  path?: string;
  name: string;
  type: 'group' | 'item';
  index?: number;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    type: 'group',
    name: 'General',
    index: 0,
    children: [
      {
        path: '/admin/dashboard',
        name: 'Dashboard',
        type: 'item',
        icon: <Home size={18} />,
      },
    ],
  },
  {
    type: 'group',
    name: 'Management',
    index: 0,
    children: [
      {
        path: '/admin/users',
        name: 'Users',
        type: 'item',
        icon: <Home size={18} />,
      },
    ],
  },
];

const renderNavItems = (items: NavItem[], currentPath: string) => {
  return items.map((item, index) => {
    const isActive = currentPath === item.path;

    if (item.type === 'group' && item.children) {
      return (
        <div key={index} className="mb-6">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-2 tracking-wide">{item.name}</p>
          <div className="space-y-1 pl-1">
            {renderNavItems(item.children, currentPath)}
          </div>
        </div>
      );
    }

    if (item.type === 'item') {
      return (
        <Link
          key={index}
          to={item.path || '#'}
          className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-colors text-gray-700 
            ${isActive ? 'bg-primary shadow-sm' : ' hover:bg-gray-100'}`}
        >
          {item.icon}
          <span className="truncate">{item.name}</span>
        </Link>
      );
    }

    return null;
  });
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className={`min-w-64 max-w-72 h-full bg-white shadow-md transition-transform duration-300 ease-in-out
                  ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <BrandLogo />
      </div>

      <nav className="p-6">
        {renderNavItems(navItems, currentPath)}
      </nav>
    </aside>
  );
};

export default Sidebar;
