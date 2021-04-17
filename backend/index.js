//Dependencies
const express = require("express")
const cors = require("cors")
const mysql = require("mysql")
var bodyParser = require("body-parser")
const app = express()
app.use(cors(),bodyParser.json())
const {Server} = require("socket.io")
const e = require("cors")



//Create the server
var server = app.listen(5000, () => {
    console.log("Serving on 5000");
   
})

//Add cors to socket io
const io = new Server(server, { cors: { origin: '*' } });

//Enter database details
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"bilalkhan",
    database:"attendanceapp"
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
function formatDate() {
    var d = new Date(),
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
app.post("/createuser",(req,res)=>{
    const {userData} = req.body
    if(userData.accounttype=="Student"){
        connection.query((`INSERT INTO students(userid,firstName,lastName,rollNo,programName,email,accounttype,profilePic) VALUES("${userData.userid}","${userData.firstName}","${userData.lastName}","${userData.rollNo}","${userData.programName}","${userData.email}","${userData.accounttype}","${userData.profilePic}")`),(err,results)=>{
            if(err){
                return res.send(err)
            }
            else{
                return res.send("success")
            }
        })
    }

   else if(userData.accounttype=="Lecturer"){
        connection.query((`INSERT INTO lecturers(userid,firstName,lastName,regNo,email,accounttype) VALUES("${userData.userid}","${userData.firstName}","${userData.lastName}","${userData.regNo}","${userData.email}","${userData.accounttype}")`),(err,results)=>{
            if(err){
                return res.send(err)
            }
            else{
                return res.send("success")
            }
        })
    }
})


//Check If Roll No Or Registraction No Already Exists
app.post("/checkexists",(req,res)=>{
    const {formData} = req.body
    if(formData.accounttype=="Student"){
        connection.query((`SELECT * from students where rollNo=${formData.rollNo}`),(err,results)=>{
            if(err){
                return res.send(err)
            }
            else{
                if(results.length>0){
                return res.send("Roll No Exists")
            }
            else{
                return res.send("Not Exists")
            }
            }
        })
    }

   else if(formData.accounttype=="Lecturer"){
    connection.query((`SELECT * from lecturers where regNo=${formData.regNo}`),(err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            if(results.length>0){
            return res.send("Registration No Exists")
        }
        else{
            return res.send("Not Exists")
        }
        }
    })
    }
})



//Check which type of user is logged in. Lecturer or Student
app.post("/identifyuser",(req,res)=>{
    const userData = req.body
    connection.query((`SELECT * FROM lecturers WHERE userid="${userData.uid}"`),(err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            if(results.length>0){
                return res.send(results)
        }
        else{
            connection.query((`SELECT * FROM students WHERE userid="${userData.uid}"`),(err,results)=>{
                if(err){
                    return res.send(err)
                }
                else{
                    if(results.length>0){
                        return res.send(results)
                    }
                }
            })
        }
        }
    })
})


//Create class and save details in database
app.post("/createclass",(req,res)=>{
    var {className,subjectName,createdBy,programName,description,lecturer} = req.body.classInfo
    let sql = `INSERT INTO classes(className,subjectName,createdBy,programName,description,lecturer) VALUES(?,?,?,?,?,?)`
    let sqlData = [className,subjectName,createdBy,programName,description,lecturer]

    connection.query(sql, sqlData,(err,results)=>{
             if(err){
            return res.send(err)
        }
        else{
            return res.send("success")
        }
    })
})


//Get all classes from database for lecturer or student
app.post("/getallclasses",(req,res)=>{

    var {uid,accounttype,programName} = req.body


    if(accounttype=="student"){
        connection.query((`SELECT * FROM classes WHERE programName="${programName}"`),(err,results)=>{
            if(err){
                return res.send(err)
            }
            else{
                if(results.length>0){
                    return res.send(results)
            }
        }
        })
    }
    else if(accounttype=="lecturer"){
    connection.query((`SELECT * FROM classes WHERE createdBy="${uid}"`),(err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            if(results.length>0){
                return res.send(results)
        }
    }
    })
}
})


