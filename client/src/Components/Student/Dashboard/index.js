import React, { useState } from 'react'
import "./styles.scss"
import SideBar from '../Sidebar'
import Content from '../Content'
import { BrowserRouter as Router } from "react-router-dom";


export default function Dashboard() {

    const [sidebarIsOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
    const [navBarTitle, setNavbarTitle] = useState("All Classes")


    return (
        <Router>
            <div className="App wrapper root">
                <SideBar setNavbarTitle={setNavbarTitle} toggle={toggleSidebar} isOpen={sidebarIsOpen} />
                <Content toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} navBarTitle={navBarTitle} />
            </div>
        </Router>
    )
}