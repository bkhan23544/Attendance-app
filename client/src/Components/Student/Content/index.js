import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import { Switch, Route, useHistory } from "react-router-dom";
import AllClasses from '../AllClasses'
import Profile from '../Profile'
import Navbar from "../Navbar";
import ViewClass from "../ViewClass";
import MyQRCode from "../MyQRCode";
import GroupChat from '../GroupChat'
import Alerts from '../Alerts'
import './styles.scss'
import ChangeAttendanceRequest from "../ChangeAttendanceRequest";
import MyAttendanceRequests from "../MyAttendanceRequests";


const Content = ({ sidebarIsOpen, toggleSidebar, navBarTitle }) => {

  const [navBaarTitle, setNavBaarTitle] = useState(navBarTitle)
  const history = useHistory()

  //Check which page is opened and change the Navbar title
  useEffect(() => {
    var url = history.location.pathname
    if (url == "/studentdashboard") {
      setNavBaarTitle("All Classes")
    }
    else if (url == "/studentdashboard/profile") {
      setNavBaarTitle("Profile")
    }
    else if (url == "/studentdashboard/qrcode") {
      setNavBaarTitle("My QR Code")
    }
    else if (url == "/studentdashboard/groupchat") {
      setNavBaarTitle("Group Chat")
    }
    else if (url == "/studentdashboard/alerts") {
      setNavBaarTitle("Alerts")
    }
    else if (url == "/studentdashboard/changeattendancerequest") {
      setNavBaarTitle("Change Attendance Request")
    }
    else if (url == "/studentdashboard/myattendancerequests") {
      setNavBaarTitle(" My Attendance Requests")
    }
  })

  return (
    <Container
      fluid
      className={classNames("content", { "is-open": sidebarIsOpen })}
    >
      <Navbar toggleSidebar={toggleSidebar} navBarTitle={navBaarTitle} />
      <Switch>
        <Route exact path="/studentdashboard" component={() => <AllClasses setNavBarTitle={setNavBaarTitle} />} />
        <Route exact path="/studentdashboard/profile" component={Profile} />
        <Route exact path="/studentdashboard/viewclass" component={ViewClass} />
        <Route exact path="/studentdashboard/qrcode" component={MyQRCode} />
        <Route exact path="/studentdashboard/groupchat" component={() => <GroupChat navBaarTitle={navBaarTitle} />} />
        <Route exact path="/studentdashboard/alerts" component={() => <Alerts navBaarTitle={navBaarTitle} />} />
        <Route exact path="/studentdashboard/changeattendancerequest" component={ChangeAttendanceRequest} />
        <Route exact path="/studentdashboard/myattendancerequests" component={() => <MyAttendanceRequests setNavBarTitle={setNavBaarTitle} />} />
      </Switch>
    </Container>
  )
}

export default Content;