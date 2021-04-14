import "./styles.scss"
import { useSelector } from 'react-redux'


export default function Profile() {
    const user = useSelector(state => state.setCurrentUser)


    return (
        <div className="profile-inner">
            <div>
                <center>
                    <img src={user.profilePic} className="profile-pic mb-3" />
                </center>
                <p><b>Name:</b> {user.firstName} {user.lastName}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Roll No:</b> {user.rollNo}</p>
                <p><b>Department: </b>{user.programName}</p>
            </div>
        </div>
    )
}