//Made An Update

//Dependencies
const express = require("express")
const cors = require("cors")
const mysql = require("mysql")
var bodyParser = require("body-parser")
const app = express()
app.use(cors(), bodyParser.json())
const { Server } = require("socket.io")
const e = require("cors")



//Create the server
var server = app.listen(5000, () => {
    console.log("Serving on 5000");

})

//Add cors to socket io
const io = new Server(server, { cors: { origin: '*' } });

//Enter database details
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "endgame100",
    database: "attendanceapp"
})

//Connect with database
connection.connect(err => {
    if (err) {
        console.log(err, "error connecting")
    }
    else {
        console.log("connected to db")
    }
})


//Function to convert data in specific format
function formatDate(date) {
    var d = date ? new Date(date) : new Date()
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return `${day}${month}${year}`;
}


//Create a user and save details in database
app.post("/createuser", (req, res) => {
    const { userData } = req.body
    console.log(userData, "data")
    if (userData.accounttype == "Student") {
        connection.query((`INSERT INTO students(userid,firstName,lastName,rollNo,programName,email,accounttype,profilePic,approved,disabled) VALUES("${userData.userid}","${userData.firstName}","${userData.lastName}","${userData.rollNo}","${userData.programName}","${userData.email}","${userData.accounttype}","${userData.profilePic}",${userData.approved},${userData.disabled})`), (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send("success")
            }
        })
    }

    else if (userData.accounttype == "Lecturer") {
        connection.query((`INSERT INTO lecturers(userid,firstName,lastName,regNo,email,accounttype,approved,disabled) VALUES("${userData.userid}","${userData.firstName}","${userData.lastName}","${userData.regNo}","${userData.email}","${userData.accounttype}",${userData.approved},${userData.disabled})`), (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send("success")
            }
        })
    }
})


//Check If Roll No Or Registraction No Already Exists
app.post("/checkexists", (req, res) => {
    const { formData } = req.body
    if (formData.accounttype == "Student") {
        connection.query((`SELECT * from students where rollNo=${formData.rollNo}`), (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                if (results.length > 0) {
                    return res.send("Roll No Exists")
                }
                else {
                    return res.send("Not Exists")
                }
            }
        })
    }

    else if (formData.accounttype == "Lecturer") {
        connection.query((`SELECT * from lecturers where regNo=${formData.regNo}`), (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                if (results.length > 0) {
                    return res.send("Registration No Exists")
                }
                else {
                    return res.send("Not Exists")
                }
            }
        })
    }
})



