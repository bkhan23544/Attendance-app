import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faQrcode,
  faUser,
  faTimes,
  faComments,
  faBell,
  faBook
} from "@fortawesome/free-solid-svg-icons";
import { NavItem, NavLink, Nav } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";
import './styles.scss'
import { useSelector } from 'react-redux'
import firebase from '../../../config/firebase'

const SideBar = ({ isOpen, toggle, setNavbarTitle }) => {
  const user = useSelector(state => state.setCurrentUser)

  return (
    <div className={classNames("sidebar", { "is-open": isOpen })}>
      <div className="sidebar-header">
        <h3>Welcome {user.firstName} {user.lastName}</h3>
      </div>
      <div className="side-menu">
        <Nav vertical className="list-unstyled pb-3">
          <NavItem>
            <NavLink className="sidebar-nav-item" tag={Link} to={"/studentdashboard"} onClick={() => { setNavbarTitle("All Classes"); toggle() }}>
              <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
            All Classes
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebar-nav-item" tag={Link} to={"/studentdashboard/profile"} onClick={() => { setNavbarTitle("Profile"); toggle() }}>
              <FontAwesomeIcon icon={faUser} className="mr-2" />
            Profile
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebar-nav-item" tag={Link} to={"/studentdashboard/qrcode"} onClick={() => { setNavbarTitle("My QR Code"); toggle() }}>
              <FontAwesomeIcon icon={faQrcode} className="mr-2" />
            My QR Code
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebar-nav-item" tag={Link} to={"/studentdashboard/groupchat"} onClick={() => { setNavbarTitle("Group Chat"); toggle() }}>
              <FontAwesomeIcon icon={faComments} className="mr-2" />
            Group Chat
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebar-nav-item" tag={Link} to={"/studentdashboard/alerts"} onClick={() => { setNavbarTitle("Alerts"); toggle() }}>
              <FontAwesomeIcon icon={faBell} className="mr-2" />
            Alerts
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebar-nav-item" tag={Link} to={"/studentdashboard/changeattendancerequest"} onClick={() => { setNavbarTitle("Change Attendance Request"); toggle() }}>
              <FontAwesomeIcon icon={faBook} className="mr-2" />
            Request Change
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebar-nav-item" tag={Link} to={"/studentdashboard/myattendancerequests"} onClick={() => { setNavbarTitle("My Attendance Requests"); toggle() }}>
              <FontAwesomeIcon icon={faBook} className="mr-2" />
            My Attendance Requests
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebar-nav-item" tag={Link} to={"/"} onClick={() => { firebase.auth().signOut() }}>
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Logout
          </NavLink>
          </NavItem>
        </Nav>
      </div>
    </div>
  );
}

export default SideBar;
