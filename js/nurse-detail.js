$(document).ready(function () {
    showLocation();
});

/**
 * 籍贯 - 实现全国省市区三级联动
 * @param province
 * @param city
 * @param town
 */
function showLocation(province, city, town) {

    var loc = new Location();
    var title = ['省份', '地级市', '市、县、区'];
    $.each(title, function (k, v) {
        title[k] = '<option value="">' + v + '</option>';
    })

    $('#selectProvince').append(title[0]);
    $('#selectCity').append(title[1]);
    $('#selectTown').append(title[2]);

    $('#selectProvince').change(function () {
        $('#selectCity').empty();
        $('#selectCity').append(title[1]);
        loc.fillOption('selectCity', '0,' + $('#selectProvince').val());
        $('#selectCity').change();
    });

    $('#selectCity').change(function () {
        $('#selectTown').empty();
        $('#selectTown').append(title[2]);
        loc.fillOption('selectTown', '0,' + $('#selectProvince').val() + ',' + $('#selectCity').val());
    });

    $('#selectTown').change(function () {
        console.log($('#selectProvince option:selected').text());
    });

    if (province) {
        loc.fillOption('selectProvince', '0', province);

        if (city) {
            loc.fillOption('selectCity', '0,' + province, city);

            if (town) {
                loc.fillOption('selectTown', '0,' + province + ',' + city, town);
            }
        }

    } else {
        loc.fillOption('selectProvince', '0');
    }

}



$(function () {

    //表单验证
    $("#nurseForm").Validform({
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
            addNurse();
            return false;
        }
    });

    $("#cancel").click(function () {
        clearNurse();
    });
});

/**
 * [清空所有已填写数据]
 * @return {[type]} [description]
 */
function clearNurse() {
    $("#name").val("");
    $("#mobile").val("");
    $("#address").val("");
    $("#age").val("");
    $("#pay").val("");
    $("#serviceType").val("");
    $('#workExperience').val("");
    $('#serviceArea').val("");
    $('#intro').val("");
}

/**
 * [新增用户]
 * @return {[Nurse]} [后台model对象]
 */
function addNurse() {
    var nurse = checkNurse();
    if (nurse == null) {
        return;
    }
    nurse = JSON.stringify(nurse);
    $.ajax({
        type: "POST",
        url: Domain + "nurse/add/",
        dataType: "json",
        contentType: "application/json",
        data: nurse,
        async: false, // async: false先执行完ajax，在执行ajax后面的语句，(async:
        // true，分两个线程走，执行ajax的同时，回调去执行后面的语句)
        cache: false, // 不对结果进行缓存
        success: function (data) {
            if (data.status) {
                alert(data.result);
            } else {
                alert("护工记录添加失败 - " + data.result);
            }
            window.location.reload();
        }
    });
}

/**
 * [获取表单中的值及检查电话号码是否正确]
 * @return {[Nurse]} [返回Nurse / null]
 */
function checkNurse() {
    var nurse = {};
    nurse.name = $("#name").val();
    nurse.sex = $("#sex option:selected").val();
    nurse.mobile = $("#mobile").val();
    nurse.address = $("#address").val();
    nurse.education = $("#education").val();
    nurse.age = $("#age").val();
    nurse.ethnic = $("#ethnic option:selected").val();
    nurse.pay = $("#pay").val();
    nurse.serviceType = $("#serviceType").val();
    nurse.workExperience = $("#workExperience").val();
    var brithPlace = "";
    brithPlace += $("#selectProvince option:selected").val();
    brithPlace += $("#selectCity option:selected").val();
    brithPlace += $("#selectTown option:selected").val();
    nurse.birthPlace = brithPlace;
    //证书编号
    //信用等级
    nurse.serviceArea = $("#serviceArea").val();
    nurse.intro = $("#intro").innerHTML;
    nurse.ifStay = $("#ifStay").val();

    nurse.deleteFlag = false;

    if (nurse.mobile) {
        if (!nurse.mobile.match(/^(13\d|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18\d|170)\d{8}$/)/* 验证电话格式 */) {
            alert("请检查联系电话填写是否正确");
            return null;
        }
    }
    return nurse;

}