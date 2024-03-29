
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentClass } from '../../../redux/action'
import { useHistory } from 'react-router';




export default function AllClasses(props) {
  const user = useSelector(state => state.setCurrentUser)
  const [classesData, setClassesData] = useState([])
  const dispatch = useDispatch()
  const history = useHistory()
  let componentMounted = true

  //Get all classes from database offered for the user program   
  useEffect(() => {
    const params = new URLSearchParams(
      {uid: user.userid,
      accounttype: "student",
      programName: user.programName}).toString();

    axios.get(`http://localhost:5000/getallclasses?${params}`)
      .then(function (response) {
        if (componentMounted) {
          setClassesData(response.data)
        }
      })

    return () => {
      componentMounted = false
    }
  }, [])

  //Save selected class in redux store
  const viewClass = (v) => {
    dispatch(setCurrentClass(v))
    props.setUrl()
    history.push("/studentdashboard/viewclass")
  }

  return (
    <div className="row m-3">
      {
        classesData.length > 0 ?
          classesData.map((v, i) => {
            return (
              <Card key={i} style={{ width: "17rem" }} className="m-2">
                <CardBody>
                  <CardTitle tag="h5">{v.className}</CardTitle>
                  <CardSubtitle tag="h6" className="mb-2 text-muted">{v.subjectName}</CardSubtitle>
                  <CardText>{v.description.substring(0, 50)}{"..."}</CardText>
                  <Button color="warning" onClick={() => viewClass(v)}>View</Button>
                </CardBody>
              </Card>
            )
          })
          :
          <div className="w-100 text-center">
            <h4>You haven't enrolled in any classes</h4>
          </div>
      }

    </div>
  )
}