import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import { Switch, Route, useHistory } from "react-router-dom";
import AllClasses from '../AllClasses'
import CreateClass from '../CreateClass'
import Profile from '../Profile'
import Navbar from "../Navbar";
import './styles.scss'
import ViewClass from "../ViewClass";
import Alerts from '../Alerts'
import ApplyForLeave from '../ApplyForLeave'
import MyLeaveRequests from '../MyLeaveRequests'


const Content = ({ sidebarIsOpen, toggleSidebar, navBarTitle }) => {

  const [navBaarTitle, setNavBaarTitle] = useState(navBarTitle)
  const history = useHistory()
  const [currentUrl,setCurrentUrl] = useState("/lecturerdashboard")

  //Check which page is opened and change the Navbar title
  useEffect(() => {
    var url = history.location.pathname
    if (url == "/lecturerdashboard") {
      setNavBaarTitle("All Classes")
    }
    else if (url == "/lecturerdashboard/profile") {
      setNavBaarTitle("Profile")
    }
    else if (url == "/lecturerdashboard/createclass") {
      setNavBaarTitle("Create Class")
    }
    else if (url == "/lecturerdashboard/viewclass") {
      setNavBaarTitle("View Class")
    }
    else if (url == "/lecturerdashboard/alerts") {
      setNavBaarTitle("Alerts")
    }
    else if (url == "/lecturerdashboard/applyforleave") {
      setNavBaarTitle("Apply For Leave")
    }
    else if (url == "/lecturerdashboard/myleaverequests") {
      setNavBaarTitle("My Leave Requests")
    }
    setCurrentUrl(url)
  })

  const setUrl=()=>{
    setCurrentUrl("/lecturerdashboard/viewclass")
  }

  return (
    <Container
      fluid
      className={classNames("content", { "is-open": sidebarIsOpen })}
    >
      <Navbar toggleSidebar={toggleSidebar} navBarTitle={navBaarTitle} />
      <Switch>
      {currentUrl=="/lecturerdashboard" && <Route exact path="/lecturerdashboard" component={()=><AllClasses setUrl={setUrl}/>}/>}
      {currentUrl=="/lecturerdashboard/createclass" && <Route exact path="/lecturerdashboard/createclass" component={CreateClass} />}
        {currentUrl=="/lecturerdashboard/profile" && <Route exact path="/lecturerdashboard/profile" component={Profile} />}
        {currentUrl=="/lecturerdashboard/viewclass" && <Route exact path="/lecturerdashboard/viewclass" component={ViewClass} />}
        {currentUrl=="/lecturerdashboard/alerts" && <Route exact path="/lecturerdashboard/alerts" component={Alerts}/>}
        {currentUrl=="/lecturerdashboard/applyforleave" && <Route exact path="/lecturerdashboard/applyforleave" component={ApplyForLeave} />}
        {currentUrl=="/lecturerdashboard/myleaverequests" && <Route exact path="/lecturerdashboard/myleaverequests" component={MyLeaveRequests} />}
      </Switch>
    </Container>
  )
}

export default Content;