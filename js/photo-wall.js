// 城市映射数据（从 china-map-data.js 引入）
var cityMapping = {};

// 初始化 ECharts 地图
function initMap() {
    var chart = echarts.init(document.getElementById('chinaMap'));
    
    // 从 CDN 加载中国地图
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
        .then(response => response.json())
        .then(geoJson => {
            echarts.registerMap('CHINA', geoJson);
            
            option = {
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0, 20, 40, 0.9)',
                    borderColor: 'rgba(0, 180, 255, 0.5)',
                    borderWidth: 1,
                    textStyle: { color: '#fff', fontSize: 14 },
                    formatter: function(params) {
                        if (params.data) {
                            return params.name + '<br/>点击查看详情';
                        }
                        return params.name;
                    }
                },
                visualMap: {
                    show: false,
                    min: 0,
                    max: 100,
                    inRange: {
                        color: [
                            'rgba(0, 40, 80, 0.6)',
                            'rgba(0, 80, 140, 0.7)',
                            'rgba(0, 120, 180, 0.8)'
                        ]
                    }
                },
                series: [{
                    name: '中国地图',
                    type: 'map',
                    map: 'CHINA',
                    roam: true,
                    zoom: 1.4,
                    center: [104.5, 36.0],
                    label: {
                        show: true,
                        color: 'rgba(0, 212, 255, 0.9)',
                        fontSize: 10,
                        fontWeight: 300
                    },
                    itemStyle: {
                        borderColor: 'rgba(0, 180, 255, 0.8)',
                        borderWidth: 1,
                        areaColor: 'rgba(0, 60, 120, 0.5)'
                    },
                    emphasis: {
                        label: {
                            color: '#00d4ff',
                            fontSize: 12
                        },
                        itemStyle: {
                            areaColor: 'rgba(0, 180, 255, 0.6)',
                            borderColor: '#00d4ff',
                            borderWidth: 2,
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 212, 255, 0.8)'
                        }
                    },
                    select: {
                        disabled: true
                    },
                    data: []
                }]
            };
            
            chart.setOption(option);
            
            // 点击事件
            chart.on('click', function(params) {
                openProvince(params.name);
            });
        })
        .catch(error => {
            console.error('地图加载失败:', error);
            alert('地图加载失败，请检查网络连接');
        });
}

// 打开省份详情 - 在地图上显示照片
var currentProvince = null;
var photoElements = [];
var lineElements = [];

function openProvince(provinceName) {
    currentProvince = provinceName;
    
    // 隐藏弹窗，直接在地图上显示
    document.getElementById('modalOverlay').classList.remove('active');
    
    // 清除旧照片和线条
    clearOldPhotos();
    
    var cities = cityMapping[provinceName];
    if (!cities || cities.length === 0) {
        cities = ['全部'];
    }
    
    // 在地图上为每个城市创建照片节点
    cities.forEach(function(city, index) {
        setTimeout(function() {
            addPhotoToMap(provinceName, city, index, cities.length);
        }, index * 300);
    });
}

