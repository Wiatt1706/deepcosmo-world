// 函数库
const _ = {};

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

// 1: 判断数据类型
_.type = function (obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
};

// 2:深拷贝-JSON对象的parse和stringify
_.deepClone = function (obj) {
    let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
    return objClone;
};

// 导出文本
_.exportRaw = function (data, name) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    save_link.click();
};

// 导出图片
_.exportImg = function (data, name) {
    var link = document.createElement("a");
    var blob = dataURLtoBlob(data);
    var objurl = URL.createObjectURL(blob);
    link.download = name;
    link.href = objurl;
    link.click();
};

// 判断对象中是否存在某个key
_.isHasOwnProperty = function (obj, property) {
    if (_.type(obj) == 'Object') {
        return obj.hasOwnProperty(property);
    }
    return false;
};

// 获取集合中出现最多次数的对象，及其出现的次数
_.findMostArr = function (arr) {
    if (!arr.length) return;
    if (arr.length === 1) return 1;
    let maxObj, maxNum = 0;
    let res = arr.reduce((res, currentNum) => {
        res[currentNum] ? res[currentNum] += 1 : res[currentNum] = 1
        if (res[currentNum] > maxNum) {
            maxNum = res[currentNum];
            maxObj = currentNum;
        }
        return res;
    }, {});
    return { maxObj: maxObj, num: maxNum };
};

// 获取鼠标点击当前地址
_.getPosition = function (e) {

    let targ;
    if (!e) {
        e = window.event;
    }
    if (e.target) {
        targ = e.target;
    } else if (e.srcElement) {
        targ = e.srcElement;
    }
    if (targ.nodeType === 3) {
        targ = targ.parentNode;
    }
    let x = Math.floor(e.pageX - targ.offsetLeft);
    let y = Math.floor(e.pageY - targ.offsetTop);

    return { "x": x, "y": y };

};

// 获取转换后的坐标
_.windowToCanvas = function (x, y, canvas) {

    let box = canvas.getBoundingClientRect();
    return {
        x: x - box.left - (box.width - canvas.width) / 2,
        y: y - box.top - (box.height - canvas.height) / 2
    };
};

// 获取base64图片大小，返回KB数字
_.getImgSize = function (str) {

    //获取base64图片大小，返回KB数字
    var str = base64url.replace('data:image/jpeg;base64,', '');//这里根据自己上传图片的格式进行相应修改

    var strLength = str.length;
    var fileLength = parseInt(strLength - (strLength / 8) * 2);

    // 由字节转换为KB
    var size = "";
    size = (fileLength / 1024).toFixed(2);

    return parseInt(size);

};

// 获取设备像素比
_.getPixelRatio = function (context) {

    var backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
    return (window.devicePixelRatio || 1) / backingStore;

};

// 渲染画板
_.rendererDrawImage = function (source, target) {

    let ctx = source.getContext`2d`;
    var ratio = _.getPixelRatio(ctx);
    ctx.scale(ratio, ratio);

    const scale = target.width / target.height;
    source.style.width = source.width + "px";
    source.style.height = source.width / scale + "px";
    source.width = source.width * ratio;
    source.height = source.width / scale;
    ctx.drawImage(target, 0, 0, target.width, target.height, 0, 0, source.width, source.height);

};

_.adaptDPR = ({ canvas, dpr, cssWidth, cssHeight }) => { // 在初始化 canvas 的时候就要调用该方法
    const ctx = canvas.getContext('2d');
    // 重新设置 canvas 自身宽高大小和 css 大小。放大 canvas；css 保持不变，因为我们需要那么多的点
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    ctx.scale(dpr, dpr);
}

_.scale = (originalCoordinates, newScale) => {
    // 获取原始坐标的 x 和 y 值
    const x = originalCoordinates.x;
    const y = originalCoordinates.y;

    // 计算新的坐标
    const newX = x + (newScale - 1) * x;
    const newY = y + (newScale - 1) * y;

    // 返回新的坐标
    return { x: newX, y: newY };
}
// 防抖函数
_.debounce = (func, wait) => {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

export default _;