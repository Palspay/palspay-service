const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

exports.sendSMS = (mobile, body) => {
    client.messages
        .create({
            body: body,
            to: mobile, // Text this number
            // from: "+16073502888" // From a valid Twilio number
            messagingServiceSid: "MGf329612292f075b34d7ee77d115e8389"
        })
        .then((message) => console.log(message.sid))
        .catch((err) => console.log(err));
};