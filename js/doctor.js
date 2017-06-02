var body;
$(function () {
    body = $("#doctorList").html();
    getDoctorlist(0);
});

function getDoctorlist(pageNo) {
    $.ajax({
        type: "GET",
        url: Domain + "doctor/list/5/" + pageNo,
        dataType: "json",
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == "[]") {
                } else {
                    $("#doctorList").html("");
                    $.each(data.result.datas, function (idx, item) {
                        var titemnode = body;
                        titemnode = titemnode.replace('{doctorID}', item.doctorID);
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
                        titemnode = titemnode.replace('{direction}', item.direction);
                        titemnode = titemnode.replace('{workExperience}', item.workExperience);
                        titemnode = titemnode.replace('{mobile}', item.mobile);
                        $("#doctorList").append(titemnode);
                        $('#doctorList').removeClass();
                    });

                    $("#Paging").table({
                        pageNum: data.result.totalPage,
                        currentPage: pageNo,
                        jumpTo: function (current) {
                            pagenum = current;
                            getDoctorlist(current);
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

function editDoctor(element) {
    var doctorID = $(element).parents("tr").attr("id");
    alert('现在暂时不能修改! id=' + doctorID);
    // window.location.href = "liveHomePage/" + liveID;
}

function deleteDoctor(element) {
    var doctorID = $(element).parents("tr").attr("id");
    $('#deleteModal').modal('show');
    $('#deleteConfirm').click(function () {
        $.ajax({
            type: "PUT",
            url: Domain + "doctor/remove/" + doctorID,
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
