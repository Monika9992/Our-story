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
                    zoom: 1.2,
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

// 打开省份详情
function openProvince(provinceName) {
    var overlay = document.getElementById('modalOverlay');
    var title = document.getElementById('modalTitle');
    var tabs = document.getElementById('citiesTabs');
    var grid = document.getElementById('photoGrid');
    
    title.textContent = provinceName + '的照片';
    tabs.innerHTML = '';
    grid.innerHTML = '';
    
    var cities = cityMapping[provinceName];
    if (!cities || cities.length === 0) {
        cities = ['全部'];
    }
    
    cities.forEach(function(city, index) {
        var tab = document.createElement('button');
        tab.className = 'city-tab' + (index === 0 ? ' active' : '');
        tab.textContent = city;
        tab.addEventListener('click', function() {
            tabs.querySelectorAll('.city-tab').forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');
            loadPhotos(provinceName, city);
        });
        tabs.appendChild(tab);
    });
    
    loadPhotos(provinceName, cities[0]);
    overlay.classList.add('active');
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