//Check which type of user is logged in. Lecturer or Student
app.post("/identifyuser", (req, res) => {
    const userData = req.body
    connection.query((`SELECT * FROM lecturers WHERE userid="${userData.uid}"`), (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            if (results.length > 0) {
                return res.send(results)
            }
            else {
                connection.query((`SELECT * FROM students WHERE userid="${userData.uid}"`), (err, results) => {
                    if (err) {
                        return res.send(err)
                    }
                    else {
                        if (results.length > 0) {
                            return res.send(results)
                        }
                        else {
                            connection.query((`SELECT * FROM overseers WHERE userid="${userData.uid}"`), (err, results) => {
                                if (err) {
                                    return res.send(err)
                                }
                                else {
                                    if (results.length > 0) {
                                        return res.send(results)
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
})


//Create class and save details in database
app.post("/createclass", (req, res) => {
    var { className, subjectName, createdBy, programName, description, lecturer } = req.body.classInfo
    let sql = `INSERT INTO classes(className,subjectName,createdBy,programName,description,lecturer) VALUES(?,?,?,?,?,?)`
    let sqlData = [className, subjectName, createdBy, programName, description, lecturer]

    connection.query(sql, sqlData, (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send("success")
        }
    })
})


//Get all classes from database for lecturer or student or overseer
app.post("/getallclasses", (req, res) => {

    var { uid, accounttype, programName } = req.body


    if (accounttype == "student") {
        connection.query((`SELECT * FROM classes WHERE programName="${programName}"`), (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                if (results.length > 0) {
                    return res.send(results)
                }
            }
        })
    }
    else if (accounttype == "lecturer") {
        connection.query((`SELECT * FROM classes WHERE createdBy="${uid}"`), (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                if (results.length > 0) {
                    return res.send(results)
                }
            }
        })
    }

    else if (accounttype == "overseer") {
        connection.query((`SELECT * FROM classes`), (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                if (results.length > 0) {
                    return res.send(results)
                }
            }
        })
    }
})



//Get a specific class
app.post("/getaclass", (req, res) => {

    var { classID } = req.body

    connection.query((`SELECT * FROM classes WHERE classID="${classID}"`), (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            if (results.length > 0) {
                return res.send(results)
            }
        }
    })
})

//check if a user exists or not
app.post("/checkuser", (req, res) => {
    var { accounttype, email } = req.body
    connection.query((`SELECT * FROM ${accounttype} WHERE email="${email}"`), (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            if (results.length > 0) {
                if (accounttype == "overseers") {
                    return res.send("exists")
                }
                else if (results[0].approved) {
                    if (results[0].disabled) {
                        return res.send("disabled")
                    }
                    else {
                        return res.send("exists")
                    }
                }
                else {
                    return res.send("Not Approved")
                }
            }
            else {
                res.send("not exists")
            }
        }
    })
})


//Add a message to class
app.post("/addclassmessage", (req, res) => {
    var { message, classID } = req.body
    let sql = `INSERT INTO classmessages(message,classID) VALUES(?,?)`
    let sqlData = [message, classID]
    connection.query(sql, sqlData, (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send("success")
        }
    })
})


//Get all messages of a specific class
app.post("/getallclassmessages", (req, res) => {

    var { classID } = req.body

    connection.query((`SELECT * FROM classmessages WHERE classID="${classID}"`), (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            if (results.length > 0) {
                return res.send(results)
            }
        }
    })
})


//Mark attendance of the given date
app.post("/markattendance", (req, res) => {
    var { classID, studentName, rollNo, userID,lecturer } = req.body
    var tableName = "table" + classID + formatDate()
    connection.query((`CREATE TABLE IF NOT EXISTS ${tableName}(
        userID varchar(50) NOT NULL,
        serialNo int NOT NULL auto_increment,
        studentName varchar(250) NOT NULL,
        rollNo varchar(50) NOT NULL ,
        timeStamp varchar(100) NOT NULL,
        lecturer varchar(250) NOT NULL,
        primary key(serialNo)
        )`), (err, results) => {
    })

    let sql = `INSERT INTO ${tableName} (studentName, rollNo,userID,timeStamp,lecturer)
        SELECT * FROM (SELECT ?,?,?,?,?) AS tmp
        WHERE NOT EXISTS (
            SELECT userID FROM ${tableName} WHERE userID = ${userID}
        ) LIMIT 1;`
    let sqlData = [studentName, rollNo, userID, new Date(),lecturer]
    connection.query(sql, sqlData, (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send("success")
        }
    })
})


//Check if the attendance of given date exists
app.post("/checkattendance", (req, res) => {

    var { userID, classID } = req.body
    var tableName = "table" + classID + formatDate()

    connection.query((`SHOW TABLES LIKE '${tableName}'`), (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            if (results.length > 0) {
                connection.query((`SELECT userID from ${tableName} WHERE userID='${userID}'`), (err, results) => {
                    if (err) {
                        return res.send(err)
                    }
                    else {
                        if (results.length > 0) {
                            return res.send("exists")
                        }
                        else {
                            return res.send("not exists")
                        }
                    }

                })
            }
            else {
                return res.send("not exists")
            }
        }
    })
})



//Get the attendance of the given date.
app.post("/getattendance", (req, res) => {

    var { classID, date } = req.body
    var tableName = "table" + classID + date
    console.log(classID, date, "date")

    connection.query((`SELECT * FROM ${tableName}`), (err, results) => {
        if (err) {
            return res.send(err.code)
        }
        else {
            if (results.length > 0) {
                return res.send(results)
            }
            else {
                res.send("ER_NO_SUCH_TABLE")
            }
        }
    })
})


//Get all messages from database of the given program
app.post("/getmessages", (req, res) => {

    var { programName } = req.body
    connection.query((`SELECT * FROM chat WHERE programName='${programName}'`), (err, results) => {
        if (err) {
            return res.send(err.code)
        }
        else {
            return res.send(results)
        }
    })
})


//Get all lecturers from database for overseer
app.post("/getlecturers", (req, res) => {
    connection.query((`SELECT * FROM lecturers`), (err, results) => {
        if (err) {
            return res.send(err.code)
        }
        else {
            if (results.length > 0) {
                return res.send(results)
            }
        }
    })
})

//Get all students from database for overseer
app.post("/getstudents", (req, res) => {
    connection.query((`SELECT * FROM students`), (err, results) => {
        if (err) {
            return res.send(err.code)
        }
        else {
            if (results.length > 0) {
                return res.send(results)
            }
        }
    })
})


//Ger no of classes a lecturer has made
app.post("/getnoofclasses", (req, res) => {
    var { userid } = req.body
    connection.query((`SELECT * FROM classes where createdBy='${userid}'`), (err, results) => {
        if (err) {
            return res.send(err.code)
        }
        else {
            return res.send(`${results.length}`)
        }
    })
})


//Approve a student or lecturer account
app.post("/approveaccount", (req, res) => {
    var { accounttype, userid } = req.body
    connection.query((`UPDATE ${accounttype} SET approved=1 where userid='${userid}'`), (err, results) => {
        if (err) {
            return res.send(err.code)
        }
        else {
            return res.send(`success`)
        }
    })
})


//Disable or enable a student or lecturer account
app.post("/disableaccount", (req, res) => {
    var { accounttype, userid, status } = req.body
    connection.query((`UPDATE ${accounttype} SET disabled=${status} where userid='${userid}'`), (err, results) => {
        if (err) {
            return res.send(err.code)
        }
        else {
            return res.send(`success`)
        }
    })
})


//Send alert to lecturer and students
app.post("/sendalert", (req, res) => {
    var { title, description, alertFor } = req.body
    var timeStamp = new Date()
    console.log(timeStamp, "time")
    let sql = `INSERT INTO alerts(title,description,alertFor,timeStamp) VALUES(?,?,?,?)`
    let sqlData = [title, description, alertFor, timeStamp]
    connection.query(sql, sqlData, (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send("success")
        }
    })
})


