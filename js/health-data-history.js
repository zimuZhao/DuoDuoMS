var body = $('#Table').html();
$(function () {
    var type = getQueryString('type');
    var cardID = getQueryString('cardID');
    if (type === null || cardID === null) {
        alert("请重新选择要显示的健康指标!");
        location.href = 'health-data.html';
    }
    switch (type) {
        case 'databloodglucose':
            $('#Title').text('血糖历史记录');
            break;
        case 'databloodoxygen':
            $('#Title').text('血氧历史记录');
            break;
        case 'databloodpressure':
            $('#Title').text('血压历史记录');
            break;
        case 'databodymassindex':
            $('#Title').text('BMI历史记录');
            break;
        case 'datachol':
            $('#Title').text('总胆固醇历史记录');
            break;
        case 'datahemoglobin':
            $('#Title').text('血红蛋白历史记录');
            break;
        case 'datatemperature':
            $('#Title').text('体温历史记录');
            break;
        case 'datauriccid':
            $('#Title').text('尿酸历史记录');
            break;
        case 'datawaisthipratio':
            $('#Title').text('腰臀比历史记录');
            break;
    }
    $.ajax({
        type: 'GET',
        url: Domain + type + '/find/by/' + cardID,
        dataType: 'json',
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == '[]') {
                } else {
                    $('#Table').html("");
                    $.each(data.result, function (idx, item) {
                        var node = body;
                        var time = new Date(item.measureTime);
                        var timeFormat = time.getFullYear() + '/' + (time.getMonth() + 1) + "/" + time.getDate()
                            + "  " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
                        node = node.replace('{measureTime}', timeFormat);
                        node = node.replace('{num}', idx + 1);
                        var value;
                        switch (type) {
                            case "databloodglucose":
                                value = item.glu + "  mmol/L";
                                break;
                            case "databloodoxygen":
                                value = item.spo2 + "%";
                                break;
                            case "databloodpressure":
                                value = item.sys + "/" + item.dia + "  mmHg";
                                break;
                            case "databodymassindex":
                                value = item.height + "/" + item.weight + "  cm/kg";
                                break;
                            case "datauriccid":
                                value = item.ua + "  mmol/L";
                                break;
                            case "datahemoglobin":
                                value = item.hb + "  mmol/L";
                                break;
                            case "datatemperature":
                                value = item.temperature + "  ℃";
                                break;
                            case "datachol":
                                value = item.chol + "  mmol/L";
                                break;
                            case "datawaisthipratio":
                                value = item.waist + "/" + item.hip + "  cm/cm";
                                break;
                        }
                        node = node.replace('{value}', value);
                        $('#Table').append(node);
                        $('#Table').removeClass();
                    });

                    // $('#Paging').table({
                    //     pageNum: data.result.totalPage,
                    //     currentPage: pageNo,
                    //     jumpTo: function (current) {
                    //         pagenum = current;
                    //         getDataList(current);
                    //     }
                    // });


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


/**
 * 获取地址栏参数
 * @param name 匹配字段
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return r[2];
    return null;
}