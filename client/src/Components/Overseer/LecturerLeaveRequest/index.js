import { useEffect, useState } from "react"
import axios from 'axios'
import { Button, Container } from 'reactstrap'
import "./styles.scss"


export default function LecturerLeaveRequest() {

    const [alerts, setAlerts] = useState([])
    let componentMounted = true

    useEffect(() => {
        getlecturerleaves()

        return () => {
            componentMounted = false
        }
    }, [])

    //Get all lecturer leave requests
    const getlecturerleaves = () => {
        axios.post('http://localhost:5000/getlecturerleaves')
            .then(function (response) {
                if (componentMounted) {
                    setAlerts(response.data)
                }
            })
    }

    //Approve a lecturer leave request
    const approveRequest = (id) => {
        axios.post('http://localhost:5000/approvelecturerrequest', {
            leaveId: id
        })
            .then(function (response) {
                if (response.data == "success") {
                    getlecturerleaves()
                }
            })
    }

    return (
        <>{alerts.length > 0 ?
            <Container>
                {alerts.map((v, i) => {
                    return (
                        <div key={i} className="request-inner">
                            <h3 className="text-left">{v.title}</h3>
                            <p><b>Lecturer Name:</b> {v.lecturerName}</p>
                            <p>For <b>{Math.round((Date.parse(v.endDate) - Date.parse(v.startDate)) / 1000 / 60 / 60 / 24)} Days</b></p>
                            <p>From <b>{v.startDate.slice(0, 10)}</b> to <b>{v.endDate.slice(0, 10)}</b></p>
                            <p><b>Description:</b> {v.description}</p>
                            {v.approved ? <p>Approved</p> : <Button color="primary" onClick={() => approveRequest(v.leaveId)}>Approve</Button>}
                        </div>
                    )
                })
                }
            </Container>
            :
            <div className="w-100 text-center">
                <h4>There are no Leave Applications yet</h4>
            </div>
        }
        </>
    )
}