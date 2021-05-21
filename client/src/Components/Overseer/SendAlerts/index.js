import { useState } from "react"
import axios from 'axios'
import { Input, Alert, Button } from 'reactstrap'
import { useHistory } from 'react-router-dom'


export default function SendAlerts() {
  const history = useHistory()
  const [errors, setErrors] = useState([])
  const [created,setCreated] = useState(false)
  const [formData, setFormData] = useState({ alertFor: "Lecturers" })


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  //check if all data is present and then send alert to students, lecturers or both
  const onSubmit = () => {
    var allErrors = []

    if (!formData.title) {
      allErrors.push("Title Is Required")
    }
    else if (!formData.alertFor) {
      allErrors.push("Alert For Is Required")
    }
    else if (!formData.description) {
      allErrors.push("Description Is Required")
    }
    else {
      axios.post('http://localhost:5000/sendalert', {
        title: formData.title,
        description: formData.description,
        alertFor: formData.alertFor
      })
        .then(function (response) {
          if (response.data = "success") {
            setCreated(true)
            setTimeout(() => {
              setCreated(false)
            }, 5000);
          }
        })
    }

    setErrors(allErrors)
    setTimeout(() => {
      setErrors([])
    }, 5000);
  }

  return (
    <div className="class-inner">
      <h3>Send Alerts</h3>
      {created && <Alert color="success">
            Alert Sent Successfully
          </Alert>}
      <div className="form-group">
        <label>Title</label>
        <input type="email" className="form-control" placeholder="Enter Title.." name="title" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Alert For</label>
        <Input type="select" onChange={handleChange} defaultValue={formData.programName} name="alertFor" id="programName">
          <option>Lecturers</option>
          <option>Students</option>
          <option>Both</option>
        </Input>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="10" name="description" placeholder="Enter Description.." onChange={handleChange}></textarea>
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