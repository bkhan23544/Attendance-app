import { useEffect, useState } from "react"
import axios from 'axios'
import { Button, Container } from 'reactstrap'
import { useSelector } from 'react-redux'
import "./styles.scss"


export default function LecturerLeaveRequest() {

    const [alerts, setAlerts] = useState([])
    const user = useSelector(state => state.setCurrentUser)
    let componentMounted = true

    //Get all my attendance requests
    useEffect(() => {
        axios.post('http://localhost:5000/getattendancerequests', {
            userid: user.userid
        })
            .then(function (response) {
                if (componentMounted) {
                    setAlerts(response.data)
                }
            })

        return () => {
            componentMounted = false
        }
    }, [])

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
                            <p><b>Status</b>: {v.approved ? "Approved" : "Pending"}</p>
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