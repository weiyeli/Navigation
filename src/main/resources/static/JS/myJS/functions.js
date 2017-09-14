/**
 * Created by 胡瑾凡 on 2017/9/8.
 */
var startShow = false;
var mediumShow = false;
var endShow = false;

var startPoint = null;
var mediumPoints = [];
var endPoint = null;

var markers = [];
var searched = false;
var map;
var pathSimplifierIns = null;
var navg0 = null;

var startListShow = function () {
    $('#startListDiv').stop();
    if (mediumShow) {
        $('#medium_show').attr('class', 'glyphicon glyphicon-triangle-bottom');
        $('#mediumListDiv').fadeOut('fast');
        mediumShow = false;
    }
    if (endShow) {
        $('#end_show').attr('class', 'glyphicon glyphicon-triangle-bottom');
        $('#endListDiv').fadeOut('fast');
        endShow = false;
    }
    $('#startListDiv').fadeToggle('fast');
    if (startShow) {
        $('#start_show').attr('class', 'glyphicon glyphicon-triangle-bottom');
    }
    else {
        $('#start_show').attr('class', 'glyphicon glyphicon-triangle-top');
    }
    startShow = !startShow;
};

var mediumListShow = function () {
    $('#mediumListDiv').stop();
    if (startShow) {
        $('#start_show').attr('class', 'glyphicon glyphicon-triangle-bottom');
        $('#startListDiv').fadeOut('fast');
        startShow = false;
    }
    if (endShow) {
        $('#end_show').attr('class', 'glyphicon glyphicon-triangle-bottom');
        $('#endListDiv').fadeOut('fast');
        endShow = false;
    }
    $('#mediumListDiv').fadeToggle('fast');
    if (mediumShow) {
        $('#medium_show').attr('class', 'glyphicon glyphicon-triangle-bottom');
    }
    else {
        $('#medium_show').attr('class', 'glyphicon glyphicon-triangle-top');
    }
    mediumShow = !mediumShow;
};

var endListShow = function () {
    $('#endListDiv').stop();
    if (startShow) {
        $('#start_show').attr('class', 'glyphicon glyphicon-triangle-bottom');
        $('#startListDiv').fadeOut('fast');
        startShow = false;
    }
    if (mediumShow) {
        $('#medium_show').attr('class', 'glyphicon glyphicon-triangle-bottom');
        $('#mediumListDiv').fadeOut('fast');
        mediumShow = false;
    }
    $('#endListDiv').fadeToggle('fast');
    if (endShow) {
        $('#end_show').attr('class', 'glyphicon glyphicon-triangle-bottom');
    }
    else {
        $('#end_show').attr('class', 'glyphicon glyphicon-triangle-top');
    }
    endShow = !endShow;
};

var initStartList = function () {
    var startListDiv = document.getElementById('startListDiv');
    for (var i = 1; i <= data.length; i++) {
        var btnStart = document.createElement("Button");
        btnStart.setAttribute('class', 'btnStartList');
        btnStart.setAttribute('id', 'start' + i);
        if (data['p'+i].selectable) {
            btnStart.innerHTML = data['p'+i].name;
            startListDiv.appendChild(btnStart);
        }
    }
    return startEventBinding();
};

var initMediumList = function () {
    var mediumListDiv = document.getElementById('mediumListDiv');
    for (var i = 1; i <= data.length; i++) {
        var btnMedium = document.createElement("Button");
        btnMedium.setAttribute('class', 'btnMediumList');
        btnMedium.setAttribute('id', 'medium' + i);
        if (data['p'+i].selectable) {
            btnMedium.innerHTML = data['p'+i].name;
            mediumListDiv.appendChild(btnMedium);
        }
    }
    return mediumEventBinding();
};

var initEndList = function () {
    var endListDiv = document.getElementById('endListDiv');
    for (var i = 1; i <= data.length; i++) {
        var btnEnd = document.createElement("Button");
        btnEnd.setAttribute('class', 'btnEndList');
        btnEnd.setAttribute('id', 'end' + i);
        if (data['p'+i].selectable) {
            btnEnd.innerHTML = data['p'+i].name;
            endListDiv.appendChild(btnEnd);
        }
    }
    return endEventBinding();
};

var startEventBinding = function () {
    for (var i = 1; i <= data.length ; i++) {
        $('#start' + i).bind("click", {id : i}, startDis);
    }
};

