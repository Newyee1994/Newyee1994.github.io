---
layout:       post_multi4
title:        "Python 爬取《查理九世》"
subtitle:     "Python帮女朋友畅快看小说"
date:         2019-03-31 21:09:00
author:       "Newyee"
header-img:   "img/for-post/20190331-bg.jpg"
header-mask:  0.1
catalog:      true
multilingual: true
tags:
    - Python
    - 爬虫
    - 原宝专属
---

<p>注意：<strong>&uarr;&uarr; </strong>下拉选项只有<strong>『前两个可用』</strong>！</p>
- - - - -


<!-- Book No.0 -->
<div class="zh post-container">
    {% capture about_zh %}{% include posts/Novel_ChaLiJiuShi/2019-03-31-ChaLiJiuShiZhiYouLingBinGuan.markdown %}{% endcapture %}
    {{ about_zh | markdownify }}
</div>

<!-- Book No.1 -->
<div class="en post-container">
    {% capture about_en %}{% include posts/Novel_ChaLiJiuShi/2019-03-31-ChaLiJiuShiZhiWuShan.markdown %}{% endcapture %}
    {{ about_en | markdownify }}
</div>

<!-- Book No.2 -->
<div class="jp post-container">
    {% capture about_jp %}{% include posts/Novel_ChaLiJiuShi/2019-03-31-ChaLiJiuShiZhiMuSeSenLin.markdown %}{% endcapture %}
    {{ about_jp | markdownify }}
</div>

<!-- Book No.3 -->
<div class="fra post-container">
    {% capture about_fra %}{% include posts/Novel_ChaLiJiuShi/2019-03-31-ChaLiJiuShiJueDiFanJi.markdown %}{% endcapture %}
    {{ about_fra | markdownify }}
</div>

<br><br>
- - - - -
## 后记
> 这是一个失败的项目。。。<br>
> 吾对前端的知识了解甚少，想增加下拉菜单来展示分册的内容，然而只能替换2个模板中的语言选择功能实现两册内容的阅读。。。只修改 HTML 代码是不够的，应该还涉及到 js 等代码，以后再学习琢磨吧 :(<br>
> 文本的下载比较简单，依次抓取解析 book_urls、chapter_urls 和 content 即可，然而 [查理九世](http://www.chalijiushi.cn) 这个网站好像是「挂羊头卖狗肉」，展示的书名是正确的，而章节名和实际内容喝对应的那册书都对不上，而且格式还比较乱，下载好只保留了四册的内容，代码也就不贴了，下回有空还是整理一下爬取「起点中文网」的代码展示吧 :)<br>
