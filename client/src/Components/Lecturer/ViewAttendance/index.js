import React, { useState } from 'react'
import { Modal, Button, Alert } from 'reactstrap'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.scss"
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  JsonToCsv,
  useJsonToCsv
} from 'react-json-csv';




export default function ViewAttendance({ showModal, toggle }) {
  const currentClass = useSelector(state => state.setCurrentClass)
  const [startDate, setStartDate] = useState(new Date());
  const user = useSelector(state => state.setCurrentUser)
  const [error, setError] = useState("")
  const { saveAsCsv } = useJsonToCsv();

  //Download attendance for the selected date, if attendance doesn't exists, show error.
  const downloadAttendance = (date) => {
    if (date == "today") {
      var reqDate = formatDate(new Date())
      axios.post('http://localhost:5000/getattendance', {
        date: reqDate,
        classID: currentClass.classId
      })
        .then(function (response) {
          if (response.data == "ER_NO_SUCH_TABLE") {
            setError("Attendance for this date does not exists")
            setTimeout(() => {
              setError("")
            }, 5000);
          }
          else {
            setError("")
            var data = response.data

            data.map((v) => {
              v.attendanceDate = formatDateForExcel(new Date())
              v.time = v.timeStamp.substring(11, 16)
            })
            console.log(data, "date")
            saveAsCsv(
              {
                data,
                fields: {
                  "serialNo": "Serial No",
                  "studentName": "Student Name",
                  "rollNo": "Roll No",
                  "time": "Sign In Time",
                  "lecturer": "Lecturer",
                  "attendanceDate": "Date"
                },
                filename: "Attendance" + " " + currentClass.classId + reqDate
              }
            )
          }
        })
    }
    else if (date == "date") {
      var reqDate = formatDate(startDate)
      axios.post('http://localhost:5000/getattendance', {
        date: reqDate,
        classID: currentClass.classId
      })
        .then(function (response) {
          if (response.data == "ER_NO_SUCH_TABLE") {
            setError("Attendance for this date does not exists")
            setTimeout(() => {
              setError("")
            }, 5000);
          }
          else {
            setError("")
            var data = response.data

            data.map((v) => {
              v.attendanceDate = formatDateForExcel(startDate)
              v.time = v.timeStamp.substring(11, 16)
            })
            console.log(data, "date")
            saveAsCsv(
              {
                data,
                fields: {
                  "serialNo": "Serial No",
                  "studentName": "Student Name",
                  "rollNo": "Roll No",
                  "time": "Sign In Time",
                  "lecturer": "Lecturer",
                  "attendanceDate": "Date"
                },
                filename: "Attendance" + " " + currentClass.classId + reqDate
              }
            )
          }
        })
    }
  }

  //Convert date in specific format
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return `${day}${month}${year}`;
  }

  //Convert date in specific format for excel file
  function formatDateForExcel(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return `${day}-${month}-${year}`;
  }

  return (
    <Modal size="lg" className="view-attendance-modal" isOpen={showModal} centered toggle={toggle}>
      <div className="m-3">
        <h3 className="text-center">View Attendance</h3>
        <Button color="primary" block onClick={() => downloadAttendance("today")}>Download Today's Attendance</Button>
        <p className="text-center mt-3">OR Choose a Date</p>
        <div className="row">
          <div className="m-auto">
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
          </div>
        </div>
        {error && <Alert color="danger" className="mt-3">{error}</Alert>}
        <Button color="primary" className="mt-3" block onClick={() => downloadAttendance("date")}>Download Attendance</Button>
      </div>
    </Modal>
  )
}