const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ModuleSchema = new Schema({
    title: {
        type: 'string',
        required: true
    },
    price: {
        type: 'number',
        required: true
    },
    image:{
        type: 'string',
        required: true
    },
    status: {
        type: 'string',
        default: 'active'
    },
    buildUrl:{
        type:"string",
        default:""
    },
    totalMaxSession:{
        type:"number",
        default:0
    },
    userId:{
        type : Schema.Types.ObjectId,
    },
    remainingMaxSession:{
        type:"number",
        default:0
    },
    learnerId:{
        type : Schema.Types.ObjectId
    },
    tag:{
         type:"string",
        default:"featured"
    },
    type:{
        type:"string",
        default:""
    },
    updatedAt : { type: Date, default: Date.now() },
    createdAt : { type: Date, default: Date.now() }
}, {
    collection: 'module',
    versionKey: false
});

mongoose.model('module', ModuleSchema);
