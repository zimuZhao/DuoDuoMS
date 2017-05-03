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

function editNurse(element) {
    var nurseID = $(element).parents("tr").attr("id");
    alert('可以跳转啦! id=' + nurseID);
    // window.location.href = "liveHomePage/" + liveID;
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
