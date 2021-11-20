const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Survey = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    // slug: {
    //     type: String,
    //     required: true,
    // },
    slug: { type: String, slug: "name" },
    userid: {
        type: ObjectId,
        required: true,
    },
    useremail: {
        type: String,
        required: true,
    },
    totalsubmissions: {
        type: Number,
        required: true,
    },
    questions: {
        type: Object,
        required: true
    },
    statistics: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

exports.Survey = mongoose.model('Survey', Survey, 'Survey');