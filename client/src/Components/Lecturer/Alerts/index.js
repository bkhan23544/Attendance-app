import { useEffect, useState } from "react"
import axios from 'axios'
import { Container } from 'reactstrap'
import "./styles.scss"


export default function Alerts(props) {

    const [alerts, setAlerts] = useState([])
    let componentMounted = true


    //Get all alerts from database
    useEffect(() => {
        axios.post('http://localhost:5000/getalerts', {
            accounttype: "Lecturers"
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
                        <div key={i} className="alert-inner">
                            <p className="text-secondary">{v.timeStamp.slice(0, 10)}</p>
                            <h3 className="text-left">{v.title}</h3>
                            <p>{v.description}</p>
                        </div>
                    )
                })
                }
            </Container>
            :
            <div className="w-100 text-center">
                <h4>There are no Alerts yet</h4>
            </div>
        }
        </>
    )
}