//Get alerts from database
app.post("/getalerts", (req, res) => {
    var { accounttype } = req.body
    connection.query((`SELECT * FROM alerts where alertFor='${accounttype}' OR alertFor="Both"`), (err, results) => {
        if (err) {
            return res.send(err.code)
        }
        else {
            return res.send(results)
        }
    })
})


//Send a leave request from lecturer
app.post("/applyforlecturerleave", (req, res) => {
    var { title, description, lecturer, lecturerName, startDate, endDate } = req.body.leaveInfo
    let sql = `INSERT INTO lecturerleaves(title,description,lecturer,lecturerName,startDate,endDate,approved) VALUES(?,?,?,?,?,?,?)`
    let sqlData = [title, description, lecturer, lecturerName, startDate, endDate, 0]

    connection.query(sql, sqlData, (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send("success")
        }
    })
})


//Get all lecturer leave requests
app.post("/getlecturerleaves", (req, res) => {
    var { userid } = req.body

    let sql;

    if (userid) {
        sql = `SELECT * FROM lecturerleaves where lecturer='${userid}'`
    }
    else {
        sql = `SELECT * FROM lecturerleaves`
    }

    connection.query(sql, (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            if (results.length > 0) {
                return res.send(results)
            }
        }
    })
})


//Send a request to change attendance for a specific date and class
app.post("/changeattendancerequest", (req, res) => {
    var { title, description, student, studentName, classId, date, medicalCert, className, rollNo } = req.body.requestInfo
    let sql = `INSERT INTO attendancerequest(title,description,student,studentName,date,classId,approved,medicalCert,className,rollNo) VALUES(?,?,?,?,?,?,?,?,?,?)`
    let sqlData = [title, description, student, studentName, date, classId, 0, medicalCert, className, rollNo]

    connection.query(sql, sqlData, (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            return res.send("success")
        }
    })
})


//Get all attendance change requests
app.post("/getattendancerequests", (req, res) => {
    var { userid } = req.body

    let sql;

    if (userid) {
        sql = `SELECT * FROM attendancerequest where student='${userid}'`
    }
    else {
        sql = `SELECT * FROM attendancerequest`
    }

    connection.query(sql, (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            if (results.length > 0) {
                return res.send(results)
            }
        }
    })
})


//Approve lecturer leave request
app.post("/approvelecturerrequest", (req, res) => {
    var { leaveId } = req.body
    connection.query((`UPDATE lecturerleaves SET approved=1 where leaveId='${leaveId}'`), (err, results) => {
        if (err) {
            return res.send(err.code)
        }
        else {
            return res.send(`success`)
        }
    })
})


//Approve student attendance request and mark attendance
app.post("/approveattendancerequest", (req, res) => {
    var { classID, studentName, rollNo, userID, requestID,lecturer,date } = req.body
    var tableName = "table" + classID + formatDate(date)
    connection.query((`CREATE TABLE IF NOT EXISTS ${tableName}(
        userID varchar(50) NOT NULL,
        serialNo int NOT NULL auto_increment,
        studentName varchar(250) NOT NULL,
        rollNo varchar(50) NOT NULL ,
        timeStamp varchar(100) NOT NULL,
        lecturer varchar(250) NOT NULL,
        primary key(serialNo)
        )`), (err, results) => {
    })

    let sql = `INSERT INTO ${tableName} (studentName, rollNo,userID,timeStamp,lecturer)
        SELECT * FROM (SELECT ?,?,?,?,?) AS tmp
        WHERE NOT EXISTS (
            SELECT userID FROM ${tableName} WHERE userID = ${userID}
        ) LIMIT 1;`
    let sqlData = [studentName, rollNo, userID, new Date(),lecturer]
    connection.query(sql, sqlData, (err, results) => {
        if (err) {
            return res.send(err)
        }
        else {
            connection.query((`UPDATE attendancerequest SET approved=1 where requestID='${requestID}'`), (err, results) => {
                if (err) {
                    return res.send(err.code)
                }
                else {
                    return res.send(`success`)
                }
            })
        }
    })

})












//Socket IO setup for chat
io.on('connect', (socket) => {

    //If a send message signal is received, send it to all who have joined the room and also save it in database
    socket.on('sendMessage', (message, callback) => {
        var { programName, message, senderid, timeStamp, userName } = message
        let sql = `INSERT INTO chat(senderid,programName,message,timeStamp,userName) VALUES(?,?,?,?,?)`
        let sqlData = [senderid, programName, message, timeStamp, userName]
        connection.query(sql, sqlData, (err, results) => {
            if (err) {
                io.to(programName).emit('new_message', err);
            }
            else {
                io.to(programName).emit('new_message', { programName, message, senderid, timeStamp, userName });
            }
        })
        callback();
    });

    //Join the room
    socket.on('join', ({ room }, callback) => {
        socket.join(room);
        callback();
    });

});






