$('#btnSearch').click(function () {
    var cardID = $('#ID').val();
    if (cardID == '') {
        alert("请输入卡号！");
        return;
    }
    $.ajax({
        type: 'GET',
        url: Domain + 'user/find/by/recent/' + cardID,
        dataType: 'json',
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result === null) {
                    alert('未找到用户数据！请检查卡号是否输入正确');
                } else {
                    //血糖
                    if (data.result.dataBloodGlucose === null) {
                        $('#BGglu').text('请测量');
                        $('#BGtime').text('---');
                    } else {
                        $('#BGglu').text(data.result.dataBloodGlucose.glu + "  mmol/L");
                        $('#BGtime').text(changeDate(data.result.dataBloodGlucose.measureTime));
                    }
                    //血氧
                    if (data.result.dataBloodOxygen === null) {
                        $('#BOspo2').text('请测量');
                        $('#BOtime').text('---');
                    } else {
                        $('#BOspo2').text(data.result.dataBloodOxygen.spo2 + "%");
                        $('#BOtime').text(changeDate(data.result.dataBloodOxygen.measureTime));
                    }
                    //血压
                    if (data.result.dataBloodPressure === null) {
                        $('#BPvalue').text('请测量');
                        $('#BPtime').text('---');
                    } else {
                        $('#BPvalue').text(data.result.dataBloodPressure.sys + '/' + data.result.dataBloodPressure.dia + "  mmHg");
                        $('#BPtime').text(changeDate(data.result.dataBloodPressure.measureTime));
                    }
                    //BMI检测
                    if (data.result.dataBodyMassIndex === null) {
                        $('#BMIvalue').text('请测量');
                        $('#BMItime').text('---');
                    } else {
                        $('#BMIvalue').text(data.result.dataBodyMassIndex.height + '/' + data.result.dataBodyMassIndex.weight + "  cm/kg");
                        $('#BMItime').text(changeDate(data.result.dataBodyMassIndex.measureTime));
                    }
                    //总胆固醇
                    if (data.result.dataChol === null) {
                        $('#CHOLvalue').text('请测量');
                        $('#CHOLtime').text('---');
                    } else {
                        $('#CHOLvalue').text(data.result.dataChol.chol + "  mmol/L");
                        $('#CHOLtime').text(changeDate(data.result.dataChol.measureTime));
                    }
                    //血红蛋白
                    if (data.result.dataHemoglobin === null) {
                        $('#HBvalue').text('请测量');
                        $('#HBtime').text('---');
                    } else {
                        $('#HBvalue').text(data.result.dataHemoglobin.hb + "  mmol/L");
                        $('#HBtime').text(changeDate(data.result.dataHemoglobin.measureTime));
                    }
                    //体温
                    if (data.result.dataTemperature === null) {
                        $('#TEMPvalue').text('请测量');
                        $('#TEMPtime').text('---');
                    } else {
                        $('#TEMPvalue').text(data.result.dataTemperature.temperature + "  ℃");
                        $('#TEMPtime').text(changeDate(data.result.dataTemperature.measureTime));
                    }
                    //尿酸
                    if (data.result.dataUricCid === null) {
                        $('#UAvalue').text('请测量');
                        $('#UAtime').text('---');
                    } else {
                        $('#UAvalue').text(data.result.dataUricCid.ua + "  mmol/L");
                        $('#UAtime').text(changeDate(data.result.dataUricCid.measureTime));
                    }
                    //腰臀比
                    if (data.result.dataWaistHipRatio === null) {
                        $('#WHRvalue').text('请测量');
                        $('#WHRtime').text('---');
                    } else {
                        $('#WHRvalue').text(data.result.dataWaistHipRatio.waist + "/" + data.result.dataWaistHipRatio.hip + "  cm/cm");
                        $('#WHRtime').text(changeDate(data.result.dataWaistHipRatio.measureTime));
                    }
                    $('#dataPanel').removeClass('hidden');
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

$("button[name='btnHistory']").click(function () {
    var cardID = $('#ID').val();
    var type = this.getAttribute('data-healthtype');
    location.href = 'health-data-history.html?type=' + type + '&cardID=' + cardID;
});

function changeDate(time) {
    if (time == null) {
        return '';
    }
    var date = new Date(time);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDay();
}