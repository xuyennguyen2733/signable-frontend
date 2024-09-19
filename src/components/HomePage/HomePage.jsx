import MainDash from "../MainDash/MainDash";
import SideBar from "../SideBar/SideBar"
import './HomePage.css'

function HomePage() {
    return (
      <div className="HomePage">
        <div className="HomeGlass">
          <SideBar />
          <MainDash/>
        </div>
      </div>
    );
  }
  
  export default HomePage;