function startDis(evt) {
    if (searched) {
        reset();
    }
    if (startPoint === evt.data.id) {
        $('#start' + startPoint).removeAttr("style");
        $('#start' + startPoint).attr('class', 'btnStartList');
        $('#start' + startPoint).blur();
        if (startPoint !== endPoint){
            $('#medium' + startPoint).removeAttr("style");
            $('#medium' + startPoint).attr('class', 'btnMediumList');
            markers[startPoint].setIcon('../../images/mark_b.png');
            markers[startPoint].setAnimation('AMAP_ANIMATION_NONE');
        }
        else {
            markers[startPoint].setIcon('../../images/endMarker.png');
        }
        startPoint = null;
    }
    else {
        if (startPoint !== null){
            $('#start' + startPoint).removeAttr("style");
            $('#start' + startPoint).attr('class', 'btnStartList');
            if (startPoint === endPoint) {
                markers[startPoint].setIcon('../../images/endMarker.png');
            }
            else {
                $('#medium' + startPoint).removeAttr("style");
                $('#medium' + startPoint).attr('class', 'btnMediumList');
                markers[startPoint].setIcon('../../images/mark_b.png');
                markers[startPoint].setAnimation('AMAP_ANIMATION_NONE');
            }
        }
        startPoint = evt.data.id;
        $('#start' + evt.data.id).blur();
        $('#start' + evt.data.id).css('background-color', 'rgba(107, 180, 106, 0.7)');
        if (mediumPoints.indexOf(evt.data.id) !== -1){
            mediumPoints.splice(mediumPoints.indexOf(evt.data.id), 1);
        }
        $('#medium' + evt.data.id).removeAttr("style");
        $('#medium' + evt.data.id).attr('class', 'btnMediumDisable');
        if (startPoint === endPoint) {
            markers[startPoint].setIcon('../../images/startend.png');
            markers[startPoint].setAnimation('AMAP_ANIMATION_BOUNCE');
        }
        else {
            markers[startPoint].setIcon('../../images/startMarker.png');
            markers[startPoint].setAnimation('AMAP_ANIMATION_BOUNCE');
        }
    }
    $('#start_show').attr('class', 'glyphicon glyphicon-triangle-bottom');
    $('#startListDiv').fadeOut('fast');
    startShow = false;
}

var mediumEventBinding = function () {
    for (var i = 1; i <= data.length ; i++) {
        $('#medium' + i).bind("click", {id : i}, mediumDis);
    }
};

function mediumDis(evt) {
    if (searched) {
        reset();
    }
    if (evt.data.id !== startPoint && evt.data.id !== endPoint) {
        if (mediumPoints.indexOf(evt.data.id) === -1) {
            mediumPoints.push(evt.data.id);
            $('#medium' + evt.data.id).css('background-color', 'rgba(88, 173, 180, 0.7)');
            markers[evt.data.id].setAnimation('AMAP_ANIMATION_BOUNCE');
        }
        else {
            mediumPoints.splice(mediumPoints.indexOf(evt.data.id), 1);
            $('#medium' + evt.data.id).removeAttr('style');
            $('#medium' + evt.data.id).attr('class', 'btnMediumList');
            markers[evt.data.id].setAnimation('AMAP_ANIMATION_NONE');
        }
    }
    $('#medium' + evt.data.id).blur();
}

var endEventBinding = function () {
    for (var i = 1; i <= data.length ; i++) {
        $('#end' + i).bind("click", {id : i}, endDis);
    }
};

