const express = require('express');
const router = new express.Router();
const artModel = require('../models/artModel');

// 主页
router.get('/pub', (req, res) => {
        res.render('admin/pub')

    })
    //文章列表
router.get('/list', (req, res) => {

    artModel.find().count().then(function(allNum) {
        artModel.find().skip(0).limit(10).then(function(result) {
            var p = Math.ceil(allNum / 10);
            var arr = [];
            for (var i = 0; i < p; i++) {
                arr.push(i + 1);
            }
            res.render('admin/list', {
                listD: result,
                pageArr: arr,
            })

        })
    })

})


// 分页
router.get('/list/page', function(req, res) {
    let p = req.query.p;
    let skipNum = (p - 1) * 10;
    artModel.find().skip(skipNum).limit(10).then(function(result) {
        console.log(result)
        res.send({
            code: 1,
            msg: '分页加载成功',
            data: result,
        })

    })
})



// 添加
router.post('/add', function(req, res) {
        console.log(req.body)
        new artModel(req.body).save().then(function(result) {
            // console.log(result)
            if (result) {
                res.send({
                    code: 1,
                    msg: '发布成功',
                })
            }

        })
    })
    // 删除
router.delete('/del', function(req, res) {
        console.log(req.query.deID)
        artModel.remove({
            _id: req.query.deID
        }).then(function(result) {
            if (result.deletedCount == 1) {
                res.send({
                    code: 1,
                    msg: '发送成功'
                })

            }
        })

    })
    // 修改
router.post('/update', function(req, res) {
        artModel.updateOne({ _id: req.body.upid }, {
            title: req.body.title,
            author: req.body.author,
            intro: req.body.intro,
            words: req.body.words

        }).then((err) => {
            if (err) {
                res.send({
                    'code': 1,
                    'msg': '发送成功',
                });
            }
        })

    })
    // 搜索
router.get('/search', function(req, res) {
        let text = req.query.sText;
        let reg = new RegExp(text);
        artModel.find({ title: reg }).then(function(result) {
            console.log(result)
            res.send({
                code: 1,
                msg: '搜索成功',
                data: result
            })
        })
    })
    // 跨域搜索
router.get('/search/jsonp', function(req, res) {

    let txt = req.query.stext; //【1】前端需要查询的内容
    let callback = req.query.cb; //【2】前端需要后端返回的函数名称
    console.log(callback)
    let reg = new RegExp(txt)
    artModel.find({ title: reg }).then(function(result) {
        let resultStr = JSON.stringify({ //【3】将json对象数据，转换为json字符串
            code: 1,
            msg: '搜索成功',
            data: result
        })
        res.send(`${callback}(${resultStr})`) //【4】这个地方最终会变为  myFn(数据包) 的方式
    })
})
module.exports = router;