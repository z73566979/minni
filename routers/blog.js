const express = require('express');
const router = new express.Router();

var listD = require('../data/listData');

const artModel = require('../models/artModel');

router.get('/list', (req, res) => {
    res.render('client/blog.html', {
        // 'listD': listD,
    })
})
router.get('/', (req, res) => {

    artModel.find().count().then(function(allNum) {
        artModel.find().skip(0).limit(10).then(function(result) {
            var p = Math.ceil(allNum / 10);
            var arr = [];
            for (var i = 0; i < p; i++) {
                arr.push(i + 1);
            }
            res.render('client/index.html', {
                listD: result,
                pageArr: arr,
            })

        })
    })
})
router.get('/detail', (req, res) => {
    var detailD = listD[req.query.idx];
    res.render('client/detail.html', {
        'detailD': detailD,
    });
})


module.exports = router