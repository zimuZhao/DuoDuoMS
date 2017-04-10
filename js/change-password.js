$(function() {

    //表单验证
    $("#form").Validform({
        tiptype: function(msg, o, cssctl) {
            // o.type指示提示的状态，值为1、2、3、4，
            // 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态
            if (!o.obj.is("form")) { // 验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
                var form_group = o.obj.closest('.form-group');
                var infoObj = form_group.find("label.error");
                if (infoObj.size() == 0) {
                    infoObj = $('<label class="error"></label >');
                    form_group.append(infoObj);
                }
                if (o.type == 2) {
                    form_group.addClass('has-success').removeClass('has-error');

                    infoObj.fadeOut(200);
                } else {
                    form_group.removeClass('has-success').addClass('has-error');

                    infoObj.html(msg);
                    if (infoObj.is(":visible")) {
                        return;
                    }
                    infoObj.show().animate({
                        top: top - 35
                    }, 200);
                }
            }
            // $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
        },
        beforeSubmit: function() {
            changePsw();
            return false;
        }
    });

    $("#cancel").click(function() {
        cancal();
    });
});

function changePsw() {
    // var oldpassword = $("#oldpassword").val();
    var newpassword = $("#newpassword").val();
    var newpassword2 = $("#newpassword2").val();
    if (newpassword.length == 0 || newpassword2.length == 0) {
        $("#info").html("密码不能为空");
    } else if (newpassword != newpassword2) {
        $("#info").html("新密码前后不一致");
        // } else if (oldpassword != $.cookie('password')) { //这里cookie存储的是MD5加密后的密码
        //     $("#info").html("旧密码校验错误");
    } else {
        $.ajax({
            url: Domain + "user/changeUserPwd",
            data: {
                userID: $.cookie('userID'),
                password: newpassword
            },
            async: true,
            cache: false,
            success: function(data) {
                if (data.status) {
                    alert('密码修改成功');
                    $("#newpassword").val(null);
                    $("#newpassword2").val(null);
                    window.location.href = 'login.html';
                } else {
                    $("#info").html(data.result);
                }
            },
            error: function() {
                $("#info").html("服务器未响应");
            }
        });
    }
}

function cancal() {
    $('#oldpassword').val("");
    $('#newpassword').val("");
    $('#newpassword2').val("");
}

/**
 * 输入框获取焦点时清空错误提示信息
 */
$("input").focus(function() {
    $(".info").text("");
});
