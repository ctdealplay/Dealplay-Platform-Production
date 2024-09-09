const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ModuleSessionSchema = new Schema({
    moduleId:{
        type : Schema.Types.ObjectId,
    },
    maxSession:{
        type : "number",
    },
    userId:{
        type : Schema.Types.ObjectId,
    },
    status:{
        type:'string',
        default:'active'
    },
    updatedAt : { type: Date, default: Date.now() },
    createdAt : { type: Date, default: Date.now() }
}, {
    collection: 'moduleSession',
    versionKey: false
});

mongoose.model('moduleSession', ModuleSessionSchema);
