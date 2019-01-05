const httpService = require('../service/HttpService');

window.$ = window.jQuery = require('jquery');//以此种方式引入jquery即可在控制器中引用

alert("这是demo页面");

$("#btn").click(function () {

    alert("jq捕获了click事件");
})