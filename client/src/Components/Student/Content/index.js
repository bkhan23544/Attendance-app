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
  const [currentUrl,setCurrentUrl] = useState("/overseerdashboard")
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
    setCurrentUrl(url)
  })

  return (
    <Container
      fluid
      className={classNames("content", { "is-open": sidebarIsOpen })}
    >
      <Navbar toggleSidebar={toggleSidebar} navBarTitle={navBaarTitle} />
      <Switch>
      {currentUrl=="/studentdashboard" && <Route exact path="/studentdashboard" component={AllClasses} />}
        {currentUrl=="/studentdashboard/profile" && <Route exact path="/studentdashboard/profile" component={Profile} />}
        {currentUrl=="/studentdashboard/viewclass" && <Route exact path="/studentdashboard/viewclass" component={ViewClass} />}
        {currentUrl=="/studentdashboard/qrcode" && <Route exact path="/studentdashboard/qrcode" component={MyQRCode} />}
        {currentUrl=="/studentdashboard/groupchat" && <Route exact path="/studentdashboard/groupchat" component={GroupChat} />}
        {currentUrl=="/studentdashboard/alerts" && <Route exact path="/studentdashboard/alerts" component={Alerts} />}
        {currentUrl=="/studentdashboard/changeattendancerequest" && <Route exact path="/studentdashboard/changeattendancerequest" component={ChangeAttendanceRequest} />}
        {currentUrl=="/studentdashboard/myattendancerequests" && <Route exact path="/studentdashboard/myattendancerequests" component={MyAttendanceRequests} />}
      </Switch>
    </Container>
  )
}

export default Content;