//check if a user exists or not
app.post("/checkuser",(req,res)=>{
    var {accounttype,email} = req.body
    connection.query((`SELECT * FROM ${accounttype} WHERE email="${email}"`),(err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            if(results.length>0){
                return res.send("exists")
        }
        else{
            res.send("not exists")
        }
    }
    })
})


//Add a message to class
app.post("/addclassmessage",(req,res)=>{
    var {message,classID} = req.body
    let sql = `INSERT INTO classmessages(message,classID) VALUES(?,?)`
    let sqlData = [message,classID]
    connection.query(sql, sqlData,(err,results)=>{
        if(err){
       return res.send(err)
   }
   else{
       return res.send("success")
   }
})
})


//Get messages of a specific class
app.post("/getallclassmessages",(req,res)=>{

    var {classID} = req.body

    connection.query((`SELECT * FROM classmessages WHERE classID="${classID}"`),(err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            if(results.length>0){
                return res.send(results)
        }
    }
    })
})


//Mark attendance of the given date
app.post("/markattendance",(req,res)=>{
    var {classID,studentName,rollNo,userID} = req.body
    var tableName = "table"+classID+formatDate()
    connection.query((`CREATE TABLE IF NOT EXISTS ${tableName}(
        userID varchar(50) NOT NULL,
        serialNo int NOT NULL auto_increment,
        studentName varchar(250) NOT NULL,
        rollNo varchar(50) NOT NULL ,
        timeStamp varchar(100) NOT NULL,
        primary key(serialNo)
        )`),(err,results)=>{
        })

        let sql = `INSERT INTO ${tableName} (studentName, rollNo,userID,timeStamp)
        SELECT * FROM (SELECT ?,?,?,?) AS tmp
        WHERE NOT EXISTS (
            SELECT userID FROM ${tableName} WHERE userID = ${userID}
        ) LIMIT 1;`
        let sqlData = [studentName,rollNo,userID,new Date()]
        connection.query(sql, sqlData,(err,results)=>{
            if(err){
           return res.send(err)
       }
       else{
           return res.send("success")
       }
    })
})


//Check if the attendance of given date exists
app.post("/checkattendance",(req,res)=>{

    var {userID,classID} = req.body
    var tableName = "table"+classID+formatDate()

    connection.query((`SHOW TABLES LIKE '${tableName}'`),(err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            if(results.length>0){
                connection.query((`SELECT userID from ${tableName} WHERE userID='${userID}'`),(err,results)=>{
                    if(err){
                        return res.send(err)
                    }
                    else{
                        if(results.length>0){
                            return res.send("exists")
                        }  
                        else{
                            return res.send("not exists")
                        }
                    }    

                })
        }
        else{
            return res.send("not exists")
        }
    }
    })
})



//Get the attendance of the given date.
app.post("/getattendance",(req,res)=>{

    var {classID,date} = req.body
    var tableName = "table"+classID+date
    console.log(classID,date,"date")

    connection.query((`SELECT * FROM ${tableName}`),(err,results)=>{
        if(err){
            return res.send(err.code)
        }
        else{
            if(results.length>0){
                return res.send(results)
        }
        else{
           res.send("ER_NO_SUCH_TABLE") 
        }
    }
    })
})


//Get all messages from database of the given program
app.post("/getmessages",(req,res)=>{

    var {programName} = req.body

    connection.query((`SELECT * FROM chat WHERE programName='${programName}'`),(err,results)=>{
        if(err){
            return res.send(err.code)
        }
        else{
                return res.send(results)
    }
    })
})

//Socket IO setup for chat
io.on('connect', (socket) => {
    
    //If a send message signal is received, send it to all who have joined the room and also save it in database
    socket.on('sendMessage', (message, callback) => {
        var {programName,message,senderid,timeStamp,userName} = message
        let sql = `INSERT INTO chat(senderid,programName,message,timeStamp,userName) VALUES(?,?,?,?,?)`
        let sqlData = [senderid,programName,message,timeStamp,userName]
        connection.query(sql, sqlData,(err,results)=>{
            if(err){
                io.to(programName).emit('new_message', err);
       }
       else{
        io.to(programName).emit('new_message', {programName,message,senderid,timeStamp,userName});
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
  





