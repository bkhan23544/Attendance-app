
import { Input, Progress, Button, Alert } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import "./styles.scss"
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import axios from 'axios'
import DatePicker from "react-datepicker";
import firebase from '../../../config/firebase'
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';


export default function ChangeAttendanceRequest() {
  const [formData, setFormData] = useState({ date: new Date(), class: "Select Class" })
  const [errors, setErrors] = useState([])
  const [classesData, setClassesData] = useState([])
  const [selectClicked, setSelectClicked] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [created,setCreated] = useState(false)
  const history = useHistory()
  const user = useSelector(state => state.setCurrentUser)


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const setDate = (date) => {
    setFormData({ ...formData, date: date })
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

    setFormData({ ...formData, medicalCert: downloadURL })
  };


  //Check if all info is present
  const onSubmit = () => {
    var allErrors = []

    if (!formData.title) {
      allErrors.push("Title Is Required")
    }
    else if (!formData.description) {
      allErrors.push("Description Is Required")
    }
    else if (formData.class == "Select Class" || !formData.class) {
      allErrors.push("Class Is Required")
    }
    else if (!formData.medicalCert) {
      allErrors.push("Medical Certificatie Is Required")
    }
    else {
      makeRequest()
    }
    setErrors(allErrors)
    setTimeout(() => {
      setErrors([])
    }, 5000);
  }


  //Make a request to change attendance
  const makeRequest = () => {

    var requestInfo = {}
    requestInfo = formData
    requestInfo.student = user.userid
    requestInfo.studentName = user.firstName + " " + user.lastName
    requestInfo.className = classesData[parseInt(formData.class[formData.class.length - 1])].className
    requestInfo.classId = classesData[parseInt(formData.class[formData.class.length - 1])].classId
    requestInfo.rollNo = user.rollNo
    axios.post('http://localhost:5000/changeattendancerequest', {
      requestInfo
    })
      .then(function (response) {
        if (response.data == "success"){
          setCreated(true)
          setTimeout(() => {
            setCreated(false)
          }, 5000);
        }
      })
  }

  return (
    <div className="leave-inner">
      <h3>Change Attendance Request</h3>
      {created && <Alert color="success">
            Request Sent Successfully
          </Alert>}
      <div className="form-group">
        <label>Title</label>
        <input type="text" className="form-control" placeholder="Enter Title" name="title" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea className="form-control" id="exampleFormControlTextarea1" placeholder="Enter Description" rows="10" name="description" onChange={handleChange}></textarea>
      </div>

      <div className="form-group">
        <label>Class</label>
        <Input type="select" onChange={handleChange} onClick={() => setSelectClicked(true)} defaultValue={formData.class} name="class" id="exampleSelect">
          {!selectClicked && <option>Select Class</option>}
          {classesData.map((v, i) => {
            return (
              <option key={i} value={v.classId + `${i}`}>{v.className}</option>
            )
          })}
        </Input>
      </div>

      <div className="form-group">
        <label>Date</label><br />
        <DatePicker selected={formData.date} onChange={date => setDate(date)} />
      </div>

      {!formData.medicalCert && isUploading ? <div className="text-center mt-3">
        <p>Uploading...</p>
        {!formData.medicalCert && <Progress value={uploadProgress} />}
      </div>
        :
        !formData.medicalCert && <CustomUploadButton
          accept="image/*"
          storageRef={firebase.storage().ref('images')}
          onUploadStart={handleUploadStart}
          onUploadError={handleUploadError}
          onUploadSuccess={handleUploadSuccess}
          onProgress={handleProgress}
          className="upload-btn"
        >
          Upload Medical Certificate
  </CustomUploadButton>}

      {formData.medicalCert && <div className="img-wrap">
        <span className="close" onClick={() => { setFormData({ ...formData, medicalCert: "" }); setIsUploading(false) }}>&times;</span>
        <img src={formData.medicalCert} className="displayImg" />
      </div>}

      {
        errors.map((error, index) => (
          <Alert key={index} color="danger">
            {error}
          </Alert>
        ))
      }
      <Button className="mt-4" type="submit" color="primary" block onClick={onSubmit}>Submit</Button>
    </div>
  )
}