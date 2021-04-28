import React, { useEffect } from 'react'
import * as QRCode from 'qrcode.react'
import firebase from '../../../config/firebase'
import './styles.scss'

export default function MyQRCode() {


    return (
        <div className="qrcode-inner">
            <QRCode size={200} value={firebase.auth().currentUser.uid} /><br />
            <h5 className="text-center">Scan this QR code from class to mark the attendance</h5>
        </div>
    )
}