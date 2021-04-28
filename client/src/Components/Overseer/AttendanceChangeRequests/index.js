import { useEffect, useState } from "react"
import axios from 'axios'
import { Button, Container } from 'reactstrap'
import "./styles.scss"


export default function LecturerLeaveRequest() {

    const [alerts, setAlerts] = useState([])
    let componentMounted = true

    useEffect(() => {
        getRequests()
        return () => {
            componentMounted = false
        }
    }, [])

    //Get all attendance change requests from database
    const getRequests = () => {
        console.log("ran again")
        axios.post('http://localhost:5000/getattendancerequests')
            .then(function (response) {
                if (componentMounted) {
                    setAlerts(response.data)
                }
            })
    }

    //Approve Request and mark attendance
    const approveRequest = (v) => {
        axios.post('http://localhost:5000/getaclass', {
            classID: v.classId,
        })
            .then(function (currentClass) {
                axios.post('http://localhost:5000/approveattendancerequest', {
                    requestID: v.requestID,
                    studentName: v.studentName,
                    userID: v.student,
                    classID: v.classId,
                    lecturer: currentClass.data[0].lecturer,
                    rollNo: v.rollNo,
                    date:v.date
                })
                    .then(function (response) {
                        if (response.data == "success") {
                            getRequests()
                        }
                    })
            })


    }

    return (
        <>{alerts.length > 0 ?
            <Container>
                {alerts.map((v, i) => {
                    return (
                        <div key={i} className="request-inner">
                            <h3 className="text-left">{v.title}</h3>
                            <p><b>Student Name:</b> {v.studentName}</p>
                            <p><b>Date:</b> {v.date.slice(0, 10)}</p>
                            <p><b>Class:</b>{v.className}</p>
                            <p><b>Description:</b> {v.description}</p>
                            <b>Medical Certificate:</b><br />
                            <img src={v.medicalCert} className="medical-cert" /><br />
                            {v.approved ? <p>Approved</p> : <Button color="primary" onClick={() => approveRequest(v)}>Approve</Button>}
                        </div>
                    )
                })
                }
            </Container>
            :
            <div className="w-100 text-center">
                <h4>There are no Requests yet</h4>
            </div>
        }
        </>
    )
}