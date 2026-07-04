const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    deleted: {
        type: Boolean,
        default: false
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ProjectSchema.virtual('name').get(function () {
    return this.title;
});

ProjectSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.name = ret.title;
        return ret;
    }
});

ProjectSchema.set('toObject', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.name = ret.title;
        return ret;
    }
});

module.exports = mongoose.model("Project",ProjectSchema);
