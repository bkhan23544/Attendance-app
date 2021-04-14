
//redux action to save user details in redux state
const setCurrentUser = (data) => {
    return {
        type: 'SETUSER',
        data: data
    }
}

//redux action to save class details in redux state
const setCurrentClass = (data) => {
    return {
        type: 'SETCLASS',
        data: data
    }
}


export { setCurrentUser, setCurrentClass }