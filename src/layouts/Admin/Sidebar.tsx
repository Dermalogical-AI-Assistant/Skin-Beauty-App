// src/components/AdminLayout/Sidebar.tsx
import React from 'react';
import { Home} from 'lucide-react';
import BrandLogo from "../../components/BrandLogo";
import { useLocation, Link } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

interface NavItem {
    path?: string;
    name: string;
    type: "group" | "item";
    index?: number;
    icon?: React.ReactNode;
    children?: NavItem[]
}

const navItems: NavItem[] = [
    {
        type:'group',
        name: 'General',
        index: 0,
        children: [
            {
                path: '/admin/dashboard',
                name: 'Dashboard',
                type: 'item',
                icon: <Home size={20} />
            }
        ]
    },
    {
        type:'group',
        name: 'Account & Security',
        index: 0,
        children: [
            {
                path: '/admin/users',
                name: 'User management',
                type: 'item',
                icon: <Home size={20} />
            },
        ]
    }
];

const renderNavItems = (items: NavItem[], currentPath: string) => {
    return items.map((item, index) => {
        const isActive = currentPath === item.path;

        if (item.type === 'group' && item.children) {
            return (
              <div key={index} className="mb-4">
                  <p className="text-xl font-medium mb-2">{item.name}</p>
                  <div className="space-y-1 pl-2">
                      {renderNavItems(item.children, currentPath)}
                  </div>
              </div>
            );
        }

        if (item.type === 'item') {
            return (
              <a
                key={index}
                href={item.path}
                className={`flex items-center gap-2 text-lg ${isActive&&"bg-secondary-dark/25"}  hover:bg-secondary-dark px-2 py-1.5 rounded-md transition`}
              >
                  {item.icon}
                  <p className={`flex items-center text-center align-middle`}>{item.name}</p>
              </a>
            );
        }

        return null;
    });
};


const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {

    const location = useLocation(); // ✅ get current location
    const currentPath = location.pathname;

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`resize-x min-w-72 h-full transition-transform duration-300 ease-in-out
                            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                           `}
            >
                <div className="flex items-center justify-between p-4">
                    <BrandLogo />
                </div>

                <nav className="py-4 px-10">
                    {renderNavItems(navItems, currentPath)}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;