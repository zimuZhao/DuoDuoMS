var body = $('#itemList').html();
$('#Confirm').click(function () {
    getDataList(0);
});

$('#Excel').click(function () {
    if ($('#itemList').hasClass('hidden')) {
        alert('没有表格数据可以导出！');
        return;
    }
    var type = $("#Item option:selected").val();
    var filename;
    switch (type) {
        case "databloodglucose":
            filename = "血糖";
            break;
        case "databloodoxygen":
            filename = "血氧";
            break;
        case "databloodpressure":
            filename = "血压";
            break;
        case "databodymassindex":
            filename = "BMI";
            break;
        case "datauriccid":
            filename = "总胆固醇";
            break;
        case "datahemoglobin":
            filename = "血红蛋白";
            break;
        case "datatemperature":
            filename = "体温";
            break;
        case "datachol":
            filename = "尿酸";
            break;
        case "datawaisthipratio":
            filename = "腰臀比";
            break;
    }
    var time = new Date();
    $("#Table").table2excel({
        exclude: ".excludeThisClass",
        name: "Worksheet Name",
        filename: filename + "_" + time.getFullYear() + "/" + (time.getMonth() + 1) + '/' + time.getDate()
    });
});

function getDataList(pageNo) {
    var type = $("#Item option:selected").val();
    if (type == 'none') {
        alert('请先选择要查询的健康指标！');
        return;
    }
    $.ajax({
        type: 'GET',
        url: Domain + type + '/list/10/' + pageNo,
        dataType: 'json',
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == '[]') {
                } else {
                    $('#itemList').html('');
                    $.each(data.result.datas, function (idx, item) {
                        var node = body;
                        var time = new Date(item.measureTime);
                        var timeFormat = time.getFullYear() + '/' + (time.getMonth() + 1) + "/" + time.getDate()
                            + "  " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
                        node = node.replace('{measureTime}', timeFormat);
                        var value;
                        switch (type) {
                            case "databloodglucose":
                                value = item.glu;
                                break;
                            case "databloodoxygen":
                                value = item.spo2;
                                break;
                            case "databloodpressure":
                                value = item.sys + "/" + item.dia;
                                break;
                            case "databodymassindex":
                                value = item.height + "/" + item.weight;
                                break;
                            case "datauriccid":
                                value = item.ua;
                                break;
                            case "datahemoglobin":
                                value = item.hb;
                                break;
                            case "datatemperature":
                                value = item.temperature;
                                break;
                            case "datachol":
                                value = item.chol;
                                break;
                            case "datawaisthipratio":
                                value = item.waist + "/" + item.hip;
                                break;
                        }
                        node = node.replace('{value}', value);
                        $('#itemList').append(node);
                        $('#itemList').removeClass();
                    });

                    $('#Paging').table({
                        pageNum: data.result.totalPage,
                        currentPage: pageNo,
                        jumpTo: function (current) {
                            pagenum = current;
                            getDataList(current);
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