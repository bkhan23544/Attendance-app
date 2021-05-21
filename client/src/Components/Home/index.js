import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Spinner } from 'reactstrap';
import animationImg from '../../assets/images/animation.png'
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import firebase from '../../config/firebase'
import "./style.scss"
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../../redux/action'
import axios from 'axios';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";



export default function Home(props) {
  const history = useHistory()
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)
  let componentMounted = true;

  //Check if user has logged in, if yes, check which type of user has logged in and go to that page and save user info in redux store. 
  // Also check if the user is disabled or not approved. In that case, logout
  useEffect(() => {

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        const params = new URLSearchParams({uid: user.uid}).toString();
        axios.get(`http://localhost:5000/identifyuser?${params}`)
          .then(function (response) {
            if (response.data[0].accounttype == "Student") {
              if (!response.data[0].approved || response.data[0].disabled) {
                firebase.auth().signOut()
                history.push("signinasstudent")
              }
              else {
                props.setStudentAuthTrue()
                dispatch(setCurrentUser(response.data[0]))
                history.push("studentdashboard")
              }
            }
            else if (response.data[0].accounttype == "Lecturer") {
              if (!response.data[0].approved || response.data[0].disabled) {
                firebase.auth().signOut()
                history.push("signinaslecturer")
              }
              else {
                props.setLecturerAuthTrue()
                dispatch(setCurrentUser(response.data[0]))
                history.push("lecturerdashboard")
              }

            }
            else if (response.data[0].accounttype == "overseer") {
              props.setOverseerAuthTrue()
              dispatch(setCurrentUser(response.data[0]))
              history.push("overseerdashboard")
            }
          })

      }
      else {
        history.push("/")
      }
    })
    return () => {
      componentMounted = false;
    }
  })

  useEffect(() => {
    setTimeout(() => {
      if (componentMounted) {
        setLoading(false)
      }
    }, 2000);
    return () => {
      componentMounted = false;
    }
  }, [])

  return (
    <>
      {loading ?
      <div className="loading">
        <div className="center">
          <h4>Loading...</h4>
        </div>
        </div>
        :
        <React.Fragment>
          <section className="section home-2-bg" id="home">
            <div className="home-center">
              <div className="home-desc-center">
                <div className="container">
                  <Row className="align-items-center">
                    <Col lg="5">
                      <div className="mt-40 home-2-content">
                        <h1 className="text-white font-weight-normal home-2-title display-4 mb-0">Welcome To Attendance App</h1>
                        <Link to="signinasstudent" className="login-btn"><Button color="warning" className="mt-3 text-center home-2-title" size="lg" block>Login as Student</Button></Link>
                        <Link to="signinaslecturer" className="login-btn"><Button color="warning" className="mt-3 home-2-title" size="lg" block>Login as Lecturer</Button></Link>
                        <Link to="signinasoverseer" className="login-btn"><Button color="warning" className="mt-3 home-2-title" size="lg" block>Login as Overseer</Button></Link>
                        <Grid container className="mt-3">
                          <Grid item xs>
                            <Link to="forgotpassword" variant="body1" className="text-white">
                              Forgot password?
              </Link>
                          </Grid>
                          <Grid item>
                            <Link to="signup" variant="body1" className="text-white">
                              {"Don't have an account? Sign Up"}
                            </Link>
                          </Grid>
                        </Grid>
                      </div>
                    </Col>

                    <Col lg="7">
                      <div className="mt-40 home-2-content position-relative">
                        <img src={animationImg} alt="" className="img-fluid mx-auto d-block home-2-img mover-img" />
                        <div className="home-2-bottom-img">
                          <img src="images/homr-2-bg-bottom.png" alt="" className="img-fluid d-block mx-auto" />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </section>
        </React.Fragment>}
    </>
  )
}