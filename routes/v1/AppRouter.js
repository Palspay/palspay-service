var express = require('express');
const auth = require('../../controllers/AuthController');
const middleware = require('../../middleware/userAuth');
const fs = require("fs");
const path = require("path");
var router = express.Router()

//---------------------------------------Auth CONTROLLER------------------------------------------------------
router.post('/signUp', auth.registration);
router.post('/signIn', auth.signIn);

//-------------------------- monitor logs --------------------------
router.get("/logs/:date?", function(req, res) {
    // Today's  Date of Server based on location of server
    let date = new Date();
    // Convert to IST date
    let intlDateObj = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
    });
    let istTime = intlDateObj.format(date);
    // Eg. output : Fri Jul 23 2021 23:41:50 GMT-0800 (Alaska Daylight Time)
    // now try to format the converted date
    const newDate = new Date(istTime);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    if (month.toString().length < 2) month = "0" + month;
    if (day.toString().length < 2) day = "0" + day;
    const today = year + "-" + month + "-" + day;
    let filePath = path.join(process.cwd(), `logs/app-${today}.log`);
    if (req.params.date !== undefined) {
        filePath = path.join(process.cwd(), `logs/app-${req.params.date}.log`);
    }
    if (fs.existsSync(filePath)) {
        // handle if requested for downalod log.
        const { d } = req.query;
        if (d !== undefined && d === "true") {
            const data = fs.readFileSync(filePath);
            return res.send(data);
        }
        res.sendFile(filePath, function(err) {
            if (err) {
                res.send("Invalid log file. Or No logs found.");
            }
        });
    } else {
        return res.send("No logs found.");
    }
});

module.exports = router