const express = require('express');
const app = express();
const swig = require('swig-templates');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
swig.setDefaults({ cache: false });

app.use(cors());

const multer = require('multer')
    // 图片上传
var imgUrl = '' //用以存储图片路径的，即将被发给前端
var storage = multer.diskStorage({

    destination: function(req, file, cb) { //指定图片存放路径
        cb(null, '/public/upload')
    },
    filename: function(req, file, cb) { //为上传的图片资源进行命名
        console.log(1)
        var orname = file.originalname.split('.')[1]
        var imgname = `${new Date().getTime()}${parseInt(Math.random() * 999)}.${orname}`; //为图片命名，保证名称的唯一性
        imgUrl = '/static/upload/' + imgname; //拼接保存图片路径
        cb(null, imgname)
    }

})

var upload = multer({ storage: storage })
app.post('/uploadimg', upload.single('myImg'), function(req, res) {
    console.log(req)
        // console.log(req.file)
    res.send({
        code: 1,
        msg: '上传成功',
        imgUrl
    })
})

// 静态资源的分享
app.use('/static', express.static(__dirname + '/public'));
app.engine('html', swig.renderFile); //固定配置项
app.set('view engine', 'html'); //固定配置项
app.set('views', __dirname + '/views'); //通知swig在渲染页面的时候，从哪个路径获取html模板
// console.log(__dirname)

// 配置post请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// 
app.use('/', require('./routers/blog.js'));
app.use('/admin', require('./routers/admin.js'))
    // 连接数据库
mongoose.connect('mongodb://localhost:27018', (err) => {
    if (err) {
        console.log('连接失败')

    } else {
        console.log('连接成功')
        app.listen(8008);
    }
})


// console.log("服务器开启")