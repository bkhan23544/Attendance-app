import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Button } from 'reactstrap'
import ScanQRCode from '../ScanQRCode'
import './styles.scss'


export default function ViewClass() {
    const currentClass = useSelector(state => state.setCurrentClass)
    const user = useSelector(state => state.setCurrentUser)
    const [readMore, setReadMore] = useState(false)
    const [messages, setMessages] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showAttendanceButton, setShowAttendanceButton] = useState(false)

    const toggle = () => setShowModal(!showModal);

    useEffect(() => {
        getAllMessages()
        checkAttendance()
    }, [])

    //Get all class messages
    const getAllMessages = () => {
        axios.post('http://localhost:5000/getallclassmessages', {
            classID: currentClass.classId
        })
            .then(function (response) {
                setMessages(response.data.reverse())
            })
    }

    //Check if student has marked attendance for today before or not.
    const checkAttendance = () => {
        axios.post('http://localhost:5000/checkattendance', {
            userID: user.userid,
            classID: currentClass.classId,
        })
            .then(function (response) {
                if (response.data == "not exists") {
                    setShowAttendanceButton(true)
                }
                else {
                    setShowAttendanceButton(false)
                }
            })
    }






    return (
        <div>
            <div className="container main-class-inner">
                {showAttendanceButton ? <Button onClick={() => setShowModal(true)} className="attendance-button" color="primary">Mark Attendance</Button>
                    :
                    <p className="text-secondary attendance-button">Attendance Marked</p>
                }
                <h2>{currentClass.className}</h2>
                <h5 className="text-secondary">{currentClass.subjectName}</h5>
                <h6 className="text-secondary">{currentClass.programName} Department</h6>
                <p className="text-secondary"><b>Lecturer:</b> {currentClass.lecturer}</p>
                <p>{readMore ?
                    currentClass.description :
                    currentClass.description.length > 200 ? currentClass.description.substring(0, 200) + "..." : currentClass.description
                }</p>
                {currentClass.description.length > 200 ? readMore ?
                    <a onClick={() => setReadMore(false)}><p className="text-primary cursor-pointer">Read Less</p></a>
                    :
                    <a onClick={() => setReadMore(true)}><p className="text-primary cursor-pointer">Read More</p></a>
                    :
                    <div></div>
                }
            </div>

            {messages.length > 0 ?
                messages.map((v, i) => {
                    return (
                        <div key={i} className="container main-class-messages-inner">
                            <span><b>{currentClass.lecturer}:</b></span><br />
                            <p>{v.message}</p>
                        </div>
                    )
                })
                :
                <h4 className="mt-5 text-center">There are no messages yet</h4>
            }
            {showModal && <ScanQRCode showModal={showModal} toggle={toggle} checkAttendance={checkAttendance} />}
        </div>
    )
}