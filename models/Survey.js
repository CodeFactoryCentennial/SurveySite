const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const Survey = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    slug: {
        type: String,
        required: true,
    },
    userid: {
        type: ObjectId,
        required: true,
    },
    useremail: {
        type: String,
        required: true,
    },
    questions: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
      }
    });

exports.Survey = mongoose.model('Survey', Survey, 'Survey');