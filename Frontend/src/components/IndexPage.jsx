import FirstPage from "../pages/firstPage";
import FoodOptions from "./FoodOptions";
import SweetData from "./SweetData";
import ViewAllHits from "./ViewAllHits";
import Drinks from "./Drinks";
import SpotLight from "./Spotlight";

const IndexPage = () => {
  return (
    <>
      <FirstPage />
      <FoodOptions />
      <ViewAllHits />
      <SweetData />
      <Drinks />
      <SpotLight />
    </>
  );
};

export default IndexPage;
