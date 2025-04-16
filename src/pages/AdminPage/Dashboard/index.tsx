import useAuthStore from "../../../stores/AuthStore.ts";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Dashboard: React.FC = () => {
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
        <>
            hello from dashboard
            <div>
                <h1>{user?.username}</h1>
                <p>{user?.email}</p>
            </div>
        </>
    );
};

export default Dashboard;