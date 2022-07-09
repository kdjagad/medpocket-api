require('dotenv').config();
const request = require('request');
const jwt = require('jsonwebtoken');
const { getUserByPhone, create, getUserById, updateUserById } = require('./user.service');
const { restart } = require('nodemon');
const { response } = require('express');

module.exports = {
    login: (req, res) => {
        const body = req.body;
        getUserByPhone(body, async (error, response, fields) => {
            response = JSON.parse(JSON.stringify(response));
            if (error) {
                res.status(500).json({ status: 0, message: error });
            } else {
                console.log("response", response)
                if (response.length > 0) {
                    request(`http://msgclub.softhubinc.com/rest/otpservice/generate-otp?AUTH_KEY=${process.env.AUTH_KEY}&mobileNumber=${body.phone}`, function (error, resp, reqBody) {
                        reqBody = JSON.parse(reqBody);
                        if (reqBody.responseCode === "3001") {
                            jwt.sign(response[0], process.env.JWT_SECRET, (err, token) => {
                                res.status(200).json({ status: 1, message: 'success', data: response, token: token });
                            })
                        } else {
                            res.status(500).json({ status: 0, message: reqBody.response, data: null, token: null });
                        }
                    });
                } else {
                    res.status(500).json({ status: 0, message: "user not found", data: null, token: null });
                }
            }
        })
    },
    register: (req, res) => {
        const body = req.body;
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
    getProfile: async (req, res) => {
        try {
            getUserById(req.user.id, async (error, response, fields) => {
                response = JSON.parse(JSON.stringify(response));
                res.status(200).json({ status: 1, message: 'success', data: response });
            });
        } catch (error) {
            res.status(500).json({ status: 0, message: error });
        }
    },
    updateProfile: async (req, res) => {
        const body = req.body;
        try {
            updateUserById(body, req.user.id, async (error, response, fields) => {
                if (error) {
                    res.status(200).json({ status: 0, message: 'fail', data: null });
                } else {
                    getUserById(req.user.id, async (error, response, fields) => {
                        response = JSON.parse(JSON.stringify(response));
                        res.status(200).json({ status: 1, message: 'success', data: response });
                    });
                }
            });
        } catch (error) {
            res.status(500).json({ status: 0, message: error });
        }
    },
}