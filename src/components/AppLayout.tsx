import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"



const AppLayout = () => {




    return (<>
  
            <NavBar />
            <div></div>
            <Outlet />
            <div></div>

    </>)
}

export default AppLayout