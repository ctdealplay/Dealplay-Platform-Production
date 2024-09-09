const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
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
    lastName:{
        type:'string',
        required:true
    },
    email: {
        type: 'string',
        required: true,
        unique: true
    },
    password: {
        type: 'string',
        required: true
    },
    visibalePassword: {
        type: 'string',
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
    
    image: {
        type: String,
        default: '/dist/img/user123.png'
    },
    uniqueId: {
        type: "string",
        unique: true 
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
    learnerCount:{
        type:"number",
        default:0
    },
    roleId:{
        type: Schema.Types.ObjectId,
    },
    userCount:{
        type:'number',
        default:0
    },
    learnerCount:{
        type:'number',
        default:0
    },
    updatedAt : { type: Date, default: Date.now() },
    createdAt : { type: Date, default: Date.now() }
}, {
    collection: 'user',
    versionKey: false
});

mongoose.model('user', UserSchema);
