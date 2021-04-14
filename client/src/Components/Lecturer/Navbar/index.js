import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom'
import {
  Navbar,
  Button,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";

const Topbar = ({ toggleSidebar, navBarTitle }) => {
  const [topbarIsOpen, setTopbarOpen] = useState(true);
  const toggleTopbar = () => setTopbarOpen(!topbarIsOpen);


  return (
    <Navbar
      color="primary"
      light
      className="navbar shadow-sm p-3 mb-5 rounded"
      expand="md"
    >
      <Button color="light" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faAlignLeft} />
      </Button>
      <div className="w-100 text-center text-white">
        <h3>{navBarTitle}</h3>
      </div>
    </Navbar>
  );
};

export default Topbar;