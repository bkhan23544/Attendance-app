import { combineReducers } from 'redux';

//redux reducer to save user details in redux state
const setCurrentUser = (state = {}, action) => {
    switch (action.type) {
        case 'SETUSER':
            return action.data
        default:
            return state
    }
}

//redux reducer to save class details in redux state
const setCurrentClass = (state = {}, action) => {
    switch (action.type) {
        case 'SETCLASS':
            return action.data
        default:
            return state
    }
}


//Combine all reducers into one.
const rootReducer = combineReducers({
    setCurrentUser: setCurrentUser,
    setCurrentClass: setCurrentClass
})

export default rootReducer