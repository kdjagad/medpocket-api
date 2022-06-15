require('dotenv').config();
const request = require('request');
const { getUserByPhone, create } = require('./user.service');

module.exports = {
    login: (req, res) => {
        const body = req.body;
        console.log("body", body)
        getUserByPhone(body, async (error, response, fields) => {
            if (error) {
                res.status(500).json({ status: 0, message: error });
            } else {
                if (response.length > 0) {
                    request(`http://msgclub.softhubinc.com/rest/otpservice/generate-otp?AUTH_KEY=${process.env.AUTH_KEY}&mobileNumber=${body.phone}`, function (error, resp, reqBody) {
                        reqBody = JSON.parse(reqBody);
                        if (reqBody.responseCode === "3001") {
                            res.status(200).json({ status: 1, message: 'success', data: response });
                        } else {
                            res.status(500).json({ status: 0, message: reqBody.response, data: null });
                        }
                    });
                } else {
                    res.status(500).json({ status: 0, message: "user not found", data: null });
                }
            }
        })
    },
    register: (req, res) => {
        const body = req.body;
        console.log("body", body)
        create(body, async (error, response, fields) => {
            if (error) {
                res.status(500).json({ status: 0, message: error });
            } else {
                if (response) {
                    res.status(200).json({ status: 1, message: 'register successfully' });
                    request(`http://msgclub.softhubinc.com/rest/otpservice/generate-otp?AUTH_KEY=${process.env.AUTH_KEY}&mobileNumber=${body.phone}`, function (error, response, reqBody) {
                        reqBody = JSON.parse(reqBody);
                        if (reqBody.responseCode == "3001") {
                            res.status(200).json({ status: 1, message: "registered successfully" });
                        } else {
                            res.status(500).json({ status: 0, message: reqBody.response });
                        }
                    });
                } else {
                    res.status(500).json({ status: 0, message: "user not registered" });
                }
            }
        })
    },
    verify: async (req, res) => {
        const body = req.body;
        console.log("body", body)
        try {

            request(`http://msgclub.softhubinc.com/rest/otpservice/verify-otp?AUTH_KEY=${process.env.AUTH_KEY}&mobileNumber=${body.phone}&otp=${body.otp}`, function (error, response, reqBody) {
                reqBody = JSON.parse(reqBody);
                if (reqBody.responseCode == 2004) {
                    res.status(200).json({ status: 1, message: reqBody.response });
                } else {
                    res.status(500).json({ status: 0, message: reqBody.response });
                }
            });
        } catch (error) {
            res.status(500).json({ status: 0, message: error });
        }
    },
}