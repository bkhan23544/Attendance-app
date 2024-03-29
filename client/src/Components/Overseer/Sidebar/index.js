import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faGraduationCap,
  faUser,
  faTimes,
  faPaste,
  faBell
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
    <div className={`sidebaroverseer ${isOpen && "is-open"}`}>
      <div>
        <Nav horizontal className="list-unstyled pb-3">
          <NavItem>
            <NavLink className="sidebaroverseer-nav-item" tag={Link} to={"/overseerdashboard"} onClick={() => { setNavbarTitle("All Lecturers"); toggle() }}>
              <FontAwesomeIcon icon={faUser} className="mr-2" />
            All Lecturers
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebaroverseer-nav-item" tag={Link} to={"/overseerdashboard/allstudents"} onClick={() => { setNavbarTitle("All Students"); toggle() }}>
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
            All Students
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebaroverseer-nav-item" tag={Link} to={"/overseerdashboard/allclasses"} onClick={() => { setNavbarTitle("All Classes"); toggle() }}>
              <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
            All Classes
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebaroverseer-nav-item" tag={Link} to={"/overseerdashboard/sendalerts"} onClick={() => { setNavbarTitle("Send Alerts"); toggle() }}>
              <FontAwesomeIcon icon={faBell} className="mr-2" />
            Send Alerts
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebaroverseer-nav-item" tag={Link} to={"/overseerdashboard/lecturerleaverequest"} onClick={() => { setNavbarTitle("Lecturer Leave Requests"); toggle() }}>
              <FontAwesomeIcon icon={faPaste} className="mr-2" />
            Lecturer Leave Requests
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebaroverseer-nav-item" tag={Link} to={"/overseerdashboard/attendancechangerequest"} onClick={() => { setNavbarTitle("Attendance Change Requests"); toggle() }}>
              <FontAwesomeIcon icon={faPaste} className="mr-2" />
            Attendance Change Requests
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="sidebaroverseer-nav-item" tag={Link} to={"/"} onClick={() => { firebase.auth().signOut() }}>
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
