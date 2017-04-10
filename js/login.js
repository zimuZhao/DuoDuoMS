var Domain = "/api/";

$(document).ready(function() {
    //粒子背景特效
    $('body').particleground({dotColor: '#119380', lineColor: '#119380'});
    //验证码
    createCode();
    //测试提交，对接程序删除即可
    $(".submit_btn").click(function() {
        if (validate()) {
            // 校验用户名密码
            var username = $("#Username").val();
            var password = $("#Password").val();
            if (username.length <= 0 || password.length <= 0) {
                $('.error_msg').text("* 请输入用户名/密码");
            } else {
                $.ajax({
                    type: "POST",
                    url: Domain + "login/in",
                    data: {
                        username: username,
                        password: password
                    },
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function(data) {
                        if (data.status) {
                            //$.cookie('the_cookie'); // 读取 cookie
                            //$.cookie('the_cookie', 'the_value'); // 存储 cookie
                            //$.cookie('the_cookie', '', { expires: -1 }); // 删除 cookie
                            //$.cookie('userID', data.result.userID, { expires: 7 }); // 存储一个带7天期限的 cookie
                            // path设置同域cookie共享 否则取cookie时会有问题
                            $.cookie('userID', data.result.userID, {path: '/'});
                            $.cookie('userName', data.result.name, {path: '/'});
                            // $.cookie('password', data.result.password, {path: '/'})
                            window.location.href = "./admin-index.html";
                        } else {
                            $('.error_msg').text(data.result);
                        }
                    },
                    error: function() {
                        alert("服务器未响应！");
                    }
                });
                // ends ajax
            }
        }
    });
});

/**
 * 回车键登录
 */
$("body").keydown(function() {
    if (event.keyCode == "13") {
        $(".submit_btn").click();
    }
});

/**
 * 输入框获取焦点时清空错误提示信息
 */
$(".admin_login input").focus(function() {
    $(".admin_login .error_msg").text("");
});

/**
 * [绘制验证码]
 * @param  {[string]} a [四位验证码]
 */
function showCheck(a) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.font = "80px 'Microsoft Yahei'";
    ctx.fillText(a, 0, 100);
    // ctx.fillStyle = "white";
}

var code;
/**
 * [随机生成验证码] 四位 由26个大小写字母与1~9随机组合
 * @return {[string]} [四位验证码]
 */
function createCode() {
    code = "";
    var codeLength = 4;
    var selectChar = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    for (var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 60);
        code += selectChar[charIndex];
    }
    if (code.length != codeLength) {
        createCode();
    }
    showCheck(code);
}

/**
 * [检验验证码]
 * @return {[Boolean]} [验证码匹配 正确时返回true]
 */
function validate() {
    var inputCode = $('#J_codetext').val().toUpperCase();
    var codeToUp = code.toUpperCase();
    if (inputCode.length <= 0) {
        $('.error_msg').text("* 请输入验证码");
        createCode();
        return false;
    } else if (inputCode != codeToUp) {
        $('#J_codetext').val("");
        $('.error_msg').text("* 验证码错误");
        createCode();
        return false;
    } else {
        //$('#J_codetext').val("");
        //createCode();
        return true;
    }

}
