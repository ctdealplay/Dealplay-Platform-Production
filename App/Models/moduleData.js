const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ModuleDataSchema = new Schema({
    title: {
        type: 'string',
        required: true
    },
    image:{
        type: 'string',
        required: true
    },
    buildUrl:{
        type:"string",
        default:""
    },
    tag:{
         type:"string",
        default:"featured"
    },
    updatedAt : { type: Date, default: Date.now() },
    createdAt : { type: Date, default: Date.now() }
}, {
    collection: 'moduleData',
    versionKey: false
});

mongoose.model('moduleData', ModuleDataSchema);
