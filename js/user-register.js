$(function () {

    //表单验证
    $("#form").Validform({
        tiptype: function (msg, o, cssctl) {
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
        beforeSubmit: function () {
            addUser();
            return false;
        }
    });

    $("#cancel").click(function () {
        clearUser();
    });
});

/**
 * [清空所有已填写数据]
 * @return {[type]} [description]
 */
function clearUser() {
    $("#userID").val("");
    $("#name").val("");
    $("#iDNumber").val("");
    $("#medicareNumber").val("");
    $("#mobile").val("");
    $("#address").val("");
    $('#rES').val("");
}

/**
 * [新增用户]
 * @return {[User]} [后台model对象]
 */
function addUser() {

    var user = checkUser();
    if (user == null) {
        return;
    }
    user = JSON.stringify(user);
    $.ajax({
        type: "POST",
        url: Domain + "user/add",
        dataType: "json",
        contentType: "application/json",
        data: user,
        async: false, // async: false先执行完ajax，在执行ajax后面的语句，(async:
        // true，分两个线程走，执行ajax的同时，回调去执行后面的语句)
        cache: false, // 不对结果进行缓存
        success: function (data) {
            if (data.status) {
                alert(data.result);
            } else {
                alert("用户记录添加失败 - " + data.result);
            }
            window.location.reload();
        }
    });
}

/**
 * [获取表单中的值及检查电话号码是否正确]
 * @return {[User]} [返回User / null]
 */
function checkUser() {
    var user = {};
    user.userID = $("#userID").val();
    user.cardType = $("#cardType option:selected").val();
    user.userName = user.userID;
    user.password = "E10ADC3949BA59ABBE56E057F20F883E";
    user.sex = $("#sex option:selected").val();
    user.name = $("#name").val();
    user.iDNumber = $("#iDNumber").val();
    user.medicareNumber = $("#medicareNumber").val();
    user.address = $("#address").val();
    user.mobile = $("#mobile").val();
    user.rES = $("#rES").val();
    user.deleteFlag = false;

    if (user.mobile) {
        if (!user.mobile.match(/^(13\d|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18\d|170)\d{8}$/)/* 验证电话格式 */) {
            alert("请检查联系电话填写是否正确");
            return null;
        }
    }
    return user;

}

$('#ckbOwner').click(function () {
    if (this.checked) {
        $('#rES').removeAttr("disabled");
    } else {
        $('#rES').attr("disabled", true);
    }
});
