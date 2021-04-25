import { useEffect, useState } from "react"
import axios from 'axios'
import { Button, Container } from 'reactstrap'
import "./styles.scss"
import { useSelector } from 'react-redux'


export default function LecturerLeaveRequest(props) {

    const [alerts, setAlerts] = useState([])
    let componentMounted = true
    const user = useSelector(state => state.setCurrentUser)

    //Get current user's leave requests from database
    useEffect(() => {
        axios.post('http://localhost:5000/getlecturerleaves', {
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
    }, [props.navBaarTitle])

    return (
        <>{alerts.length > 0 ?
            <Container>
                {alerts.map((v, i) => {
                    return (
                        <div key={i} className="request-inner">
                            <h3 className="text-left">{v.title}</h3>
                            <p>For <b>{Math.round((Date.parse(v.endDate) - Date.parse(v.startDate)) / 1000 / 60 / 60 / 24)} Days</b></p>
                            <p>From <b>{v.startDate.slice(0, 10)}</b> to <b>{v.endDate.slice(0, 10)}</b></p>
                            <p><b>Description:</b> {v.description}</p>
                            <p><b>Status</b>: {v.approved ? "Approved" : "Pending"}</p>
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