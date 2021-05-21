import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faPlus,
  faUser,
  faTimes,
  faBell,
  faPaste
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
    <div className={`sidebarlecturer ${isOpen && "is-open"}`}>
      <div>
        <Nav horizontal className="list-unstyled pb-3">
          <NavItem>
            <NavLink className="sidebarlecturer-nav-item" tag={Link} to={"/lecturerdashboard"} onClick={() => { setNavbarTitle("All Classes"); toggle() }}>
              <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
            All Classes
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebarlecturer-nav-item" tag={Link} to={"/lecturerdashboard/createclass"} onClick={() => { setNavbarTitle("Create Class"); toggle() }}>
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Class
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebarlecturer-nav-item" tag={Link} to={"/lecturerdashboard/profile"} onClick={() => { setNavbarTitle("Profile"); toggle() }}>
              <FontAwesomeIcon icon={faUser} className="mr-2" />
            Profile
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebarlecturer-nav-item" tag={Link} to={"/lecturerdashboard/alerts"} onClick={() => { setNavbarTitle("Alerts"); toggle() }}>
              <FontAwesomeIcon icon={faBell} className="mr-2" />
            Alerts
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebarlecturer-nav-item" tag={Link} to={"/lecturerdashboard/applyforleave"} onClick={() => { setNavbarTitle("Apply For Leave"); toggle() }}>
              <FontAwesomeIcon icon={faPaste} className="mr-2" />
            Apply For Leave
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebarlecturer-nav-item" tag={Link} to={"/lecturerdashboard/myleaverequests"} onClick={() => { setNavbarTitle("My Leave Requests"); toggle() }}>
              <FontAwesomeIcon icon={faPaste} className="mr-2" />
            My Leave Requests
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebarlecturer-nav-item" tag={Link} to={"/"} onClick={() => { firebase.auth().signOut() }}>
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
