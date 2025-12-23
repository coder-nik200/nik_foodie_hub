import { Link, Outlet } from "react-router-dom";
import Header from "./Header";
// import FoodOptions from "./components/FoodOptions";
// import IndexPage from "./components/IndexPage";

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
