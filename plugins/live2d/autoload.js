try {
    $("<link>").attr({href: "/plugins/live2d/waifu.css", rel: "stylesheet", type: "text/css"}).appendTo('head');
    $('body').append('<div class="waifu"><div class="waifu-tips"></div><canvas id="live2d" class="live2d"></canvas><div class="waifu-tool"><span class="fui-home"></span> <span class="fui-chat"></span> <span class="fui-eye"></span> <span class="fui-user"></span> <span class="fui-photo"></span> <span class="fui-info-circle"></span> <span class="fui-cross"></span></div></div>');
    $.ajax({url: "/plugins/live2d/waifu-tips.js", dataType:"script", cache: true, success: function() {
        $.ajax({url: "/plugins/live2d/live2d.js", dataType:"script", cache: true, success: function() {
            /* 可直接修改部分参数 */
            live2d_settings['hitokotoAPI']     = "hitokoto.cn";                  // 一言 API
            live2d_settings['modelAPI']        = "//live2d.fghrsh.net/api/";     // 原作者或自建 API
            live2d_settings['modelId']         = 5;             // 默认模型 ID
            live2d_settings['modelTexturesId'] = 1;             // 默认材质 ID
            live2d_settings['modelStorage']    = true;         // 储存模型 ID
            /* 在 initModel 前添加 */
            initModel("/plugins/live2d/waifu-tips.json");
        }});
    }});
} catch(err) { console.log("[Error] JQuery is not defined.") }
