// Created By Salman.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Logger = require('../utilities/Logger');

// Define DepartmentSchema
const DepartmentSchema = new Schema({
    departmentid: {
        type: String,
        unique: true
    },
    departmentInfo: {
        name: {
            type: String,
            required: true
        },
        apiKey: {
            type: String,
            required: true
        },
    },
    departmentContactPersonInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        telephone: {
            type: String,
            required: true
        },
    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    createdOn_str: {
        type: String
    },
    updatedOn: {
        type: Date
    },
    updatedOn_str: {
        type: String
    }
});

const departmentModel = mongoose.model('Department', DepartmentSchema);

module.exports.departmentModel = departmentModel;

module.exports.findOneByQuery = (query, callback) => {
    departmentModel.findOne(query, {
        _id: 0,
        __v: 0
    }).then((data) => {
        if (data) {
            callback(null, data);
        }
        else {
            callback({
                error: 'No Department found in the system.',
                code: 404
            }, null);
        }
    }).catch((err) => {
        callback({
            error: 'Oops, something went wrong #ERR001.',
            code: 500
        }, null);
    });
};

module.exports.findOneAndUpdateByQuery = (query, callback) => {
    departmentModel.findOne(query).then((data) => {
        if (data) {
            callback(null, data);
        }
        else {
            callback({
                error: 'No Department found in the system.',
                code: 404
            }, null);
        }
    }).catch((err) => {
        callback({
            error: 'Oops, something went wrong #ERR0001.',
            code: 500
        }, null);
    });
};

module.exports.findAllByQuery = (query, callback) => {
    departmentModel.find(query, {
        _id: 0,
        __v: 0
    }).then((data) => {
        if (data) {
            callback(null, data);
        }
        else {
            callback({
                error: 'No Departments found in the system.',
                code: 404
            }, null);
        }
    }).catch((err) => {
        callback({
            error: 'Oops, something went wrong #ERR002.',
            code: 500
        }, null);
    });
};

module.exports.findOneAndRemoveByQuery = (query, callback) => {
    departmentModel.remove(query).then((success) => {
        if (success) {
            callback(null, success);
        }
        else {
            callback({
                error: 'No Department found in the system.',
                code: 404
            }, null);
        }
    }).catch((err) => {
        callback({
            error: 'Oops, something went wrong #ERR003.',
            code: 500
        }, null);
    });
};

module.exports.createOneRecord = (data, callback) => {
    departmentModel.create(data).then((success) => {
        if (success) {
            callback(null, success);
        }
        else {
            callback({
                error: 'Error in creating the record in the system.',
                code: 400
            }, null);
        }
    }).catch((err) => {
        Logger.log('error', `Error is: ${err}.`);
        callback({
            error: 'Oops, something went wrong #ERR004.',
            code: 500
        }, null);
    });
};