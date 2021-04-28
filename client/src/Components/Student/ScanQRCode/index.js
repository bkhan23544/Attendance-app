import React, { useEffect, useState } from 'react'
import { Modal, Alert } from 'reactstrap'
import QrReader from 'react-qr-scanner'
import { useSelector } from 'react-redux'
import axios from 'axios'
import "./styles.scss"


const previewStyle = {
  height: window.innerWidth > 576 ? 320 : 240,
  width: window.innerWidth > 576 ? 480 : 320,
}

export default function ScanQRCode({ showModal, toggle, checkAttendance }) {

  const [delay, setDelay] = useState(100)
  const [qrData, setQrData] = useState({})
  const currentClass = useSelector(state => state.setCurrentClass)
  const user = useSelector(state => state.setCurrentUser)
  const [error, setError] = useState("")

  const handleError = (err) => {
    console.error(err)
  }

  //Handle scan, check if QR code is present. If yes, check if it's correct and mark attendance for today
  const handleScan = (data) => {
    if (data !== null) {
      if (data.text == user.userid) {
        axios.post('http://localhost:5000/markattendance', {
          classID: currentClass.classId,
          studentName: user.firstName + " " + user.lastName,
          rollNo: user.rollNo,
          userID: user.userid,
          lecturer: currentClass.lecturer
        })
          .then(function (response) {
            if (response.data == "success") {
              setQrData(data)
              checkAttendance()
              toggle()
            }
          })

      }
      else {
        setError("Please Scan Correct QR Code")
      }
    }

  }

  return (
    <>

      <Modal className="qr-code-modal" isOpen={showModal} centered toggle={toggle}>
        {!qrData.text ?
          <div>
            <QrReader
              delay={delay}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
            />
            <h5 className="mt-3 text-center">Go To My QR Code from sidebar and scan it to mark your attendance</h5>
            {error && <Alert className="mt-3 text-center" color="danger">
              {error}
            </Alert>}
          </div>
          : <h5 className="mt-3 text-center">Your Attendance has been successfully marked</h5>
        }
      </Modal>
    </>
  )
}