import React, { useState } from 'react';
import { Button, Input, Alert, Progress } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import firebase from '../../config/firebase'
import "./styles.scss"
import axios from 'axios'
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';

export default function SignInAsLecturer() {
  const [formData, setFormData] = useState({ approved: 0, disabled: 0, accounttype: "Student", programName: "Software Engineering" })
  const [errors, setErrors] = useState([])
  const history = useHistory()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  //save input changes in state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  //Start uploading profile picture
  const handleUploadStart = (e) => {
    setIsUploading(true)
    setUploadProgress(0)
  }


  //Update Progress state to update progress bar 
  const handleProgress = progress => {
    setUploadProgress(progress)
  }


  //handle any error during upload  
  const handleUploadError = error => {
    setIsUploading(false)
  };

  //Save url after upload success  
  const handleUploadSuccess = async filename => {
    const downloadURL = await firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL();

    setFormData({ ...formData, profilePic: downloadURL })
  };

  //Check if all data is present and in correct format and signup
  const onSubmit = () => {
    var allErrors = []

    if (!formData.firstName) {
      allErrors.push("First Name Is Required")
    }
    else if (!formData.lastName) {
      allErrors.push("Last Name Is Required")
    }
    else if (!formData.accounttype) {
      allErrors.push("Account Type Is Required")
    }
    else if (!formData.email) {
      allErrors.push("Email Is Required")
    }
    else if (!formData.password) {
      allErrors.push("Password Is Required")
    }
    else if (!formData.profilePic) {
      allErrors.push("Profile Picture Is Required")
    }
    else if (formData.accounttype == "Student" && !formData.rollNo) {
      allErrors.push("Roll No Is Required")
    }
    else if (formData.accounttype == "Student" && !formData.programName) {
      allErrors.push("Program Name Is Required")
    }
    else if (formData.accounttype == "Lecturer" && !formData.regNo) {
      allErrors.push("Registration No Is Required")
    }
    else {
      if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(formData.email)) {
        allErrors.push("Please Enter Email In Correct Format")
      }
      else if (formData.password.length < 6) {
        allErrors.push("Length of Password Should Be 6 Or More Characters ")
      }
      else {
        signUp()
      }
    }
    setErrors(allErrors)
    setTimeout(() => {
      setErrors([])
    }, 5000);
  }

  //Sign up and save user data to database
  const signUp = () => {
    axios.post('http://localhost:5000/checkexists', {
      formData
    })
      .then(function (response) {
        console.log(response.data,"response")
        if (response.data == "Roll No Exists") {
          var allErrors = []
          allErrors.push("Roll No Exists")
          setErrors(allErrors)
          setTimeout(() => {
            setErrors([])
          }, 3000);
        }
        else if (response.data == "Registration No Exists") {
          var allErrors = []
          allErrors.push("Registration No Exists")
          setErrors(allErrors)
          setTimeout(() => {
            setErrors([])
          }, 3000);
        }
        else if (response.data == "Not Exists") {
          firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
            .then((userCredential) => {
              var userData = formData
              userData.password = ""
              userData.userid = userCredential.user.uid
              axios.post('http://localhost:5000/createuser', {
                userData
              })
                .then(function (response) {
                  if (response.data == "success") {
                    history.push("/")
                  }

                })
                .catch((e) => {
                  var allErrors = []
                  allErrors.push(e)
                  setErrors(allErrors)
                })

            }
            )
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              var allErrors = []
              allErrors.push(errorMessage)
              setErrors(allErrors)
              // ..
            });
        }
      })


  }

  return (
    <div className="signinRoot">
      <div className="signup-auth-inner">
        <h3>Sign Up</h3>

        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" className="form-control" placeholder="Enter First Name" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" className="form-control" placeholder="Enter Last Name" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email address</label>
          <input type="email" name="email" className="form-control" placeholder="Enter Email" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" className="form-control" value={formData.password} placeholder="Enter Password" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Account Type</label>
          <Input type="select" onChange={handleChange} defaultValue={formData.accounttype} name="accounttype" id="exampleSelect">
            <option>Student</option>
            <option>Lecturer</option>
          </Input>
        </div>

        {formData.accounttype === "Student" && <div className="form-group">
          <label>Roll No</label>
          <input type="text" name="rollNo" className="form-control" placeholder="Enter Roll No" onChange={handleChange} />
        </div>}

        {formData.accounttype === "Student" && <div className="form-group">
          <label>Program Name</label>
          <Input type="select" onChange={handleChange} defaultValue={formData.programName} name="programName" id="programName">
            <option>Software Engineering</option>
            <option>Mechanical Engineering</option>
            <option>Electrical Engineering</option>
            <option>Civil Engineering</option>
          </Input>
        </div>}

        {formData.accounttype === "Lecturer" && <div className="form-group">
          <label>Registration No</label>
          <input type="text" name="regNo" className="form-control" placeholder="Enter Registration No" onChange={handleChange} />
        </div>}

        {!formData.profilePic && isUploading ? <div className="text-center mt-3">
          <p>Uploading...</p>
          {!formData.profilePic && <Progress value={uploadProgress} />}
        </div>
          :
          !formData.profilePic && <CustomUploadButton
            accept="image/*"
            storageRef={firebase.storage().ref('images')}
            onUploadStart={handleUploadStart}
            onUploadError={handleUploadError}
            onUploadSuccess={handleUploadSuccess}
            onProgress={handleProgress}
            className="upload-btn"
          >
            Upload Profile Picture
  </CustomUploadButton>}

        {formData.profilePic && <div className="img-wrap">
          <span className="close" onClick={() => { setFormData({ ...formData, profilePic: "" }); setIsUploading(false) }}>&times;</span>
          <img src={formData.profilePic} className="displayImg" />
        </div>}

        {
          errors.map((error, index) => (
            <Alert key={index} className="mt-2" color="danger">
              {error}
            </Alert>
          ))
        }
        <Button className="mt-4" onClick={onSubmit} type="submit" color="primary" block>Submit</Button>
      </div>
    </div>
  )
}