function endDis(evt) {
    if (searched) {
        reset();
    }
    if (endPoint === evt.data.id) {
        $('#end' + endPoint).removeAttr("style");
        $('#end' + endPoint).attr('class', 'btnEndList');
        $('#end' + endPoint).blur();
        if (endPoint !== startPoint) {
            $('#medium' + endPoint).removeAttr("style");
            $('#medium' + endPoint).attr('class', 'btnMediumList');
            markers[endPoint].setIcon('../../images/mark_b.png');
            markers[endPoint].setAnimation('AMAP_ANIMATION_NONE');
        }
        else {
            markers[endPoint].setIcon('../../images/startMarker.png');
        }
        endPoint = null;
    }
    else {
        if (endPoint !== null) {
            $('#end' + endPoint).removeAttr("style");
            $('#end' + endPoint).attr('class', 'btnEndList');
            if (startPoint === endPoint) {
                markers[startPoint].setIcon('../../images/startMarker.png');
            }
            else {
                $('#medium' + endPoint).removeAttr("style");
                $('#medium' + endPoint).attr('class', 'btnMediumList');
                markers[endPoint].setIcon('../../images/mark_b.png');
                markers[endPoint].setAnimation('AMAP_ANIMATION_NONE');
            }
        }
        endPoint = evt.data.id;
        $('#end' + evt.data.id).css('background-color', 'rgba(180, 114, 108, 0.7)');
        $('#end' + evt.data.id).blur();
        if (mediumPoints.indexOf(evt.data.id) !== -1) {
            mediumPoints.splice(mediumPoints.indexOf(evt.data.id), 1);
        }
        $('#medium' + evt.data.id).removeAttr("style");
        $('#medium' + evt.data.id).attr('class', 'btnMediumDisable');
        if (startPoint === endPoint) {
            markers[startPoint].setIcon('../../images/startend.png');
            markers[startPoint].setAnimation('AMAP_ANIMATION_BOUNCE');
        }
        else {
            markers[endPoint].setIcon('../../images/endMarker.png');
            markers[endPoint].setAnimation('AMAP_ANIMATION_BOUNCE');
        }
    }
    $('#end_show').attr('class', 'glyphicon glyphicon-triangle-bottom');
    $('#endListDiv').fadeOut('fast');
    endShow = false;
}

var searchPath = function () {
    if (!searched) {
        if (startPoint === null) {
            $('#startPointEmpty').modal('show');
        }
        else if (endPoint === null) {
            $('#endPointEmpty').modal('show');
        }
        else if (startPoint !== null && startPoint === endPoint && mediumPoints.length === 0) {
            $('#mediumPointEmpty').modal('show');
        }
        else {
            searched = true;
            postData();
        }
    }
};

var reset = function () {
    if (pathSimplifierIns !== null) {
        pathSimplifierIns.clearPathNavigators();
        pathSimplifierIns.hide();
        pathSimplifierIns = null;
    }
    if (navg0 !== null) {
        navg0.destroy();
    }
    $('#start' + startPoint).removeAttr("style");
    $('#start' + startPoint).attr('class', 'btnStartList');
    $('#end' + endPoint).removeAttr("style");
    $('#end' + endPoint).attr('class', 'btnEndList');
    if (startPoint !== null) {
        markers[startPoint].setIcon('../../images/mark_b.png');
        markers[startPoint].setAnimation('AMAP_ANIMATION_NONE');
    }
    if (endPoint !== null) {
        markers[endPoint].setIcon('../../images/mark_b.png');
        markers[endPoint].setAnimation('AMAP_ANIMATION_NONE');
    }
    for (var i = 0; i < mediumPoints.length; i++){
        $('#medium' + mediumPoints[i]).removeAttr("style");
        $('#medium' + mediumPoints[i]).attr('class', 'btnMediumList');
        markers[mediumPoints[i]].setIcon('../../images/mark_b.png');
        markers[mediumPoints[i]].setAnimation('AMAP_ANIMATION_NONE');
    }
    $('#medium' + startPoint).removeAttr("style");
    $('#medium' + startPoint).attr('class', 'btnMediumList');
    $('#medium' + endPoint).removeAttr("style");
    $('#medium' + endPoint).attr('class', 'btnMediumList');
    $('#pathLength').fadeOut();
    startPoint = null;
    endPoint = null;
    mediumPoints = [];
    searched = false;
};

var lowerMedium = function () {
    startPoint = startPoint - 1;
    endPoint = endPoint - 1;
    for (var i = 0; i < mediumPoints.length; i++) {
        mediumPoints[i] = mediumPoints[i] - 1;
    }
};

var upperMedium = function (Points) {
    startPoint = startPoint + 1;
    endPoint = endPoint + 1;
    for (var i = 0; i < mediumPoints.length; i++) {
        mediumPoints[i] = mediumPoints[i] + 1;
    }
    for (var j = 0; j < Points.length; j++) {
        Points[j] = Points[j] + 1;
    }
};

