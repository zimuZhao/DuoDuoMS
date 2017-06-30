var body;
$(function () {
    body = $("#userList").html();
    getUserlist(0);
});

function getUserlist(pageNo) {
    $.ajax({
        type: "GET",
        url: Domain + "user/list/5/" + pageNo,
        dataType: "json",
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == "[]") {
                } else {
                    $("#userList").html("");
                    $.each(data.result.datas, function (idx, item) {
                        var titemnode = body;
                        // titemnode = titemnode.replace('{userImage}', item.imgUrl);
                        titemnode = titemnode.replace('{idxID}', item.userID);
                        titemnode = titemnode.replace('{idx}', idx);
                        titemnode = titemnode.replace('{userID}', item.userID);
                        titemnode = titemnode.replace('{cardType}', item.cardType);
                        titemnode = titemnode.replace('{userName}', item.userName);
                        var sex = '未知';
                        if (item.sex == 1) {
                            sex = '男';
                        } else if (item.sex == 2) {
                            sex = '女';
                        }
                        titemnode = titemnode.replace('{sex}', sex);
                        var time =  new Date(item.creatTime);
                        var ymdhis =  "";
                        ymdhis += time.getUTCFullYear() + "-";
                        ymdhis += (time.getUTCMonth()+1) + "-";
                        ymdhis += time.getUTCDate();
                        ymdhis += " " + time.getUTCHours() + ":";
                        ymdhis += time.getUTCMinutes() + ":";
                        ymdhis += time.getUTCSeconds();

                        titemnode = titemnode.replace('{creatTime}', ymdhis);
                        titemnode = titemnode.replace('{name}', item.name);
                        titemnode = titemnode.replace('{iDNumber}', item.iDNumber);
                        titemnode = titemnode.replace('{medicareNumber}', item.medicareNumber);
                        titemnode = titemnode.replace('{address}', item.address);
                        titemnode = titemnode.replace('{mobile}', item.mobile);
                        $("#userList").append(titemnode);
                        $('#userList').removeClass();
                    });

                    $("#Paging").table({
                        pageNum: data.result.totalPage,
                        currentPage: pageNo,
                        jumpTo: function (current) {
                            pagenum = current;
                            getUserlist(current);
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

$('#btnSearch').click(function () {
    var userID = $('#ID').val();
    if (userID == '') {
        alert("请输入卡号！");
        return;
    }
    $.ajax({
        type: "GET",
        url: Domain + "user/get/" + userID,
        dataType: "json",
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == "{}") {
                } else {
                    $("#userList").html("");

                    var titemnode = body;
                    // titemnode = titemnode.replace('{userImage}', item.imgUrl);
                    titemnode = titemnode.replace('{idxID}', data.result.userID);
                    titemnode = titemnode.replace('{idx}', 0);
                    titemnode = titemnode.replace('{userID}', data.result.userID);
                    titemnode = titemnode.replace('{cardType}', data.result.cardType);
                    titemnode = titemnode.replace('{userName}', data.result.userName);
                    var sex = '未知';
                    if (data.result.sex == 1) {
                        sex = '男';
                    } else if (data.result.sex == 2) {
                        sex = '女';
                    }
                    titemnode = titemnode.replace('{sex}', sex);
                    var time =  new Date(data.result.creatTime);

                    var ymdhis =  "";
                    ymdhis += time.getUTCFullYear() + "-";
                    ymdhis += (time.getUTCMonth()+1) + "-";
                    ymdhis += time.getUTCDate();
                    ymdhis += " " + time.getUTCHours() + ":";
                    ymdhis += time.getUTCMinutes() + ":";
                    ymdhis += time.getUTCSeconds();

                    titemnode = titemnode.replace('{creatTime}', ymdhis);
                    titemnode = titemnode.replace('{name}', data.result.name);
                    titemnode = titemnode.replace('{iDNumber}', data.result.iDNumber);
                    titemnode = titemnode.replace('{medicareNumber}', data.result.medicareNumber);
                    titemnode = titemnode.replace('{address}', data.result.address);
                    titemnode = titemnode.replace('{mobile}', data.result.mobile);
                    $("#userList").append(titemnode);
                    $('#userList').removeClass();
                }
            } else {
                alert(data.result);
            }
        },
        error: function (data) {
            alert(data.result);
        }
    });
});


function editUser(element) {
    var userID = $(element).parents("tr").attr("id");
    alert('现在暂时不能修改! id=' + userID);
    // window.location.href = "liveHomePage/" + liveID;
}


function deleteUser(element) {
    var userID = $(element).parents("tr").attr("id");
    $('#deleteModal').modal('show');
    $('#deleteConfirm').click(function () {
        $.ajax({
            type: "PUT",
            url: Domain + "user/remove/" + userID,
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
