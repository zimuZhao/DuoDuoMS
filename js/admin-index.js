getFourCard();
var uploadIndexNum = echarts.init(document.getElementById('uploadIndexNum'));
var uploadIndexPie = echarts.init(document.getElementById('uploadIndexPie'));
getCountByLastmonth();
var uploadIndexTrend = echarts.init(document.getElementById('uploadIndexTrend'));
getAnomalyList();
getTrendByLastmonth();
var abnormalIndex = echarts.init(document.getElementById('abnormalIndex'));
getAnomalyTrendLastmonth();
var areaCollect = echarts.init(document.getElementById('areaCollect'));

/**
 * 顶部卡片数据
 * 今日新增用户 总用户量
 * 月异常指标 易发疾病
 * 月覆盖区域 活跃区域 异常区域
 * 数据上传（今日、上周、上月）
 */
function getFourCard() {
    $.ajax({
        type: "POST",
        url: Domain + "user/four/part",
        dataType: "json",
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == "[]") {
                } else {
                    //用户量
                    $('#fourNewToday').html(data.result.userNum.newToday);
                    $('#fourNumTotal').html(data.result.userNum.total);

                    //异常指标
                    $('#fourAbIndex').html(data.result.abnormal.index);
                    $('#fourAbDis').html(data.result.abnormal.disease);

                    //区域
                    $('#fourAreaNum').html(data.result.area.num);
                    $('#fourAreaAb').html(data.result.area.abnormal);
                    $('#fourAreaAc').html(data.result.area.active);

                    //上传数量
                    $('#fourUpToday').html(data.result.upload.today);
                    $('#fourUpWeek').html(data.result.upload.lastWeek);
                    $('#fourUpMonth').html(data.result.upload.lastMonth);
                }
            }
        },
        error: function (data) {
            alert(data.result);
        }
    });
}

/**
 * [上月各类指标上传频率 - 横向柱状图 + 饼图]
 */
function getCountByLastmonth() {
    $.ajax({
        type: "POST",
        url: Domain + "user/admin/count/by/lastmonth",
        dataType: "json",
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == "[]") {
                } else {

                    /**
                     *  [上月各类指标上传频率 - 横向柱状图]
                     */
                    uploadIndexNum.setOption({
                        title: [
                            {
                                text: '各类指标上传数（上月）',
                                subtext: '总计 ' + data.result.total
                            }
                        ],
                        tooltip: {
                            trigger: 'axis'
                        },
                        // dataZoom: {
                        //     show: true
                        // },
                        toolbox: {
                            show: true,
                            feature: {
                                magicType: {
                                    show: true,
                                    type: ['line', 'bar']
                                },
                                saveAsImage: {
                                    show: true
                                }
                            }
                        },
                        legend: {
                            data: data.result.month
                        },
                        xAxis: {
                            type: 'value',
                            boundaryGap: [0, 0.01]
                        },
                        yAxis: {
                            type: 'category',
                            data: data.result.y
                        },
                        series: [
                            {
                                name: data.result.month,
                                type: 'bar',
                                data: data.result.x
                            }
                        ]
                    }); // ends uploadIndexNum

                    /**
                     *  [上月各类指标上传占比 - 饼图]
                     */
                    var series = new Array;
                    for (var i = 0; i < data.result.y.length; i++) {
                        var serie = new Object();
                        serie.name = data.result.y[i];
                        serie.value = data.result.x[i];
                        series[i] = serie;
                    }
                    uploadIndexPie.setOption({
                        title: [
                            {
                                text: '指标关注度（上月）'
                            }
                        ],
                        toolbox: {
                            show: true,
                            feature: {
                                saveAsImage: {
                                    show: true
                                }
                            }
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b}<br/> {c} ({d}%)"
                        },
                        series: [
                            {
                                type: 'pie',
                                radius: '55%',
                                data: series
                            }
                        ]
                    }); // ends uploadIndexPie

                }
            }
        },
        error: function (data) {
            alert(data.result);
        }
    });

}

