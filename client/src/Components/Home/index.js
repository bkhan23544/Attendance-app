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


  //Check if user has logged in, if yes, check which type of user has logged in and go to that page and save user info in redux store
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        axios.post('http://localhost:5000/identifyuser', {
          uid: user.uid
        })
          .then(function (response) {
            if (response.data[0].accounttype == "Student") {
              props.setStudentAuthTrue()
              dispatch(setCurrentUser(response.data[0]))
              history.push("studentdashboard")
            }
            else if (response.data[0].accounttype == "Lecturer") {
              props.setLecturerAuthTrue()
              dispatch(setCurrentUser(response.data[0]))
              history.push("lecturerdashboard")
            }
          })

      }
      else {
        history.push("/")
      }
    })
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, [])

  return (
    <>
      {loading ?
        <div className="center">
          <Loader
            type="Puff"
            color="#0e6cff"
            height={100}
            width={100}
          />
          <h4>Loading...</h4>
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
                        <h1 className="text-white font-weight-normal home-2-title display-4 mb-0">Student Management System</h1>
                        <Link to="signinasstudent" className="login-btn"><Button color="warning" className="mt-3 text-center home-2-title" size="lg" block>Sign in as Student</Button></Link><br />
                        <Link to="signinaslecturer" className="login-btn"><Button color="warning" className="mt-3 home-2-title" size="lg" block>Sign in as Lecturer</Button></Link>
                        <Grid container className="mt-3">
                          <Grid item xs>
                            <Link to="forgotpassword" variant="body1" className="text-white">
                              Don't remember your password?
              </Link>
                          </Grid>
                          <Grid item>
                            <Link to="signup" variant="body1" className="text-white">
                              {"Need to create an account? Sign Up"}
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