function addPhotoToMap(province, city, index, total) {
    var chart = echarts.getInstanceByDom(document.getElementById('chinaMap'));
    if (!chart) return;
    
    // 获取省份的地理中心
    var geoJSON = echarts.getMap('CHINA').geoJSON;
    var provinceCoord = null;
    
    // 查找省份坐标
    if (geoJSON && geoJSON.features) {
        for (var i = 0; i < geoJSON.features.length; i++) {
            var name = geoJSON.features[i].properties.name;
            if (name === province || name.replace('省', '') === province || name.replace('市', '') === province || name.replace('自治区', '') === province) {
                var centroid = getCentroid(geoJSON.features[i]);
                provinceCoord = chart.convertToPixel({seriesId: 'map'}, centroid);
                break;
            }
        }
    }
    
    if (!provinceCoord) return;
    
    // 计算照片位置（围绕省份中心呈扇形分布）
    var angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    var radius = 120 + Math.random() * 80;
    var x = provinceCoord[0] + Math.cos(angle) * radius;
    var y = provinceCoord[1] + Math.sin(angle) * radius;
    
    // 创建照片元素
    var photoDiv = document.createElement('div');
    photoDiv.className = 'map-photo';
    photoDiv.style.cssText = 'position:absolute;width:' + (40 + Math.random()*30) + 'px;height:' + (40 + Math.random()*30) + 'px;border-radius:50%;background:rgba(0,180,255,0.3);border:2px solid rgba(0,212,255,0.8);display:flex;align-items:center;justify-content:center;font-size:16px;opacity:0;transition:all 0.5s ease;cursor:pointer;z-index:10;';
    photoDiv.innerHTML = '📷';
    photoDiv.title = city;
    photoDiv.style.left = x + 'px';
    photoDiv.style.top = y + 'px';
    
    // 添加到地图容器
    var mapContainer = document.getElementById('chinaMap');
    mapContainer.appendChild(photoDiv);
    photoElements.push(photoDiv);
    
    // 延迟显示
    setTimeout(function() {
        photoDiv.style.opacity = '1';
        photoDiv.style.transform = 'scale(1.2)';
    }, 50);
    
    // 创建连线
    createLine(provinceCoord, [x, y], city);
    
    // 点击照片查看大图
    photoDiv.addEventListener('click', function() {
        openLightbox(city);
    });
}

function createLine(from, to, label) {
    var lineDiv = document.createElement('div');
    lineDiv.className = 'photo-line';
    
    var dx = to[0] - from[0];
    var dy = to[1] - from[1];
    var length = Math.sqrt(dx*dx + dy*dy);
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    lineDiv.style.cssText = 'position:absolute;height:1px;background:linear-gradient(90deg, rgba(0,212,255,0.6), rgba(0,212,255,0.1));transform-origin:0 0;opacity:0;transition:opacity 0.5s ease;z-index:5;pointer-events:none;';
    lineDiv.style.width = length + 'px';
    lineDiv.style.left = from[0] + 'px';
    lineDiv.style.top = from[1] + 'px';
    lineDiv.style.transform = 'rotate(' + angle + 'deg)';
    
    var mapContainer = document.getElementById('chinaMap');
    mapContainer.appendChild(lineDiv);
    lineElements.push(lineDiv);
    
    setTimeout(function() {
        lineDiv.style.opacity = '1';
    }, 100);
}

function clearOldPhotos() {
    photoElements.forEach(function(el) { el.remove(); });
    lineElements.forEach(function(el) { el.remove(); });
    photoElements = [];
    lineElements = [];
}

function getCentroid(feature) {
    var coords = feature.geometry.coordinates[0];
    var sumX = 0, sumY = 0;
    for (var i = 0; i < coords.length; i++) {
        sumX += coords[i][0];
        sumY += coords[i][1];
    }
    return [sumX / coords.length, sumY / coords.length];
}

// 加载照片
function loadPhotos(province, city) {
    var grid = document.getElementById('photoGrid');
    grid.innerHTML = '';
    
    var placeholders = ['📷', '🖼️', '🌅', '🎆', '🏞️', '🌄'];
    for (var i = 0; i < 6; i++) {
        var item = document.createElement('div');
        item.className = 'photo-item';
        item.innerHTML = '<span>' + placeholders[i] + '</span><p>' + city + ' ' + (i+1) + '</p>';
        item.addEventListener('click', function() {
            openLightbox(city);
        });
        grid.appendChild(item);
    }
}

// 打开灯箱
function openLightbox(city) {
    var lightbox = document.getElementById('lightbox');
    var img = document.getElementById('lightboxImg');
    var caption = document.getElementById('lightboxCaption');
    img.src = 'photos/' + city + '/sample.jpg';
    caption.textContent = city;
    lightbox.classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    
    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    document.getElementById('lightbox').addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });
});
