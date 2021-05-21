import { useEffect } from 'react'
import { Button, Table, Input, Container } from 'reactstrap'
import axios from 'axios'
import { useState } from 'react'


const BarStyling = { width: "20rem", background: "#F2F1F9", border: "none", padding: "0.5rem" };

export default function AllStudents() {
    const [students, setStudents] = useState([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        getAllStudents()
    }, [])

    //Get all students from database
    const getAllStudents = () => {
        axios.get('http://localhost:5000/getstudents')
            .then(function (response) {
                if (response.data.length > 0) {
                    console.log(response,"response")
                    setStudents(response.data)
                }

            })
    }

    //Approve a student account
    const approveAccount = (id) => {
        axios.post('http://localhost:5000/approveaccount', {
            accounttype: "students",
            userid: id
        })
            .then(function (response) {
                if (response.data == "success") {
                    getAllStudents()
                }
            })
    }

    //Disable or enable a student account
    const disableAccount = (id, status) => {
        axios.post('http://localhost:5000/disableaccount', {
            accounttype: "students",
            userid: id,
            status: status
        })
            .then(function (response) {
                if (response.data == "success") {
                    getAllStudents()
                }
            })
    }

    return (

        <Container>
            <Input
                placeholder="Search By Roll No.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {students.length > 0 ?
                <Table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Roll No</th>
                            <th>Programme</th>
                            <th>Email</th>
                            <th>Approval Status</th>
                            <th>Enabled</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.filter(function (el) {
                            var rollNo = el.rollNo
                            return rollNo.includes(search)
                        }).map((v, i) => {
                            return (
                                <tr key={i}>
                                    <td>{v.firstName}</td>
                                    <td>{v.lastName}</td>
                                    <td>{v.rollNo}</td>
                                    <td>{v.programName}</td>
                                    <td>{v.email}</td>
                                    <td>{v.approved ? "Approved" : <Button onClick={() => approveAccount(v.userid)} color="warning">Approve</Button>}</td>
                                    <td>{v.disabled ? <Button onClick={() => disableAccount(v.userid, 0)} color="success">Enable</Button> : <Button onClick={() => disableAccount(v.userid, 1)} color="danger">Disable</Button>}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                :
                <p>There Are No Student Accounts Created Yet</p>
            }

        </Container>
    )
}