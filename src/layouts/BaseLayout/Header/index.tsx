import BrandLogo from "../../../components/BrandLogo";
import AcountMenu from "./AccountMenu.tsx";
import NavLink from "./NavLink/NavLink.tsx";
import { PiBasket } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import BasketList from "./BasketList.tsx";
import Search from "./Search.tsx";

const Index: React.FC = () => {
    return (
      <header className="h-20 w-full flex items-center px-14 bg-primary shadow-[0px_21px_42px_rgba(234,165,141,0.15)]">
        <div className="flex items-center flex-1">
          <BrandLogo />
        </div>

        <div className="flex justify-center flex-1">
          <NavLink />
        </div>

        <div className="flex items-center gap-6 justify-end flex-1">
          <Search icon={<IoSearchOutline size={24} />} />
          <BasketList icon={<PiBasket size={24}/>}/>
          <AcountMenu />
        </div>
      </header>
    );
}

export default Index;