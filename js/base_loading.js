//获取浏览器页面可见高度和宽度
var _PageHeight = document.documentElement.clientHeight;

//计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0;
var html = document.documentElement
html.setAttribute('style', 'overflowY:hidden;overflow:hidden;height:' + _PageHeight + 'px;')
//在页面未加载完毕之前显示的loading Html自定义内容
var _LoadingHtml = '<div id="loadingDiv" style="height: 100%;display: flex;justify-content: center;align-items: center;left: 0;top: 0;position:fixed;left:0;width:100%;height:' + _PageHeight + 'px;top:0;background:#efeff4;opacity:1;filter:alpha(opacity=80);z-index:10000;"><div id="box" style=" cursor1: wait; text-align: center; top:' + _LoadingTop + 'px; color: #696969; font-family:\'Microsoft YaHei\';    line-height: 1.5;border-radius: 5px; padding: 15px 15px; background-color: rgba(58, 58, 58, 0.9);"><div style=""><svg id="loading" style="width:35px; -webkit-animation: loading_save 1s linear infinite;animation: loading_save 1s linear infinite;" viewBox="0 -2 59.75 60.25" width="100%" height="100%"><path fill="#ccc" d="M29.69-.527C14.044-.527 1.36 12.158 1.36 27.806S14.043 56.14 29.69 56.14c15.65 0 28.334-12.686 28.334-28.334S45.34-.527 29.69-.527zm.185 53.75c-14.037 0-25.417-11.38-25.417-25.417S15.838 2.39 29.875 2.39s25.417 11.38 25.417 25.417-11.38 25.416-25.417 25.416z"></path><path fill="none" stroke="#108ee9" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" d="M56.587 29.766c.37-7.438-1.658-14.7-6.393-19.552"></path></svg></img></div><div style="font-size:15px; color:#fff">努力加载中...</div></div></div>';
//呈现loading效果
document.write(_LoadingHtml);

//window.onload = function () {
//    var loadingMask = document.getElementById('loadingDiv');
//    loadingMask.parentNode.removeChild(loadingMask);
//};

//监听加载状态改变
document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function completeLoading() {
    if (document.readyState == "interactive") {//当页面状态为interactive 才能获取到body元素
        //解决移动端还可以下滑页面 出现滚动条
        document.body.setAttribute('style', 'overflowY:hidden;overflow:hidden;height:' + _PageHeight + 'px;')

    }
    if (document.readyState == "complete") {
        var loadingMask = document.getElementById('loadingDiv');
        document.body.setAttribute('style', 'overflowY:unset;overflow:unset;height:unset;')
        html.setAttribute('style', 'overflowY:unset;overflow:unset;height:unset;')
        loadingMask.parentNode.removeChild(loadingMask);
    }
}
