import useAuthStore from "../../../stores/AuthStore.ts";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const UserManagement: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout(); // Gọi hàm logout từ Zustand
        navigate("/login"); // Chuyển hướng về trang login
    };

    useEffect(() => {
        console.log("hihi",user);
    }, [user]);

    return (
        <div>
            <div className={`mb-6`}>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p>Manage user accounts, roles, and access permissions efficiently.</p>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-primary-light">John Doe</td>
                        <td className="px-6 py-4 whitespace-nowrap">john@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                        <td className="px-6 py-4 whitespace-nowrap">jane@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">User</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Robert Johnson</td>
                        <td className="px-6 py-4 whitespace-nowrap">robert@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">Editor</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;