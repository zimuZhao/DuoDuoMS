var GetClass = function (cls, elm) {
    var arrCls = new Array();
    var seeElm = elm;
    var rexCls = new RegExp('(|\\\\s)' + cls + '(\\\\s|)', 'i');
    var lisElm = document.getElementsByTagName(seeElm);
    for (var i = 0; i < lisElm.length; i++) {
        var evaCls = lisElm[i].className;
        if (evaCls.length > 0 && (evaCls == cls || rexCls.test(evaCls)))
            arrCls.push(lisElm[i]);
    }
    return arrCls;
}

var Stars_object = function () {
    // stars数组
    var stars_arr = GetClass('stars', 'a');
    var diff_val = [];		// 位置默认误差值
    var temp_obj, t;		// 临时对象
    var out_time = 300;		// 离开恢复时间

    for (var k in stars_arr) {
        (function (key) {
            var obj = stars_arr[key];
            obj.fonts = obj.getElementsByTagName('div')[0];
            obj.spans = obj.getElementsByTagName('span')[0];
            obj.onmousemove = function (e) {
                if (temp_obj == obj) clearTimeout(t);

                // 计算左边距
                if (!diff_val[key]) {
                    var p_left = obj.offsetLeft;
                    var p = obj.offsetParent;
                    while (p) {
                        p_left += p.offsetLeft;
                        p = p.offsetParent;
                    }
                    diff_val[key] = p_left;
                }

                var e1 = e || window.event;
                var val = e1.clientX - diff_val[key];
                val = val < 0 ? 0 : val;
                obj.fonts.style.width = val + 'px';
                if (val > 0 && val < 101) {
                    obj.spans.innerHTML = '点击评价: ' + val + '分';
                    obj.val = val;
                }
            }
            obj.onmouseout = function () {
                if (obj.fonts.getAttribute('name') != '') {
                    temp_obj = obj;
                    t = setTimeout(function () {
                        obj.fonts.style.width = obj.fonts.getAttribute('name') + 'px';
                        obj.spans.innerHTML = '';
                    }, out_time)
                }
            }

            // 点击
            obj.onclick = function () {
                obj.fonts.setAttribute('name', '');
                obj.onmousemove = null;
                obj.getElementsByTagName('span')[0].innerHTML = '评价成功: ' + obj.val + '分';
                // obj.val 评分值
            }

        })(k);
    }

}

if (document.all)
    window.attachEvent('onload', function () {
        Stars_object();
    });
else
    window.addEventListener('load', function () {
        Stars_object();
    }, false);