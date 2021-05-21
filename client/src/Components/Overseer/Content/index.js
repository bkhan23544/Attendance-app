import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import { Switch, Route, useHistory } from "react-router-dom";
import AllLecturers from '../AllLecturers'
import AllStudents from '../AllStudents'
import Navbar from "../Navbar";
import './styles.scss'
import SendAlerts from "../SendAlerts";
import LecturerLeaveRequest from "../LecturerLeaveRequest";
import AttendanceChangeRequests from "../AttendanceChangeRequests"
import AllClasses from '../AllClasses'
import ViewClass from "../ViewClass";

const Content = ({ sidebarIsOpen, toggleSidebar, navBarTitle }) => {

  const [navBaarTitle, setNavBaarTitle] = useState(navBarTitle)
  const history = useHistory()
  const [currentUrl,setCurrentUrl] = useState("/overseerdashboard")
  //Check which page is opened and change the Navbar title
  useEffect(() => {
    var url = history.location.pathname
    if (url == "/overseerdashboard") {
      setNavBaarTitle("All Lecturers")
    }
    if (url == "/overseerdashboard/allclasses") {
      setNavBaarTitle("All Classes")
    }
    else if (url == "/overseerdashboard/viewclass") {
      setNavBaarTitle("View Class")
    }
    if (url == "/overseerdashboard/allstudents") {
      setNavBaarTitle("All Students")
    }
    if (url == "/overseerdashboard/sendalerts") {
      setNavBaarTitle("Send Alerts")
    }
    if (url == "/overseerdashboard/lecturerleaverequest") {
      setNavBaarTitle("Lecturer Leave Requests")
    }
    if (url == "/overseerdashboard/attendancechangerequest") {
      setNavBaarTitle("Attendance Change Requests")
    }
    setCurrentUrl(url)
  })

  const setUrl=()=>{
    setCurrentUrl("/overseerdashboard/viewclass")
  }

  return (
    <Container
      fluid
      className={classNames("content", { "is-open": sidebarIsOpen })}
    >
      <Navbar toggleSidebar={toggleSidebar} navBarTitle={navBaarTitle} />
      <Switch>
        {currentUrl=="/overseerdashboard/allclasses" && <Route exact path="/overseerdashboard/allclasses" component={()=><AllClasses setUrl={setUrl}/>} />}
        {currentUrl=="/overseerdashboard/viewclass" && <Route exact path="/overseerdashboard/viewclass" component={ViewClass} />}
        {currentUrl=="/overseerdashboard" && <Route exact path="/overseerdashboard" component={AllLecturers} />}
        {currentUrl=="/overseerdashboard/allstudents" && <Route exact path="/overseerdashboard/allstudents" component={AllStudents} />}
        {currentUrl=="/overseerdashboard/sendalerts" && <Route exact path="/overseerdashboard/sendalerts" component={SendAlerts} />}
        {currentUrl=="/overseerdashboard/lecturerleaverequest" && <Route exact path="/overseerdashboard/lecturerleaverequest" component={LecturerLeaveRequest}/>}
        {currentUrl=="/overseerdashboard/attendancechangerequest" && <Route exact path="/overseerdashboard/attendancechangerequest" component={AttendanceChangeRequests} />}
      </Switch>
    </Container>
  )
}

export default Content;