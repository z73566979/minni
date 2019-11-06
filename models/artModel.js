const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// 创建表结构
const artSchema = new Schema({
        'title': String,
        'author': String,
        'time': String,
        'intro': String,
        'imgUrl': String,
        'wrods': String
    })
    // 
const artModel = mongoose.model('artModel', artSchema)
module.exports = artModel;