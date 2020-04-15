import express from "express"
import bodyParser from "body-parser"
import connection from "./connection"
const fileUpload = require('express-fileupload');
var async = require("async");
import _ from 'lodash';
const app = express();
const port = 8000;
const fs = require('fs');

app.use(function(req, res, next) {
    let oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(fileUpload());
app.listen(port, () => {
    console.log('We are live on ' + port);
});
const getDateTime =() => {
    let date_ob = new Date();

// current date
// adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

// current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
    let year = date_ob.getFullYear();

// current hours
    let hours = date_ob.getHours();

// current minutes
    let minutes = date_ob.getMinutes();

// current seconds
    let seconds = date_ob.getSeconds();

    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
};

// need to add images to this route
app.post('/addPackage', function(request, response) {
    /**
     * @param {{packageName:string}} packageName
     * @param {{packageUniqueCode:number}} packageUniqueCode
     * @param {{packageDescription:string}} packageDescription
     * @param {{packagePrice:number}} packagePrice
     * @param {{packageOwnerID:number}} packageOwnerID
     */
    let packageName = request.body.packageName;
    let packageUniqueCode = request.body.packageUniqueCode;
    let packageDescription = request.body.packageDescription;
    let packageAddedDate = getDateTime();
    // console.log(packageAddedDate)
    let packagePrice = request.body.packagePrice;
    let packageOwnerID = request.body.packageOwnerID;
    let imagesList = request.files.images;
    // console.log(imagesList)
    // imagesList[0].map( image => {
    //     // Use the mv() method to place the file somewhere on your server
    // ------------------------------------------------
    // const path = __dirname + '/uploads/' + imagesList.name
    // const path = __dirname + '/uploads/'
    // imagesList.map( el => {
    //         el.mv(path + el.name)
    // });
    // response.send('File uploaded!');
    // response.end();

    if (packageName && packageUniqueCode && packageDescription && packageAddedDate && packagePrice && packageOwnerID) {
        const path = __dirname + '/uploads/';
        const imagesData = [];
        const imagesError = [];
        async.each(imagesList, function(el, callback) {
            el.mv(path + packageAddedDate.toString() + el.name, function(err) {
                if(err) {
                    imagesError.push(packageAddedDate.toString() + el.name)
                    return callback(e);
                }
                else {
                    imagesData.push({"imageName": packageAddedDate.toString() + el.name, "location": "uploads/"+ packageAddedDate.toString() + el.name})
                    callback();
                }
            });
        }, function(err) {
            if( err ) {
              // One of the iterations produced an error.
              // All processing will now stop.
              console.log('A file failed to process');
            } else {
              console.log('All files have been processed successfully', imagesData);
              // sending data to stored procedure.
              connection.query('CALL insert_images(?,?,?,?,?,?,?)', [packageName, packageUniqueCode, packageAddedDate, packagePrice, packageDescription, packageOwnerID, JSON.stringify(imagesData)], function(error) {
                if (error) {
                    console.log("ERROR", error)
                    // some error occurred
                    if(error.code === "ER_DUP_ENTRY"){
                        response.json({"Error": true,"Message":"You have already added this package to list. Please use another unique code if you need."});
                        response.end();
                    }else{
                        response.json({"Error": true,"Message":"Something went wrong with SQL query. Please contact support."});
                        response.end();
                    }
                } else {
                    // successfully inserted into db
                    response.json({"Error": false,"Message":"Success!"});
                    response.end();
                }
              });
            }
        });
        // imagesList.map( el => {
        //     el.mv(path + packageAddedDate.toString() + el.name, function(err) {
        //         if(err) {
        //             console.log("sss")
        //             imagesError.concat([el.name])
        //         }
        //         else {
        //             console.log("ddd")
        //             // imagesData.push({"imageName": el.name, "location": "uploads/"+ el.name})
        //             imagesData.concat(["sssaa"])
        //         }
        //     });
        // });
        // sending data to stored procedure.
        // connection.query('CALL insert_images(?,?,?,?,?,?,?)', [packageName, packageUniqueCode, packageAddedDate, packagePrice, packageDescription, packageOwnerID], function(error) {
        //     if (error) {
        //         // some error occurred
        //         if(error.code === "ER_DUP_ENTRY"){
        //             response.json({"Error": true,"Message":"You have already added this package to list. Please use another unique code if you need."});
        //             response.end();
        //         }else{
        //             response.json({"Error": true,"Message":"Something went wrong with SQL query. Please contact support."});
        //             response.end();
        //         }
        //     } else {
        //         // successfully inserted into db
        //         response.json({"Error": false,"Message":"Success!"});
        //         response.end();
        //     }
        // });
        // response.send('File uploaded!');
        // response.end();
        // connection.query(`INSERT INTO packages (packageName, packageUniqueCode, packageDescription, packageAddedDate, packagePrice, packageOwnerID)VALUES(?, ?, ?, ?, ?, ?)`, [packageName, packageUniqueCode, packageDescription, packageAddedDate, packagePrice, packageOwnerID], function(error) {
        //     if (error) {
        //         // some error occurred
        //         if(error.code === "ER_DUP_ENTRY"){
        //             response.json({"Error": true,"Message":"You have already added this package to list. Please use another unique code if you need."});
        //             response.end();
        //         }else{
        //             response.json({"Error": true,"Message":"Something went wrong with SQL query. Please contact support."});
        //             response.end();
        //         }
        //     } else {
        //         // successfully inserted into db
        //         response.json({"Error": false,"Message":"Success!"});
        //         response.end();
        //     }
        // });
    } else {
        response.json({"Error": true,"Message":"Please fill all the fields."});
        response.end();
    }
});

app.post('/auth', function(request, response) {
    /**
     * @param {{email:string}} email
     * @param {{password:string}} password
     */
    let email = request.body.email;
    let password = request.body.password;

    if (email && password) {
        connection.query('SELECT * FROM users WHERE userEmail = ? AND userPassword = ?', [email, password], function(error, results) {
            if(error){
                response.json({"Error": true,"Message":"Something went wrong with SQL query. Please contact support."});
                response.end();
            }else{
                if (results.length > 0) {
                    response.json({"Error": false,"Message":"Success!"});
                } else {
                    response.json({"Error": true,"Message":"Incorrect Username and/or Password!"});
                }
                response.end();
            }
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.post('/deletePackage', function(request, response) {
    /**
     * @param {{packageID:number}} packageID
     * @param {{userID:number}} userID
     */
    let packageID = request.body.packageID;
    let packageOwnerID = request.body.packageOwnerID;
    if (packageID && packageOwnerID) {
        connection.query("DELETE FROM packages WHERE packageID = '" + packageID + "' &&  packageOwnerID = '" + packageOwnerID + "' ", function(error, results) {
            if (error) {
                response.json({"Error": false,"Message":"Something went wrong with SQL query. Please contact support!"});
                response.end();
            }
            else{
                if (results.affectedRows !== 0) {
                    // some error
                    response.json({"Error": false,"Message":"Success!"});
                    response.end();
                } else {
                    // successfully inserted into db
                    response.json({"Error": false,"Message":"Unable to delete product. Please contact support!"});
                    response.end();
                }
            }
        });
    } else {
        response.json({"Error": true,"Message":"Please fill all the fields."});
        response.end();
    }
});

app.post('/changeStatusOfProduct', function(request, response) {
    /**
     * @param {{packageID:number}} packageID
     * @param {{packageOwnerID:number}} packageOwnerID
     * @param {{newStatus:boolean}} false
     */
    let packageID = request.body.packageID;
    let packageOwnerID = request.body.packageOwnerID;
    let newStatus = request.body.newStatus;

    if (packageID && packageOwnerID && newStatus) {
        connection.query("UPDATE packages SET packageStatus = '" + newStatus + "' WHERE packageID = '" + packageID + "' &&  packageOwnerID = '" + packageOwnerID + "' ", function(error, results) {
            if (error) {
                console.log(error);
                response.json({"Error": false,"Message":"Something went wrong with SQL query. Please contact support!"});
                response.end();
            }
            else{
                if (results.affectedRows !== 0) {
                    // some error
                    response.json({"Error": false,"Message":"Success!"});
                    response.end();
                } else {
                    // successfully inserted into db
                    response.json({"Error": false,"Message":"Unable to change status. Please contact support!"});
                    response.end();
                }
            }
        });
    } else {
        response.json({"Error": true,"Message":"Please fill all the fields."});
        response.end();
    }
});

app.post('/editPackage', function(request, response) {
    /**
     * @param {{packageName:string}} packageName
     * @param {{packageUniqueCode:number}} packageUniqueCode
     * @param {{packageDescription:string}} packageDescription
     * @param {{packagePrice:number}} packagePrice
     * @param {{packageOwnerID:number}} packageOwnerID
     * @param {{packageID:number}} packageID
     * @param {{packageStatus:number}} false
     */
    let packageName = request.body.packageName;
    let packageID = request.body.packageID;
    let packageUniqueCode = request.body.packageUniqueCode;
    let packageDescription = request.body.packageDescription;
    let packagePrice = request.body.packagePrice;
    let packageOwnerID = request.body.packageOwnerID;
    let packageStatus = request.body.packageStatus;

    if (packageID && packageOwnerID && packageName && packageStatus && packageUniqueCode && "packageDescription" && packagePrice ) {
        connection.query("UPDATE packages SET packageName = '" + packageName + "', packageUniqueCode = '" + packageUniqueCode + "' , packageDescription = '" + packageDescription + "' ,packageStatus = '" + packageStatus + "', packagePrice = '" + packagePrice + "' WHERE packageID = '" + packageID + "' &&  packageOwnerID = '" + packageOwnerID + "' ", function(error, results, fields) {
            if (error) {
                console.log(error);
                response.json({"Error": false,"Message":"Something went wrong with SQL query. Please contact support!"});
                response.end();
            }
            else{
                if (results.affectedRows !== 0) {
                    // some error
                    response.json({"Error": false,"Message":"Success!"});
                    response.end();
                } else {
                    // successfully inserted into db
                    response.json({"Error": false,"Message":"Unable to update product. Please contact support!"});
                    response.end();
                }
            }
        });
    } else {
        response.json({"Error": true,"Message":"Unable to update product. Empty parameters."});
        response.end();
    }
});

// endpoint is working. Need to add profile info such as images, address, long lat, ect
app.post('/register', function(request, response) {
    /**
     * @param {{userEmail:string}} userEmail
     * @param {{userPassword:number}} userPassword
     * @param {{companyName:string}} companyName
     * @param {{telephone:number}} telephone
     */

    let userEmail = request.body.userEmail;
    let userPassword = request.body.userPassword;
    let companyName = request.body.companyName;
    let date = getDateTime();
    let telephone = request.body.telephone;

    if (userEmail && userPassword && companyName && date && telephone) {
        connection.query(`INSERT INTO users (userEmail, userPassword, companyName, registeredDate, telephone)VALUES(?, ?, ?, ?, ?)`, [userEmail , userPassword, companyName, date, telephone], function(error) {
            if (error) {
                // some error
                if(error.code === "ER_DUP_ENTRY"){
                    response.json({"Error": true,"Message":"You have already registered using this email. Please use another email address."});
                    response.end();
                }else{
                    response.json({"Error": true,"Message":"Something went wrong with SQL query. Please contact support."});
                    response.end();
                }
            } else {
                // successfully inserted into db
                response.json({"Error": false,"Message":"Success!"});
                response.end();
            }
        });
    } else {
        response.json({"Error": true,"Message":"Please fill all the fields."});
        response.end();
    }
});