function getAnomalyList() {
    var body = $("#anomalyList").html();
    $.ajax({
        type: "POST",
        url: Domain + "user/anomaly/list",
        dataType: "json",
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == "[]") {
                } else {
                    $("#anomalyList").html("");
                    $.each(data.result.y, function (idx, item) {
                        if (idx == 9) {
                            return false;
                        }
                        var titemnode = body;
                        titemnode = titemnode.replace('{num}', idx + 1);
                        titemnode = titemnode.replace('{anomaly}', item);
                        $("#anomalyList").append(titemnode);
                        $('#anomalyList').removeClass();
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

/**
 * [上月设备数据上传趋势 - 堆叠折柱混合图 ]
 */
function getTrendByLastmonth() {
    $.ajax({
        type: "POST",
        url: Domain + "user/admin/count/by/lastmonth/day",
        dataType: "json",
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == "[]") {
                } else {

                    var series = new Array;
                    for (var i = 0; i < data.result.datas.length; i++) {
                        var serie = new Object();
                        serie.name = data.result.datas[i].name;
                        serie.type = "bar";
                        serie.stack = "总量";
                        serie.data = data.result.datas[i].value;
                        series[i] = serie;
                    }

                    uploadIndexTrend.setOption({
                        "title": {
                            "text": "指标上传（上月）"
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                saveAsImage: {
                                    show: true
                                }
                            }
                        },
                        "tooltip": {
                            "trigger": "axis",
                            "axisPointer": {
                                "type": "shadow"
                            }
                        },
                        "legend": {
                            "data": data.result.legend
                        },

                        "calculable": true,
                        "xAxis": [
                            {
                                "type": "category",
                                "data": data.result.x
                            }
                        ],
                        "yAxis": [
                            {
                                "type": "value"
                            }
                        ],
                        "dataZoom": [
                            {
                                "show": true
                            }
                        ],
                        "series": series
                    });

                }
            }
        },
        error: function (data) {
            alert(data.result);
        }
    });

}

/**
 * [上月异常指标趋势 - 折线图]
 */
function getAnomalyTrendLastmonth() {
    $.ajax({
        type: "POST",
        url: Domain + "user/anomaly/trend",
        dataType: "json",
        async: true,
        cache: false,
        success: function (data) {
            if (data.status) {
                if (data.result == "[]") {
                } else {

                    var series = new Array;
                    for (var i = 0; i < data.result.datas.length; i++) {
                        var serie = new Object();
                        serie.name = data.result.datas[i].name;
                        serie.type = "line";
                        serie.stack = "总量";
                        serie.data = data.result.datas[i].value;
                        series[i] = serie;
                    }

                    abnormalIndex.setOption({
                        title: {
                            text: '异常指标（上月）'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        // legend: {
                        //     "data": [
                        //         '血压',
                        //         '血糖',
                        //         '血氧',
                        //         '尿酸',
                        //         '总胆固醇',
                        //         '脉搏',
                        //         '体温',
                        //         'BMI',
                        //         '血红蛋白',
                        //         '腰臀围'
                        //     ]
                        // },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: data.result.x
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: series
                    });

                }
            }
        },
        error: function (data) {
            alert(data.result);
        }
    });

}

/**
 * [上月地区健康数据收集情况]
 */
areaCollect.setOption({
    backgroundColor: '#404a59',
    title: {
        text: '大庆-地区健康数据收集情况（上月）',
        textStyle: {
            color: '#fff'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c} (人)'
    },
    toolbox: {
        show: true,
        feature: {
            saveAsImage: {}
        }
    },
    visualMap: {
        min: 0,
        max: 500,
        text: [
            'High', 'Low'
        ],
        realtime: false,
        calculable: true,
        textStyle: {
            color: '#fff'
        }
    },
    series: [
        {
            type: 'map',
            mapType: 'daqing',
            roam: true,
            itemStyle: {
                normal: {label: {show: true}},
                emphasis: {
                    label: {
                        show: true
                    }
                }
            },
            data: [
                {
                    name: '萨尔图区',
                    value: 205
                }, {
                    name: '红岗区',
                    value: 318
                }, {
                    name: '龙凤区',
                    value: 492
                }, {
                    name: '让胡路区',
                    value: 169
                }, {
                    name: '大同区',
                    value: 144
                }, {
                    name: '肇源县',
                    value: 406
                }, {
                    name: '林甸县',
                    value: 76
                }, {
                    name: '杜尔伯特蒙古族自治县',
                    value: 51
                }
            ]
        }
    ]
});

// 拖拽重计算
window.onresize = function () {
    uploadIndexNum.resize();
    uploadIndexPie.resize();
    uploadIndexTrend.resize();
    abnormalIndex.resize();
    areaCollect.resize();
}
