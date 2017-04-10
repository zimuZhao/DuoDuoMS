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
            addDoctor();
            return false;
        }
    });

    $("#cancel").click(function() {
        clearDoctor();
    });
});

/**
 * [清空所有已填写数据]
 * @return {[type]} [description]
 */
function clearDoctor() {
    $("#userName").val("");
    $("#password").val("");
    $("#name").val("");
    $("#age").val("");
    $("#direction").val("");
    $("#rate").val("");
    $('@workExperience').val("");
    $("#license").val("");
    $("#education").val("");
    $("#pay").val("");
    $("#mobile").val("");
    $("#IDNumber").val("");
    $("#address").val("");
    $('#intro').val("");
}

/**
 * [新增医生]
 * @return {[Doctor]} [后台model对象]
 */
function addDoctor() {

    var doctor = checkDoctor();
    if (doctor == null) {
        return;
    }
    doctor = JSON.stringify(doctor);
    $.ajax({
        type: "POST",
        url: Domain + "doctor/add",
        dataType: "json",
        contentType: "application/json",
        data: doctor,
        async: false, // async: false先执行完ajax，在执行ajax后面的语句，(async:
        // true，分两个线程走，执行ajax的同时，回调去执行后面的语句)
        cache: false, // 不对结果进行缓存
        success: function(data) {
            if (data.status) {
                alert("医生记录添加成功");
            } else {
                alert("医生记录添加失败 - " + data.result);
            }
            window.location.reload();
        }
    });
}

/**
 * [获取表单中的值及检查电话号码是否正确]
 * @return {[User]} [返回User / null]
 */
function checkDoctor() {
    var doctor = {};
    doctor.userName = $("#userName").val();
    doctor.password = $("#password").val();
    doctor.sex = $("#sex option:selected").val();
    doctor.name = $("#name").val();
    doctor.age = $("#age").val();
    doctor.direction = $("#direction").val();
    doctor.rate = $("#rate").val();
    doctor.workExperience = $("#workExperience").val();
    doctor.license = $("#license").val();
    doctor.education = $("#education").val();
    doctor.pay = $("#pay").val();
    doctor.mobile = $("#mobile").val();
    doctor.IDNumber = $("#IDNumber").val();
    doctor.address = $("#address").val();
    doctor.intro = $("#intro").val();
    doctor.deleteFlag = false;

    if (doctor.mobile) {
        if (!doctor.mobile.match(/^(13\d|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18\d|170)\d{8}$/)/* 验证电话格式 */) {
            alert("请检查联系电话填写是否正确");
            return null;
        }
    }
        return doctor;
}
