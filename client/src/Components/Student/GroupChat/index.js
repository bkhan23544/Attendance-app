import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button } from 'reactstrap'
import "./styles.scss"
import { useSelector } from 'react-redux'
import axios from 'axios'
import io from "socket.io-client";


const ENDPOINT = 'localhost:5000';

let socket;

export default function GroupChat(props) {
  const user = useSelector(state => state.setCurrentUser)
  const [initialMessage, setInitialMessage] = useState(true)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  let componentMounted = true

  //Join chat room for the user program
  useEffect(() => {
    setTimeout(() => {
      if (componentMounted) {
        setInitialMessage(false)
      }
    }, 3000);
    socket = io(ENDPOINT);
    socket.emit('join', { room: user.programName }, (error) => {
      if (error) {
        console.log(error);
      }
    });
    return () => {
      componentMounted = false
    }
  }, [props.navBaarTitle])

  //Get messages from database and get any new message that comes from socket and save it in state
  useEffect(() => {
    getMessages()
    socket.on('new_message', message => {
      if (componentMounted) {
        setMessages(messages => [...messages, message]);
      }
      var dummy = document.getElementById("dummy")
      if (dummy) {
        dummy.scrollIntoView({ behavior: "smooth" });
      }
    });
    return () => {
      componentMounted = false
    }
  }, [props.navBaarTitle])

  //Get messages from database
  const getMessages = () => {
    const params = new URLSearchParams({programName: user.programName}).toString();
    axios.get(`http://localhost:5000/getmessages?${params}`)
      .then(function (response) {
        if (response.data.length > 0) {
          if (componentMounted) {
            setMessages(response.data)
          }
          var dummy = document.getElementById("dummy")
          if (dummy) {
            dummy.scrollIntoView({ behavior: "smooth" });
          }
        }
      })
  }

  //send a message to chat
  const sendMessage = () => {
    if (componentMounted) {
      if (message) {
        socket.emit('sendMessage', {
          senderid: user.userid,
          programName: user.programName,
          message: message,
          timeStamp: Date(),
          userName: user.firstName + " " + user.lastName
        }, () => setMessage(''));
      }
    }
  }


  return (
    <>
      <div className="message-root" style={{ height: (window.innerHeight - 140) + "px" }}>
        <div className="message-wrap" id="message-wrapper">
          {initialMessage && <Alert className="text-center">Here you can chat with all students enrolled in {user.programName}</Alert>}
          {messages.map((v, i) => {
            return (
              <>
                {v.senderid === user.userid ? <div key={i} className="message-list me">

                  <div className="msg">
                    <p className="text-right">
                      {v.message}
                    </p>
                  </div>
                  <div className="time">{v.timeStamp.slice(16, 24)}</div>
                </div>
                  :
                  <div key={i} className="message-list">

                    <div className="msg">
                      <b>{v.userName}</b>
                      <p>
                        {v.message}
                      </p>
                    </div>
                    <div className="time">{v.timeStamp.slice(16, 24)}</div>
                  </div>
                }
                <div id="dummy" style={{ float: "left", clear: "both" }}>
                </div>
              </>
            )
          })
          }

        </div>
      </div>
      <div className="message-footer">
        <input value={message} type="text" onChange={(e) => { if (componentMounted) { setMessage(e.target.value) } }} data-placeholder="Send a message to {0}" />
        <Button onClick={sendMessage} color="warning">Send</Button>
      </div>
    </>
  )
}