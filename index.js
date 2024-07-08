//------------- require packages -------------------------->
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const methodOverride = require("method-override");

//------------- creating server -------------------------->
const app = express();

//------------- after installing express for templating -------------------------->
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//----------- connection to DB; CONNECTION OBJECT BUILD HO GAYA -------------->
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "delta_app",
    password: "MYSQLniks@705",
});

//----------- random generator function returns an array. array me direct vals no keys present ------------->
let getRandomUser = () =>{
    return [
      faker.datatype.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
};

//--------------------------- making ROUTES -------------------------->

//--------------// 1. HOME: get to show total no. of users on app //--------------// 

app.get("/", (req, res) => {  
    let q = `SELECT count(*) FROM user`;      //this sql command returns total no. of users in table. 

    // jab / pe get request aaye tab total no. of users prints ho
    //-------------- 5. passing query to get count from user table & print it ----------------------------->
    try{
        connection.query(q, (err, result) => {
            if(err) throw err;

            let count = result[0]["count(*)"];

            res.render("home.ejs", {count}); 
        });
    } catch(err){
        console.log(err);
        res.send("Some error in DB");
    }
});

//--------// 2. SHOW: fetch & show user id, name and email of all users //---------// 
app.get("/user", (req, res)=>{
    let q = `SELECT * FROM user`;

    try{
        connection.query(q, (err, users) => {

            if(err) throw err;
            res.render("showusers.ejs", {users});

        });
    } catch(err){
        console.log(err);
        res.send("Some error in DB");
    }

});

//--------// 3. EDIT: form opens based on id when correct pass is entered. //---------// 

app.get("/user/:id/edit", (req, res)=>{
    
    let {id} = req.params;

    //now to search that user based on id
    //why id in quotes? as id is string and not int, we hv to pass it in ' '
    let q = `SELECT * FROM user WHERE id='${id}'`;

    try{
        connection.query(q, (err, result) => {

            if(err) throw err;
            //id nikalne ke liye array ka 0th part:
            let user = result[0];
            res.render("editform.ejs", {user});

        });
    } catch(err){
        console.log(err);
        res.send("Some error in DB");
    }

});

//--------// 4. UPDATE FORM into DB //---------//  
// !! NESTED QUERY USED !!

app.use(methodOverride("_method"));
//form se data jo aega use parse karna padega
app.use(express.urlencoded({extended: true}));

app.patch("/user/:id", (req, res)=>{
    let {id} = req.params;
    let {password: formPass, username: newUsername} = req.body; 
    //jo data dhunda uskehi variables ko naya val assign kia by making prev variables as an object.  
    let q = `SELECT * FROM user WHERE id='${id}'`;

    try{
        connection.query(q, (err, result) => {

            if(err) throw err;
            //id nikalne ke liye array ka 0th part:
            let user = result[0];

            if(formPass != user.password){
                res.send("wrong password");
            }else{
                //query to update username. 
                let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
                connection.query(q2, (err, result) =>{
                    if(err) throw err;
                    res.redirect("/user");
                });
            }
        
        });
    } catch(err){
        console.log(err);
        res.send("Some error in DB");
    }
});


//------------- START server -------------------------->
app.listen("8080", ()=>{
    console.log("server is listening to port 8080");
});






















//connection.end();
//console.log(getRandomUser());



// NO NEED OF BELOW PART AS DB is ALREADY CREATED:

//------------- 4. passing query & pushing vals to data array --------------------->

// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// let data = [] ;
// for(let i=1; i<=100; i++){ //calling fn a 100 times
//     data.push(getRandomUser()); //pushing those fake vals into data array. 
// }