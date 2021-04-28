
import React, { useState } from 'react';
import { Row, Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import firebase from '../../config/firebase'
import "./styles.scss"

export default function SignInAsLecturer() {

  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [errors, setErrors] = useState([])


  //Check if email is in correct format and send email to the entered email
  const onSubmitEmail = () => {
    var allErrors = []
    if (email !== "") {
      if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        allErrors.push("Please Enter Email In Correct Format")
      }
      else {
        firebase.auth().sendPasswordResetEmail(email)
        setEmailSent(true)
      }
    }
    else {
      allErrors.push("Email Is Required")
    }
    setErrors(allErrors)

    setTimeout(() => {
      setErrors([])
    }, 5000);
  }

  return (<>

    <div className="auth-inner">
      {emailSent ?
        <div>
          <p>
            Check Your Email For Further Steps to Reset Your Password
        </p>
          <Link to="/"><Button type="submit" color="primary" block>Go To Home</Button></Link>
        </div>
        :
        <>
          <h3>Reset Password</h3>

          <div className="form-group">
            <label>Email address</label>
            <input type="email" className="form-control" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          {
            errors.map((error, index) => (
              <Alert key={index} color="danger">
                {error}
              </Alert>
            ))
          }
          <Button onClick={onSubmitEmail} type="submit" color="primary" block>Submit</Button>
        </>}
    </div>
  </>
  )
}