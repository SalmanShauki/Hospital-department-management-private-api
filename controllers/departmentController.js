
const http = require('http');
const Logger = require('../utilities/Logger');
const utils = require('../utilities/utils');

const DepartmentModel = require('../models/DepartmentModel');

module.exports.controller = (app) => {

    app.get('/api/departments', (req, res) => {
        Logger.log('info', `Fetching the departments list.`);
        DepartmentModel.findAllByQuery({}, (err, departmentsListData) => {
            if (err) {
                Logger.log('error', `Error in fetching the departments list, err is: ${err}.`);
                res.setHeader('Response-Description', err.error);
                res.statusCode = err.code;
                res.end();
            }
            else {
                Logger.log('info', `Success in fetching the departments, total departments are: ${departmentsListData.length}.`);
                res.statusCode = 200;
                res.json(departmentsListData);
            }
        })

    });

    app.get('/api/department/:departmentid', (req, res) => {
        if (req.params.departmentid == '' || req.params.departmentid == null || req.params.departmentid == undefined) {
            Logger.log('error', `Department id is required.`);
            res.setHeader('Response-Description', 'Department id is required.');
            res.statusCode = 400;
            res.end();
        }
        else {
            const departmentid = req.params.departmentid;

            Logger.log('info', `Fetching a department with id: ${departmentid}.`);
            DepartmentModel.findOneByQuery({
                departmentid: departmentid
            }, (err, departmentListData) => {
                if (err) {
                    Logger.log('error', `Error in fetching a department with id: ${departmentid}, err is: ${err}.`);
                    res.setHeader('Response-Description', err.error);
                    res.statusCode = err.code;
                    res.end();
                }
                else {
                    Logger.log('info', `Success in fetching the department with id: ${departmentid}.`);
                    res.statusCode = 200;
                    res.json(departmentListData);
                }
            })
        }
    });

    app.post('/api/department', (req, res) => {
        if (req.body.name == '' || req.body.name == null || req.body.name == undefined) {
            Logger.log('error', `Department name is required.`);
            res.setHeader('Response-Description', 'Department name is required.');
            res.statusCode = 400;
            res.end();
        }
        else if (req.body.apiKey == '' || req.body.apiKey == null || req.body.apiKey == undefined) {
            Logger.log('error', `Api Key is required.`);
            res.setHeader('Response-Description', 'Api Key is required.');
            res.statusCode = 400;
            res.end();
        }
        else if (req.body.contactPersonName == '' || req.body.contactPersonName == null || req.body.contactPersonName == undefined) {
            Logger.log('error', `Contact person name is required.`);
            res.setHeader('Response-Description', 'Contact person name is required.');
            res.statusCode = 400;
            res.end();
        }
        else if (req.body.contactPersonEmail == '' || req.body.contactPersonEmail == null || req.body.contactPersonEmail == undefined) {
            Logger.log('error', `Contact person email is required.`);
            res.setHeader('Response-Description', 'Contact person email is required.');
            res.statusCode = 400;
            res.end();
        }
        else if (req.body.contactPersonTelephone == '' || req.body.contactPersonTelephone == null || req.body.contactPersonTelephone == undefined) {
            Logger.log('error', `Contact person telephone is required.`);
            res.setHeader('Response-Description', 'Contact person telephone is required.');
            res.statusCode = 400;
            res.end();
        }
        else {
            const departmentid = utils.randomGUID();
            const name = req.body.name;
            const apiKey = req.body.apiKey;
            const contactPersonName = req.body.contactPersonName;
            const contactPersonEmail = req.body.contactPersonEmail;
            const contactPersonTelephone = req.body.contactPersonTelephone;
            let currentDate = new Date();

            DepartmentModel.findOneByQuery({
                'departmentInfo.name': name
            }, (err, departmentData) => {
                if (departmentData) {
                    Logger.log('error', `Department with name: ${name} already exists in the system.`);
                    res.setHeader('Response-Description', `Department with name: ${name} already exists in the system.`);
                    res.statusCode = 409;
                    res.end();
                }
                else {
                    if (err.code === 500) {
                        Logger.log('error', err);
                        res.setHeader('Response-Description', err.error);
                        res.statusCode = err.code;
                        res.end();
                    }
                    else {
                        const departmentData = {
                            departmentid,
                            createdBy: 'Admin',
                            createdOn: currentDate,
                            createdOn_str: utils.dateToString(currentDate)
                        };

                        // Adding the department details in department object
                        departmentData.departmentInfo = {
                            name: name,
                            apiKey: apiKey
                        }

                        // Adding the department contact person details in department contact person object
                        departmentData.departmentContactPersonInfo = {
                            name: contactPersonName,
                            email: contactPersonEmail,
                            telephone: contactPersonTelephone
                        }

                        Logger.log('info', `Adding a department in the system.`);
                        DepartmentModel.createOneRecord(departmentData, (err, success) => {
                            if (err) {
                                res.setHeader('Response-Description', err.error);
                                res.statusCode = err.code;
                                res.end();
                            }
                            else {
                                Logger.log('info', `Success in adding the department in the system.`);
                                res.statusCode = 201;
                                res.end();
                            }
                        })
                    }
                }
            })
        }
    });

    app.put('/api/department', (req, res) => {
        if (req.body.departmentid == '' || req.body.departmentid == null || req.body.departmentid == undefined) {
            Logger.log('error', `Department id is required.`);
            res.setHeader('Response-Description', 'Department id is required.');
            res.statusCode = 400;
            res.end();
        }
        else {
            const departmentid = req.body.departmentid;

            DepartmentModel.findOneAndUpdateByQuery({
                departmentid: departmentid
            }, (err, departmentData) => {
                if (err) {
                    Logger.log('error', err);
                    res.setHeader('Response-Description', err.error);
                    res.statusCode = err.code;
                    res.end();
                }
                else {
                    let currentDate = new Date();

                    // Updating the department info
                    if (req.body.name) {
                        departmentData.departmentInfo.name = req.body.name;
                    }

                    if (req.body.apiKey) {
                        departmentData.departmentInfo.apiKey = req.body.apiKey;
                    }

                    // Updating the department contact person info
                    if (req.body.contactPersonName) {
                        departmentData.departmentContactPersonInfo.name = req.body.contactPersonName;
                    }

                    if (req.body.contactPersonEmail) {
                        departmentData.departmentContactPersonInfo.email = req.body.contactPersonEmail;
                    }

                    if (req.body.contactPersonTelephone) {
                        departmentData.departmentContactPersonInfo.telephone = req.body.contactPersonTelephone;
                    }

                    departmentData.updatedBy = 'Admin';
                    departmentData.updatedOn = currentDate;
                    departmentData.updatedOn_str = utils.dateToString(currentDate);

                    departmentData.save().then((success) => {
                        Logger.log('info', `Success in updating the department in the system.`);
                        res.statusCode = 200;
                        res.end();
                    }).catch((err) => {
                        Logger.log('error', `Oops, something went wrong #ERR005, err is: ${err}.`);
                        res.setHeader('Response-Description', 'Oops, something went wrong #ERR005.');
                        res.statusCode = 500;
                        res.end();
                    })
                }
            })
        }
    });

    app.delete('/api/department/:departmentid', (req, res) => {
        if (req.params.departmentid == '' || req.params.departmentid == null || req.params.departmentid == undefined) {
            Logger.log('error', `Department id is required.`);
            res.setHeader('Response-Description', 'Department id is required.');
            res.statusCode = 400;
            res.end();
        }
        else {
            const departmentid = req.params.departmentid;

            DepartmentModel.findOneAndRemoveByQuery({
                departmentid: departmentid
            }, (err, success) => {
                if (err) {
                    Logger.log('error', err);
                    res.setHeader('Response-Description', err.error);
                    res.statusCode = err.code;
                    res.end();
                }
                else {
                    res.statusCode = 200;
                    res.end();
                }
            })
        }
    })

};