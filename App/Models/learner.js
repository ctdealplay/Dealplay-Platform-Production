const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LearnerSchema = new Schema({
    userId:{
        type : Schema.Types.ObjectId,
    },
    // userIdObject: {
    //     type: 'object',
    //     default:{}
    // },
    firstName: {
        type: 'string',
        required: true
    },
    lastName:{ type: 'string',
        required: true},
       
    email:{
        type:'string',
        required:true
    },
    password:{
        type:'string',
        required:true
    },
   
   pin: {
        type: 'number',
        required: true
    },
    status: {
        type: 'string',
        default: 'active'
    },
    role: {
        type: 'string',
        required: true
    },
    company:{
        type:"object"
    },
    businessUnit:{
        type:"string",
        default:""
    },
    phoneNumber:{
        type: "string",
        default:""
    },
    visiblePassword:{
        type: 'string'
    },
    updatedAt : { type: Date, default: Date.now() },
    createdAt : { type: Date, default: Date.now() }
}, {
    collection: 'learner',
    versionKey: false
});

mongoose.model('learner', LearnerSchema);
