
import { Row, Col, Button, Alert } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import "./styles.scss"
import { useEffect, useState } from 'react';
import firebase from '../../../config/firebase'
import axios from "axios";


export default function SignInAsLecturer() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState([])
  const history = useHistory()
  let componentMounted = true
  //save input changes in state
  const handleChange = (e) => {
    if (componentMounted) {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  //Validate if all data is present and in correct format and then login.  
  const onSubmit = () => {
    var allErrors = []

    if (!formData.email) {
      allErrors.push("Email Is Required")
    }
    else if (!formData.password) {
      allErrors.push("Password Is Required")
    }
    else {
      if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(formData.email)) {
        allErrors.push("Please Enter Email In Correct Format")
      }
      else if (formData.password.length < 6) {
        allErrors.push("Length of Password Should Be 6 Or More Characters ")
      }
      else {
        signIn()
      }
    }
    if (componentMounted) {
      setErrors(allErrors)
      setTimeout(() => {
        setErrors([])
      }, 5000);
    }
  }

  useEffect(() => {
    return () => {
      componentMounted = false
    }
  }, [])

  //Check if user exists and approved and not disabled and then login
  const signIn = () => {

    axios.post('http://localhost:5000/checkuser', {
      accounttype: "lecturers",
      email: formData.email
    })
      .then(function (response) {
        if (response.data == "exists") {
          firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
            .then((userCredential) => {
              // Signed in
              history.push("/lecturerdashboard")
              // ...
            })
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              var allErrors = []
              allErrors.push(errorMessage)
              if (componentMounted) {
                setErrors(allErrors)
                setTimeout(() => {
                  setErrors([])
                }, 5000);
              }
            });

        }
        else if (response.data == "Not Approved") {
          var allErrors = []
          allErrors.push("This Account Hasn't Been Approved By Overseer Yet")
          if (componentMounted) {
            setErrors(allErrors)
            setTimeout(() => {
              setErrors([])
            }, 5000);
          }
        }


        else if (response.data == "disabled") {
          var allErrors = []
          allErrors.push("This Account Has Been Disabled By Overseer")
          if (componentMounted) {
            setErrors(allErrors)
            setTimeout(() => {
              setErrors([])
            }, 5000);
          }
        }
        else {
          var allErrors = []
          allErrors.push("A lecturer account with this email doesn't exists")
          if (componentMounted) {
            setErrors(allErrors)
            setTimeout(() => {
              setErrors([])
            }, 5000);
          }
        }
      })

  }

  return (
    <div className="signinRoot">
      <div className="auth-inner">
        <h3>Sign In As Lecturer</h3>

        <div className="form-group">
          <label>Email address</label>
          <input type="email" className="form-control" placeholder="Enter email" name="email" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" name="password" placeholder="Enter password" onChange={handleChange} />
        </div>
        {
          errors.map((error, index) => (
            <Alert key={index} color="danger">
              {error}
            </Alert>
          ))
        }
        <Button type="submit" color="primary" block onClick={onSubmit}>Submit</Button>
        <Link to="./forgotpassword" variant="body1" className="forgot-password">
          Forgot password?
              </Link>
      </div>
    </div>
  )
}