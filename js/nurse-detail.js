$(document).ready(function () {
    showLocation();
    alert("功能暂未开放，当前不能添加护工，敬请期待！");
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
