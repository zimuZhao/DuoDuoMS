var body;
$(function () {
    body = $("#nurseList").html();
    getNurselist(0);
});

function getNurselist(pageNo) {
    $.ajax({
        type: "GET",
        url: Domain + "nurse/list/5/" + pageNo,
        dataType: "json",
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == "[]") {
                } else {
                    $("#nurseList").html("");
                    $.each(data.result.datas, function (idx, item) {
                        var titemnode = body;
                        // titemnode = titemnode.replace('{nurseImage}', item.imgUrl);
                        titemnode = titemnode.replace('{nurseID}', item.nurseID);
                        titemnode = titemnode.replace('{name}', item.name);
                        var sex = '未知';
                        if (item.sex == 1) {
                            sex = '男';
                        } else if (item.sex == 2) {
                            sex = '女';
                        }
                        titemnode = titemnode.replace('{sex}', sex);
                        var age = item.age == null ? ' ' : item.age;
                        titemnode = titemnode.replace('{age}', age);
                        titemnode = titemnode.replace('{ethnic}', item.ethnic);
                        titemnode = titemnode.replace('{education}', item.education);
                        titemnode = titemnode.replace('{birthPlace}', item.birthPlace);
                        titemnode = titemnode.replace('{serviceType}', item.serviceType);
                        titemnode = titemnode.replace('{workExperience}', item.workExperience + '年');
                        titemnode = titemnode.replace('{mobile}', item.mobile);
                        $("#nurseList").append(titemnode);
                        $('#nurseList').removeClass();
                    });

                    $("#Paging").table({
                        pageNum: data.result.totalPage,
                        currentPage: pageNo,
                        jumpTo: function (current) {
                            pagenum = current;
                            getNurselist(current);
                        }
                    });
                }
            } else {
                alert(data.result);
            }
        },
        error: function (data) {
            alert(data.result);
        }
    });
}

function deleteNurse(element) {
    var nurseID = $(element).parents("tr").attr("id");
    $('#deleteModal').modal('show');
    $('#deleteConfirm').click(function () {
        $.ajax({
            type: "PUT",
            url: Domain + "nurse/remove/" + nurseID,
            dataType: "json",
            async: false,
            cache: false,
            success: function () {
                location = location;
            },
            error: function (data) {
                alert(data.result);
            }
        });
    });
}

function editNurse(element) {
    var nurseID = $(element).parents("tr").attr("id");
    //alert('现在暂时不能修改! id=' + nurseID);
    $.ajax({
        type:"GET",
        url: Domain + "nurse/get/" + nurseID,
        dataType: "json",
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == "{}") {
                } else {
                    $("#idxDetail").val(data.result.nurseID);
                    $("#name").val(data.result.name);
                    $("#sex").val(data.result.sex);
                    $("#mobile").val(data.result.mobile);
                    $("#address").val(data.result.address);
                    $("#education").val(data.result.education);
                    $("#age").val(data.result.age);
                    $("#ethnic").val(data.result.ethnic);
                   // $("#ethnic").val(data.result.ethnic);
                    $("#pay").val(data.result.pay);
                    //
                    $("#serviceType").val(data.result.serviceType);
                    $("#workExperience").val(data.result.workExperience);
                    $("#birthPlace").val(data.result.birthPlace);
                    //证件编号
                    $("#serviceArea").val(data.result.serviceArea);
                    $("#intro").val(data.result.intro);
                    if (data.result.ifStay){
                        $("#ifStay").attr('checked',true);
                    }
                    else{
                        $("#ifStay").attr('checked',false);
                    }
                    //$("#ifStay").val(data.result.ifStay);
                }
            } else {
                alert(data.result);
            }
        },
        error: function (data) {
            alert(data.result);
            return null;
        }
    });
    $("#detailModal").modal('show');
}


$(function () {

    $("#nurseDetail").Validform({
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
            updateNurse();
            return false;
        }
    });

    $("#cancel").click(function () {
        clearUser();
    });
});
function updateNurse() {
    var nurse = checkNurse();
    if (nurse == null) {
        alert("nurse == null");
        return;
    }
    nurse = JSON.stringify(nurse);
    $.ajax({
        type: "POST",
        url: Domain + "nurse/update/",
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
                alert("护工记录修改失败 - " + data.result);
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
    nurse.nurseID = $("#idxDetail").val();
    nurse.password = "0701AA317DA5A004FBF6111545678A6C";
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
    nurse.birthPlace = $(birthPlace).val();
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


