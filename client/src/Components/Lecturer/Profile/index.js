import "./styles.scss"
import { useSelector } from 'react-redux'


export default function Profile() {
    //get user info from redux store
    const user = useSelector(state => state.setCurrentUser)


    return (
        <div className="profileRoot">
            <div className="profile-inner">
                <center>
                    <img src={user.profilePic} className="profile-pic mb-3" />
                </center>
                <p><b>Name:</b> {user.firstName} {user.lastName}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Registration No:</b> {user.regNo}</p>
            </div>
        </div>
    )
}