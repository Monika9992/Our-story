// 渲染中国地图
function renderMap() {
    var svg = document.getElementById("chinaMap");
    if (!svg) return;
    
    // 计算偏移量使地图居中
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    provinceData.forEach(function(p) {
        var coords = p.path.match(/(\\d+),(\\d+)/g);
        if (coords) {
            coords.forEach(function(c) {
                var parts = c.split(",");
                var x = parseInt(parts[0]), y = parseInt(parts[1]);
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            });
        }
    });
    var mapWidth = maxX - minX;
    var mapHeight = maxY - minY;
    var offsetX = (800 - mapWidth) / 2 - minX;
    var offsetY = (600 - mapHeight) / 2 - minY;
    
    provinceData.forEach(function(p) {
        // 转换路径坐标
        var newPath = p.path.replace(/(\\d+),(\\d+)/g, function(m, x, y) {
            return (parseInt(x) + offsetX) + "," + (parseInt(y) + offsetY);
        });
        
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", newPath);
        path.setAttribute("data-province", p.name);
        path.title = p.name;
        svg.appendChild(path);
        
        // 添加省份名称标签
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("class", "province-label");
        text.setAttribute("x", p.center[0] + offsetX);
        text.setAttribute("y", p.center[1] + offsetY);
        text.textContent = p.name;
        svg.appendChild(text);
    });
    
    // 绑定点击事件
    svg.querySelectorAll("path[data-province]").forEach(function(path) {
        path.addEventListener("click", function() {
            openProvince(this.getAttribute("data-province"));
        });
    });
}

// 打开省份详情
function openProvince(provinceName) {
    var overlay = document.getElementById("modalOverlay");
    var title = document.getElementById("modalTitle");
    var tabs = document.getElementById("citiesTabs");
    var grid = document.getElementById("photoGrid");
    
    title.textContent = provinceName + "的照片";
    tabs.innerHTML = "";
    grid.innerHTML = "";
    
    var cities = cityMapping[provinceName];
    if (!cities || cities.length === 0) {
        cities = ["全部"];
    }
    
    // 创建城市标签
    cities.forEach(function(city, index) {
        var tab = document.createElement("button");
        tab.className = "city-tab" + (index === 0 ? " active" : "");
        tab.textContent = city;
        tab.addEventListener("click", function() {
            tabs.querySelectorAll(".city-tab").forEach(function(t) { t.classList.remove("active"); });
            tab.classList.add("active");
            loadPhotos(provinceName, city);
        });
        tabs.appendChild(tab);
    });
    
    // 默认加载第一个城市
    loadPhotos(provinceName, cities[0]);
    
    overlay.classList.add("active");
}

// 加载照片
function loadPhotos(province, city) {
    var grid = document.getElementById("photoGrid");
    grid.innerHTML = "";
    
    var photoPath = "photos/" + province + "/" + city + "/";
    
    // 示例：显示占位符（实际使用时替换为真实照片）
    var placeholders = ["📷", "🖼️", "🌅", "🎆", "🏞️", "🌄"];
    for (var i = 0; i < 6; i++) {
        var item = document.createElement("div");
        item.className = "photo-item";
        item.innerHTML = "<span>" + placeholders[i] + "</span><p>" + city + " " + (i+1) + "</p>";
        item.addEventListener("click", function() {
            openLightbox(city);
        });
        grid.appendChild(item);
    }
}

// 打开灯箱
function openLightbox(city) {
    var lightbox = document.getElementById("lightbox");
    var img = document.getElementById("lightboxImg");
    var caption = document.getElementById("lightboxCaption");
    img.src = "photos/" + city + "/sample.jpg";
    caption.textContent = city;
    lightbox.classList.add("active");
}

// 关闭弹窗
function closeModal() {
    document.getElementById("modalOverlay").classList.remove("active");
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("active");
}

// 初始化
document.addEventListener("DOMContentLoaded", function() {
    renderMap();
    
    document.getElementById("modalClose").addEventListener("click", closeModal);
    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    
    document.getElementById("modalOverlay").addEventListener("click", function(e) {
        if (e.target === this) closeModal();
    });
    document.getElementById("lightbox").addEventListener("click", function(e) {
        if (e.target === this) closeLightbox();
    });
});
