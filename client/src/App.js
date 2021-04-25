import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import Home from './Components/Home'
import SignInAsStudent from './Components/SignIn/SignInAsStudent'
import SignInAsLecturer from './Components/SignIn/SignInAsLecturer'
import SignInAsOverseer from './Components/SignIn/SignInAsOverseer'
import ForgotPassword from './Components/ForgotPassword'
import SignUp from './Components/Signup'
import LecturerDashboard from './Components/Lecturer/Dashboard'
import StudentDashboard from './Components/Student/Dashboard'
import OverseerDashboard from './Components/Overseer/Dashboard'
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux'
import store from './redux'



//Route to prevent users from accessing without logging in
function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
    />
  )
}




function App(props) {
  const [studentAuthed, setStudentAuthed] = useState(false)
  const [lecturerAuthed, setLecturerAuthed] = useState(false)
  const [overseerAuthed, setOverseerAuthed] = useState(false)
  const history = useHistory()



  return (
    <Router history={history}>
      <Switch>
        <Provider store={store}>
            <Route exact path="/">
            <Home setStudentAuthTrue={() => setStudentAuthed(true)} setLecturerAuthTrue={() => setLecturerAuthed(true)} setOverseerAuthTrue={() => setOverseerAuthed(true)} />
          </Route>
          <Route exact path="/signinasstudent">
            <SignInAsStudent />
          </Route>
          <Route exact path="/signinaslecturer">
            <SignInAsLecturer />
          </Route>
          <Route exact path="/signinasoverseer">
            <SignInAsOverseer />
          </Route>
          <Route exact path="/forgotpassword">
            <ForgotPassword />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <PrivateRoute authed={lecturerAuthed} path='/lecturerdashboard' component={LecturerDashboard} />
          <PrivateRoute authed={studentAuthed} path='/studentdashboard' component={StudentDashboard} />
          <PrivateRoute authed={overseerAuthed} path='/overseerdashboard' component={OverseerDashboard} />
        </Provider>
      </Switch>
    </Router>
  );
}

export default App;
