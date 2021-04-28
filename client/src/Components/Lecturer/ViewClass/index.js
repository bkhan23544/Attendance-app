import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import axios from 'axios'
import './styles.scss'
import ViewAttendance from '../ViewAttendance'


export default function ViewClass() {
    const currentClass = useSelector(state => state.setCurrentClass)
    const [message, setMessage] = useState("")
    const [readMore, setReadMore] = useState(false)
    const [messages, setMessages] = useState([])
    const [showModal, setShowModal] = useState(false)

    const toggle = () => setShowModal(!showModal);

    //Get all messages of class
    useEffect(() => {
        getAllMessages()
    }, [])

    const getAllMessages = () => {
        axios.post('http://localhost:5000/getallclassmessages', {
            classID: currentClass.classId
        })
            .then(function (response) {
                setMessages(response.data.reverse())
            })
    }

    //Add a message to class
    const addMessage = () => {
        axios.post('http://localhost:5000/addclassmessage', {
            message: message,
            classID: currentClass.classId
        })
            .then(function (response) {
                if (response.data == "success") {
                    setMessage("")
                    getAllMessages()
                }
            })
    }




    return (
        <div>
            <div className="container main-class-inner">
                <Button onClick={toggle} className="attendance-button" color="primary">View Attendance</Button>
                <h2>{currentClass.className}</h2>
                <h5 className="text-secondary">{currentClass.subjectName}</h5>
                <h6 className="text-secondary">{currentClass.programName} Department</h6>
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
            <div className="container main-class-messages-inner">
                <div className="form-group">
                    <textarea value={message} type="text" className="form-control" id="exampleFormControlTextarea1" placeholder="Add A Message To Class" rows="5" name="message" onChange={(e) => setMessage(e.target.value)}></textarea>
                </div>
                {message && <Button type="submit" color="primary" block onClick={addMessage}>Submit</Button>}
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
            <ViewAttendance showModal={showModal} toggle={toggle} />
        </div>
    )
}