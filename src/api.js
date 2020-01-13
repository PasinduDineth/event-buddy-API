import express from "express"
import bodyParser from "body-parser"
import connection from "./connection"
const app = express();
const port = 8000;


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
    let packagePrice = request.body.packagePrice;
    let packageOwnerID = request.body.packageOwnerID;
    if (packageName && packageUniqueCode && packageDescription && packageAddedDate && packagePrice && packageOwnerID) {
        connection.query(`INSERT INTO packages (packageName, packageUniqueCode, packageDescription, packageAddedDate, packagePrice, packageOwnerID)VALUES(?, ?, ?, ?, ?, ?)`, [packageName, packageUniqueCode, packageDescription, packageAddedDate, packagePrice, packageOwnerID], function(error) {
            if (error) {
                // some error occurred
                if(error.code === "ER_DUP_ENTRY"){
                    response.json({"Error": true,"Message":"You have already added this product to list. Please use another name if you need."});
                    response.end();
                }else{
                    response.json({"Error": true,"Message":"Something went wrong with SQL queary. Please contact support."});
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
