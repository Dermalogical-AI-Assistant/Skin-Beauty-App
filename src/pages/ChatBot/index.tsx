import Sidebar from "./SideBar/Sidebar.tsx";
import Index from "../../layouts/BaseLayout/Header";
import { Outlet } from "react-router-dom";

const ChatBot: React.FC = () => {

  return (
    <div className={`h-screen flex flex-col bg-primary overflow-hidden `}>
      <Index/>
      <div className="flex h-full overflow-hidden w-full">
        <Sidebar />
        <div className="flex-grow w-full">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;