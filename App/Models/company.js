const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CompanySchema = new Schema({
    companyName:{
        type : "string",
        default:""
    },
    companyAddress:{
        type : "string",
        default:""
    },
    updatedAt : { type: Date, default: Date.now() },
    createdAt : { type: Date, default: Date.now() }
}, {
    collection: 'company',
    versionKey: false
});

mongoose.model('company', CompanySchema);
