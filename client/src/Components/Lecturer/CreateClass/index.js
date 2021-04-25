
import { Input, Col, Button, Alert } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import "./styles.scss"
import { useState } from 'react';
import { useSelector } from 'react-redux'
import axios from 'axios'



export default function SignInAsLecturer() {
  const [formData, setFormData] = useState({ programName: "Software Engineering" })
  const [errors, setErrors] = useState([])
  const [created,setCreated] = useState(false)
  const history = useHistory()

  const user = useSelector(state => state.setCurrentUser)


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  //Check if all info is present
  const onSubmit = () => {
    var allErrors = []

    if (!formData.className) {
      allErrors.push("Class Name Is Required")
    }
    else if (!formData.programName) {
      allErrors.push("Program Name Is Required")
    }
    else if (!formData.subjectName) {
      allErrors.push("Subject Is Required")
    }
    else if (!formData.description) {
      allErrors.push("Description Is Required")
    }
    else {
      createClass()
    }
    setErrors(allErrors)
    setTimeout(() => {
      setErrors([])
    }, 5000);
  }


  //Create a class
  const createClass = () => {
    
    var classInfo = {}
    classInfo = formData
    classInfo.createdBy = user.userid
    classInfo.lecturer = user.firstName + " " + user.lastName
    axios.post('http://localhost:5000/createclass', {
      classInfo
    })
      .then(function (response) {
        console.log(response,"response")
        if (response.data == "success"){
          setCreated(true)
          setTimeout(() => {
            setCreated(false)
          }, 3000);
        }
          
      })
  }

  return (
    <div className="class-inner">
      <h3>Create Class</h3>
      {created && <Alert color="success">
            Class Created Successfully
          </Alert>}
      <div className="form-group">
        <label>Class Name</label>
        <input type="email" className="form-control" placeholder="Enter Class Name" name="className" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Program Name</label>
        <Input type="select" onChange={handleChange} defaultValue={formData.programName} name="programName" id="programName">
          <option>Software Engineering</option>
          <option>Mechanical Engineering</option>
          <option>Electrical Engineering</option>
          <option>Civil Engineering</option>
        </Input>
      </div>

      <div className="form-group">
        <label>Subject</label>
        <input type="text" className="form-control" placeholder="Enter Subject Name" name="subjectName" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea className="form-control" id="exampleFormControlTextarea1" rows="10" name="description" onChange={handleChange}></textarea>
      </div>


      {
        errors.map((error, index) => (
          <Alert key={index} color="danger">
            {error}
          </Alert>
        ))
      }
      <Button type="submit" color="primary" block onClick={onSubmit}>Submit</Button>
    </div>
  )
}