var postData = function () {
    lowerMedium();

    var dataPost = {
        'start': startPoint,
        'end': endPoint,
        'middle': mediumPoints
    };

    $.ajax({
        url:'/getPath',
        type:"POST",
        data:JSON.stringify(dataPost),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function (message) {
            $('#pathLength').html('路径长度为：' + message.sd + 'm');
            $('#pathLength').fadeIn();
            upperMedium(message.path);
            var finalPoints = [];
            for (var i = 0; i < message.path.length; i++) {
                var temp = data['p'+message.path[i]];
                var latlng = [temp.loc.x, temp.loc.y];
                finalPoints.push(latlng);
            }

            // new AMap.Polyline({
            //     map: map,
            //     path: finalPoints,
            //     strokeColor: '#ff7754',
            //     strokeWeight: 8,
            //     strokeStyle: 'solid',
            //     geodesic: true,
            //     showDir: true
            // });

            AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {

                if (!PathSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！');
                    return;
                }

                pathSimplifierIns = new PathSimplifier({
                    zIndex: 500,
                    map: map, //所属的地图实例
                    getPath: function(pathData, pathIndex) {
                        return pathData.path;
                    },
                    renderOptions: {
                        renderAllPointsIfNumberBelow: 100 //绘制路线节点，如不需要可设置为-1
                    }
                });

                window.pathSimplifierIns = pathSimplifierIns;

                //设置数据
                pathSimplifierIns.setData([{
                    name: '路线0',
                    path: finalPoints
                }]);

                navg0 = pathSimplifierIns.createPathNavigator(0, //关联第1条轨迹
                    {
                        loop: true, //循环播放
                        speed: 400
                    });

                navg0.start();
            });
        }
    })
};

var drawMap = function () {
    var lat = 116.63212576721185;
    var lng = 23.41243690052986;
    map = new AMap.Map('container',{
        resizeEnable: true,
        zoom: 17,
        zooms: [16.5, 18],
        center: [lat, lng],
        features : ['bg', 'building']
    });

    // AMap.event.addListener(map, "click", function(e) {
    //     console.log(e.lnglat);
    //     new AMap.Marker({
    //         position: e.lnglat,
    //         map: map
    //     });
    // });

    var line = [
        [[116.639277, 23.40872], [116.638166, 23.40876], [116.637726, 23.40871], [116.636514, 23.410059], [116.635913, 23.410807],
            [116.635119, 23.411595], [116.635012, 23.412001], [116.633284, 23.412772], [116.633478, 23.41398], [116.633199, 23.414431],
            [116.632866, 23.414972], [116.632383, 23.415671], [116.632025, 23.41622], [116.631257, 23.417005], [116.630602, 23.418315]],
        [[116.635913, 23.410807], [116.63455, 23.409936], [116.633901, 23.409902], [116.633553, 23.410502], [116.632721, 23.410133], [116.63167, 23.409729],
            [116.629277, 23.410128], [116.629202, 23.410675], [116.628816, 23.411236]],
        [[116.633901, 23.409902], [116.632721, 23.410133]],
        [[116.629202, 23.410675], [116.627936, 23.410103]],
        [[116.635119, 23.411595], [116.633553, 23.410502], [116.631686, 23.412826], [116.630308, 23.413808], [116.63005, 23.414445], [116.629663, 23.415592], [116.631257, 23.417005]],
        [[116.633553, 23.410502], [116.633901, 23.409902]],
        [[116.633199, 23.414431], [116.633054, 23.414194], [116.631654, 23.414527], [116.630731, 23.41465], [116.630157, 23.415435]],
        [[116.633054, 23.414194], [116.631686, 23.412826]],
        [[116.630731, 23.41465], [116.631536, 23.416326]],
        [[116.638166, 23.40876], [116.637522, 23.409961], [116.636514, 23.410059]],
        [[116.637522, 23.409961], [116.637758, 23.411137], [116.637576, 23.411871], [116.638236, 23.411561]],
        [[116.638048, 23.410896], [116.637758, 23.411137], [116.63616, 23.411812], [116.635119, 23.411595]],
        [[116.637576, 23.411871], [116.638076, 23.412469], [116.637415, 23.412575], [116.637479, 23.412855], [116.636525, 23.413126], [116.635709, 23.412432], [116.63616, 23.411812]],
        [[116.635709, 23.412432], [116.635012, 23.412001], [116.635071, 23.41288], [116.633284, 23.412772]],
        [[116.636525, 23.413126], [116.63535, 23.414504], [116.633323, 23.41495]],
        [[116.633199, 23.414431], [116.633323, 23.41495], [116.632866, 23.414972]],
        [[116.63535, 23.414504], [116.634143, 23.415863], [116.633633, 23.415479]],
        [[116.634143, 23.415863], [116.631257, 23.417005]],
        [[116.631536, 23.416326], [116.631257, 23.417005]],
        [[116.637758, 23.411137], [116.638236, 23.411561]],
        [[116.630157, 23.415435], [116.631536, 23.416326]],
        [[116.630157, 23.415435], [116.63005, 23.414445]],
        [[116.631536, 23.416326], [116.632025, 23.41622]],
        [[116.633553, 23.410502], [116.63455, 23.409936]]
    ];

    for (var l = 0; l < line.length; l++) {
        new AMap.Polyline({
            map: map,
            path: line[l],
            strokeColor: '#ffffff',
            strokeWeight: 8,
            strokeStyle: 'solid',
            geodesic: true
        });
    }

    for (var loca = 1; loca <= data.length; loca++) {
        var temp = data['p' + loca];
        if (temp.loc.x !== 0 && temp.selectable) {
            markers[loca] = new AMap.Marker({
                zIndex: 1000,
                position: [temp.loc.x, temp.loc.y],
                map: map,
                title: temp.name,
                label: {
                    content: temp.name,
                    offset: new AMap.Pixel(temp.offset.x, temp.offset.y)
                },
                extData: {
                    position: null,
                    index: loca,
                    selected: false
                }
            });
        }
    }
};


