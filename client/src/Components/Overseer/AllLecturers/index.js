import { useEffect } from 'react'
import { Button, Table, Input, Container } from 'reactstrap'
import axios from 'axios'
import { useState } from 'react'


const BarStyling = { width: "20rem", background: "#F2F1F9", border: "none", padding: "0.5rem" };

export default function AllLecturers() {
    const [lecturers, setLecturers] = useState([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        getAllLecturers()
    }, [])

    //Get all lecturers from database
    const getAllLecturers = () => {
        axios.post('http://localhost:5000/getlecturers')
            .then(function (response) {
                if (response.data.length > 0) {
                    setLecturers([])
                    response.data.map((v, i) => {
                        axios.post('http://localhost:5000/getnoofclasses', {
                            userid: v.userid
                        })
                            .then(function (classes) {
                                v.noOfClasses = classes.data
                                setLecturers((lecturers) => [
                                    ...lecturers,
                                    v
                                ]);
                            })
                    })
                }

            })
    }

    //Approve a lecturer account
    const approveAccount = (id) => {
        axios.post('http://localhost:5000/approveaccount', {
            accounttype: "lecturers",
            userid: id
        })
            .then(function (response) {
                if (response.data == "success") {
                    getAllLecturers()
                }
            })
    }

    //Disable or enable a lecturer account
    const disableAccount = (id, status) => {
        axios.post('http://localhost:5000/disableaccount', {
            accounttype: "lecturers",
            userid: id,
            status: status
        })
            .then(function (response) {
                if (response.data == "success") {
                    getAllLecturers()
                }
            })
    }

    return (

        <Container>
            <Input
                placeholder="Search By Registration No.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {lecturers.length > 0 ?
                <Table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Registration No</th>
                            <th>Email</th>
                            <th>Approval Status</th>
                            <th>Enabled</th>
                            <th>No Of Classes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lecturers.filter(function (el) {
                            var regNo = el.regNo
                            return regNo.includes(search)
                        }).map((v, i) => {
                            return (
                                <tr key={i}>
                                    <td>{v.firstName}</td>
                                    <td>{v.lastName}</td>
                                    <td>{v.regNo}</td>
                                    <td>{v.email}</td>
                                    <td>{v.approved ? "Approved" : <Button onClick={() => approveAccount(v.userid)} color="primary">Approve</Button>}</td>
                                    <td>{v.disabled ? <Button onClick={() => disableAccount(v.userid, 0)} color="success">Enable</Button> : <Button onClick={() => disableAccount(v.userid, 1)} color="danger">Disable</Button>}</td>
                                    <td>{v.noOfClasses}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                :
                <p>There Are No Lecturer Accounts Created Yet</p>
            }

        </Container>
    )
}