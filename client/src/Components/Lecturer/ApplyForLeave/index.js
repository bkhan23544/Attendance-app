
import { Input, Col, Button, Alert } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import "./styles.scss"
import { useState } from 'react';
import { useSelector } from 'react-redux'
import axios from 'axios'
import DatePicker from "react-datepicker";


export default function ApplyForLeave() {
  const [formData, setFormData] = useState({ startDate: new Date(), endDate: new Date() })
  const [errors, setErrors] = useState([])
  const [created,setCreated] = useState(false)
  const history = useHistory()
  const user = useSelector(state => state.setCurrentUser)


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const setStartDate = (date) => {
    setFormData({ ...formData, startDate: date })
  }

  const setEndDate = (date) => {
    setFormData({ ...formData, endDate: date })
  }

  //Check if all info is present and then apply for leave
  const onSubmit = () => {
    var allErrors = []

    if (!formData.title) {
      allErrors.push("Title Is Required")
    }
    else if (!formData.description) {
      allErrors.push("Description Is Required")
    }
    else if (formData.startDate >= formData.endDate) {
      allErrors.push("End Date Should Be Greater Than Start Date")
    }
    else {
      applyForLeave()
    }
    setErrors(allErrors)
    setTimeout(() => {
      setErrors([])
    }, 5000);
  }


  //Send leave data to database
  const applyForLeave = () => {
    var leaveInfo = {}
    leaveInfo = formData
    leaveInfo.lecturer = user.userid
    leaveInfo.lecturerName = user.firstName + " " + user.lastName
    axios.post('http://localhost:5000/applyforlecturerleave', {
      leaveInfo
    })
      .then(function (response) {
        console.log(response.data, "data")
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
      <h3>Apply For Leave</h3>
      {created && <Alert color="success">
            Applied for Leave Successfully
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
        <label>From</label><br />
        <DatePicker selected={formData.startDate} onChange={date => setStartDate(date)} />
      </div>

      <div className="form-group">
        <label>To</label><br />
        <DatePicker selected={formData.endDate} onChange={date => setEndDate(date)} />
      </div>


      {
        errors.map((error, index) => (
          <Alert key={index} color="danger">
            {error}
          </Alert>
        ))
      }
      <Button type="submit" color="warning" block onClick={onSubmit}>Submit</Button>
    </div>
  )
}