var data = {
    length : 49,
    p1: {
        id: 1,
        name: '正校门',
        loc: {x: 116.637726, y: 23.40871},
        offset: {x: -45, y: 20},
        selectable: true
    },
    p2: {
        id: 2,
        name: '幼儿园',
        loc: {x: 116.631686, y: 23.412826},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p3: {
        id: 3,
        name: '真理钟',
        loc: {x: 116.636514, y: 23.410059},
        offset: {x: -45, y: 25},
        selectable: true
    },
    p4: {
        id: 4,
        name: '图书馆',
        loc: {x: 116.635913, y: 23.410807},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p5: {
        id: 5,
        name: '校训碑中间点',
        loc: {x: 116.635119, y: 23.411595},
        offset: {x: 20, y: 20},
        selectable: false
    },
    p6: {
        id: 6,
        name: '校训碑',
        loc: {x: 116.635012, y: 23.412001},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p7: {
        id: 7,
        name: '大礼堂',
        loc: {x: 116.633284, y: 23.412772},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p8: {
        id: 8,
        name: '新行政楼',
        loc: {x: 116.633478, y: 23.41398},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p9: {
        id: 9,
        name: '金三角',
        loc: {x: 116.633199, y: 23.414431},
        offset: {x: -50, y: 3},
        selectable: true
    },
    p10: {
        id: 10,
        name: 'CD宿舍',
        loc: {x: 116.632866, y: 23.414972},
        offset: {x: -60, y: 15},
        selectable: true
    },
    p11: {
        id: 11,
        name: 'AB宿舍',
        loc: {x: 116.632383, y: 23.415671},
        offset: {x: 23, y: 5},
        selectable: true
    },
    p12: {
        id: 12,
        name: '旧体育馆',
        loc: {x: 116.631536, y: 23.416326},
        offset: {x: -55, y: 25},
        selectable: true
    },
    p13: {
        id: 13,
        name: 'EF宿舍',
        loc: {x: 116.632025, y: 23.41622},
        offset: {x: 20, y: -26},
        selectable: true
    },
    p14: {
        id: 14,
        name: '水库',
        loc: {x: 116.631257, y: 23.417005},
        offset: {x: -40, y: 20},
        selectable: true
    },
    p15: {
        id: 15,
        name: '医学院中间点',
        loc: {x: 116.63455, y: 23.409936},
        offset: {x: 20, y: 20},
        selectable: false
    },
    p16: {
        id: 16,
        name: '医学院',
        loc: {x: 116.633901, y: 23.409902},
        offset: {x: -45, y: 25},
        selectable: true
    },
    p17: {
        id: 17,
        name: '弘毅书院',
        loc: {x: 116.633553, y: 23.410502},
        offset: {x: -55, y: 25},
        selectable: true
    },
    p18: {
        id: 18,
        name: '网络中心',
        loc: {x: 116.632721, y: 23.410133},
        offset: {x: -60, y: 20},
        selectable: true
    },
    p19: {
        id: 19,
        name: '附中附小',
        loc: {x: 116.63167, y: 23.409729},
        offset: {x: -60, y: 20},
        selectable: true
    },
    p20: {
        id: 20,
        name: '附中附小-思源中间点',
        loc: {x: 116.629277, y: 23.410128},
        offset: {x: 20, y: 20},
        selectable: false
    },
    p21: {
        id: 21,
        name: '思源书院',
        loc: {x: 116.629202, y: 23.410675},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p22: {
        id: 22,
        name: '知行书院',
        loc: {x: 116.628816, y: 23.411236},
        offset: {x: -60, y: 20},
        selectable: true
    },
    p23: {
        id: 23,
        name: '西门',
        loc: {x: 116.627936, y: 23.410103},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p24: {
        id: 24,
        name: '789',
        loc: {x: 116.630308, y: 23.413808},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p25: {
        id: 25,
        name: '校医院',
        loc: {x: 116.63005, y: 23.414445},
        offset: {x: -50, y: 20},
        selectable: true
    },
    p26: {
        id: 26,
        name: '体育场入口A',
        loc: {x: 116.633054, y: 23.414194},
        offset: {x: -60, y: 35},
        selectable: true
    },
    p27: {
        id: 27,
        name: '体育场入口B',
        loc: {x: 116.630731, y: 23.41465},
        offset: {x: -30, y: 35},
        selectable: true
    },
    p28: {
        id: 28,
        name: '体育场',
        loc: {x: 116.631654, y: 23.414527},
        offset: {x: 20, y: 30},
        selectable: true
    },
    p29: {
        id: 29,
        name: '游泳池',
        loc: {x: 116.630157, y: 23.415435},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p30: {
        id: 30,
        name: 'E教学楼',
        loc: {x: 116.63616, y: 23.411812},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p31: {
        id: 31,
        name: '汕大侧门',
        loc: {x: 116.638166, y: 23.40876},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p32: {
        id: 32,
        name: '体育园',
        loc: {x: 116.639277, y: 23.40872},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p33: {
        id: 33,
        name: '真理钟分叉口',
        loc: {x: 116.637522, y: 23.409961},
        offset: {x: 20, y: 20},
        selectable: false
    },
    p34: {
        id: 34,
        name: '至诚桥分叉口',
        loc: {x: 116.637758, y: 23.411137},
        offset: {x: 20, y: 20},
        selectable: false
    },
    p35: {
        id: 35,
        name: '东门',
        loc: {x: 116.638048, y: 23.410896},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p36: {
        id: 36,
        name: '四饭鸿泰',
        loc: {x: 116.637576, y: 23.411871},
        offset: {x: -30, y: 40},
        selectable: true
    },
    p37: {
        id: 37,
        name: '至诚',
        loc: {x: 116.638236, y: 23.411561},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p38: {
        id: 38,
        name: 'G座宿舍',
        loc: {x: 116.638076, y: 23.412469},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p39: {
        id: 39,
        name: '软件实验室分叉口',
        loc: {x: 116.637415, y: 23.412575},
        offset: {x: 20, y: 20},
        selectable: false
    },
    p40: {
        id: 40,
        name: '气膜篮球场',
        loc: {x: 116.637479, y: 23.412855},
        offset: {x: -70, y: 20},
        selectable: true
    },
    p41: {
        id: 41,
        name: 'DG教学楼',
        loc: {x: 116.636525, y: 23.413126},
        offset: {x: -60, y: 20},
        selectable: true
    },
    p42: {
        id: 42,
        name: '旧行政楼分叉口',
        loc: {x: 116.635709, y: 23.412432},
        offset: {x: 20, y: 20},
        selectable: false
    },
    p43: {
        id: 43,
        name: '旧行政楼',
        loc: {x: 116.635071, y: 23.41288},
        offset: {x: -60, y: 20},
        selectable: true
    },
    p44: {
        id: 44,
        name: '理科楼分叉口',
        loc: {x: 116.63535, y: 23.414504},
        offset: {x: 20, y: 20},
        selectable: false
    },
    p45: {
        id: 45,
        name: '二三饭',
        loc: {x: 116.633323, y: 23.41495},
        offset: {x: 20, y: 28},
        selectable: true
    },
    p46: {
        id: 46,
        name: '研究生宿舍分叉口',
        loc: {x: 116.634143, y: 23.415863},
        offset: {x: 20, y: 20},
        selectable: false
    },
    p47: {
        id: 47,
        name: '二三饭研究生宿舍入口',
        loc: {x: 116.633633, y: 23.415479},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p48: {
        id: 48,
        name: '长江艺术学院ACC',
        loc: {x: 116.630602, y: 23.418315},
        offset: {x: 20, y: 20},
        selectable: true
    },
    p49: {
        id: 49,
        name: '水库路口',
        loc: {x: 116.629663, y: 23.415592},
        offset: {x: 20, y: 20},
        selectable: false
    }
};