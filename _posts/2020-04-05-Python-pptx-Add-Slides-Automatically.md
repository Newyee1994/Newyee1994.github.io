---
layout:       post
title:        "Python 自动化：python-pptx 批量生成幻灯片"
subtitle:     "同步 CSDN 博文"
date:         2020-04-05 22:50:00 +0800
header-img:   "img/for-post/20200405-bg.jpg"
header-mask:  0.5
author:       "Newyee"
catalog:      true
tags:
    - Python
    - 办公自动化
    - 博文
---

## 需求分析
最近遇到了制作 PPT 报告的任务，前期收集整理后的表格数据长这样：
![Excel 数据](https://img-blog.csdnimg.cn/20200405200937688.png#pic_center)
随后要基于上述数据制作 PPT 报告，几十页的幻灯片都是下图的格式：![幻灯片示例1](https://img-blog.csdnimg.cn/20200405202042970.png#pic_center =700x550)
> Well, my coding fingers got quite itchy.

这种繁琐的手动制作幻灯片还是交给 Python 来自动完成吧！Python 中已有第三方库很好地支持 PowerPoint :point_down:

## python-pptx 介绍
```python-pptx```是用于创建和更新 **PowerPoint**（.pptx）文件的 Python 库。

其**用途**大致如下：
 - 典型的是从数据库内容生成自定义的可用于演示的工程状态报告，可通过单击 Web 应用程序中的链接下载该演示文稿。
 - 用于对演示文稿库进行批量更新。
 - 自动化制作对于人工操作繁琐的幻灯片。

由于开发团队的辛勤维护，目前已具有以下**功能**：
1. 打开、读取、创建、保存演示文稿（.pptx文件）
2. 添加幻灯片
3. 填充文本占位符，例如创建项目符号幻灯片
4. 添加图像并调整位置和尺寸
5. 添加文本框并调整文本的字体、大小和粗体
6. 添加表格
7. 添加形状，如多边形、流程图形状等
8. 添加图表，如柱形图、条形图、折线图和饼图等
9. 访问和修改元素属性，例如标题、主题等
10. ……（更多功能开发ing）

## python-pptx 安装
python-pptx 托管在 PyPI 上，可以很方便地用 pip 安装：
```python
pip install python-pptx
```
- 支持 Python 2.6, 2.7, 3.3, 3.4, 3.6（测试 3.7 能正常安装和简单使用，是否会有使用异常尚未知）本文代码运行环境为 Python 3.6。
- 依赖库会自动安装：lxml、Pillow、XlsxWriter

## Hello World! 示例
成功安装后，运行以下示例代码，体验一下效果：
```python
# 导包
from pptx import Presentation

# 创建空白演示文稿
prs = Presentation()
# 添加标题布局的幻灯片
title_slide_layout = prs.slide_layouts[0]
slide = prs.slides.add_slide(title_slide_layout)
# 设置标题和副标题
title = slide.shapes.title
subtitle = slide.placeholders[1]
title.text = "Hello, World!"
subtitle.text = "python-pptx was here!"
# 保存
prs.save('test.pptx')
```
![Hello World](https://img-blog.csdnimg.cn/20200405215019645.png#pic_center)
更多用例请移步[Getting Started](https://python-pptx.readthedocs.io/en/latest/user/quickstart.html)[^1]
>后面有空我也会整理一下学习 python-pptx 的代码笔记

[^1]: [Python-pptx 官方文档](https://python-pptx.readthedocs.io/en/latest/user/quickstart.html)

## 需求实现
有了 python-pptx 的加持，要实现文章一开始的需求就容易多了，简单分为以下几步：
1. 读取 Excel 数据（并预处理）—— 本例使用 ```pandas```库读取 ```news.xlsx```文件
2. 创建空白演示文稿（并添加封面幻灯片）
3. 依据数据循环添加幻灯片并设置文本格式（这一步是重点也是难点，详细说明参考代码注释）
4. 保存演示文稿

```python
# !/usr/bin/env python
# -*- coding: utf-8 -*-

from pptx import Presentation
from pptx.util import Pt
from pptx.enum.text import MSO_AUTO_SIZE
import pandas as pd


class WritePowerPoint:
    def __init__(self, ppt_name, input_excel, title_cover, subtitle):
        self.ppt_name = ppt_name
        self.input_excel = input_excel
        self.title_cover = self.title_per_page = title_cover
        self.subtitle_cover = subtitle
        # 创建空白演示文稿
        self.prs = Presentation()

    def add_cover(self):
        # 添加封面布局幻灯片
        slide_layout_cover = self.prs.slide_layouts[0]
        slide = self.prs.slides.add_slide(slide_layout_cover)
        # 设置标题和副标题
        title = slide.shapes.title
        subtitle = slide.placeholders[1]
        title.text = self.title_cover
        subtitle.text = self.subtitle_cover

    def add_slide(self, line2_texts):
        # 添加布局5幻灯片
        slide_layout = self.prs.slide_layouts[5]
        slide = self.prs.slides.add_slide(slide_layout)
        shapes = slide.shapes
        # 设置标题：内容、位置、字体、大小等格式
        title_shape = shapes.title
        title_shape.text = self.title_per_page
        title_shape.left, title_shape.top = Pt(32), Pt(22)
        title_shape.width, title_shape.height = Pt(660), Pt(50)
        tf0 = title_shape.text_frame
        p0 = tf0.paragraphs[0]
        p0.font.name = '微软雅黑'
        p0.font.size = Pt(24)
        # 添加文本框
        left, top, width, height = Pt(32), Pt(82), Pt(665), Pt(396)
        text_box = slide.shapes.add_textbox(left, top, width, height)
        tf = text_box.text_frame
        # 自动换行
        tf.word_wrap = True
        # 自动调整大小以适应文本
        tf.auto_size = MSO_AUTO_SIZE.SHAPE_TO_FIT_TEXT

        def add_paragraph_texts(texts):
            print(texts[0])
            for i, text in enumerate(texts[:-1]):       # 最后的网址作为超链接
                p = tf.add_paragraph()
                p.text = text
                if i == len(texts) - 2:
                    run = p.add_run()
                    run.text = '查看更多'
                    run.hyperlink.address = texts[-1]   # 写入超链接
                    tf.add_paragraph()

        # 在文本框中添加内容
        for lst in line2_texts:
            add_paragraph_texts(lst)

    def run(self):
        # 读取 Excel 数据并进行预处理
        df = pd.read_excel(self.input_excel)
        df['发布机构'] = '发布机构：' + df['发布机构']
        df['发布时间'] = '发布时间：' + df['发布时间']
        df['关键词'] = '关键词：' + df['关键词']

        # 添加封面幻灯片
        self.add_cover()
        # 添加重复格式的幻灯片，每页写 2 条数据
        for i in df.index[::2]:
            self.add_slide([df.loc[i, :].tolist(), df.loc[i+1, :].tolist()])

        # 保存
        self.prs.save(self.ppt_name)


if __name__ == '__main__':
    wpt = WritePowerPoint('news.pptx', 'news.xlsx', 'News Briefs', '2020/4/5')
    wpt.run()
```

代码运行后便可得到若干页的 ```news.pptx```：
![运行结果1](https://img-blog.csdnimg.cn/20200405215321432.png#pic_center)
![运行结果2](https://img-blog.csdnimg.cn/20200405214749346.png#pic_center)

代码中还可以加入更多的文本格式设置代码，美化幻灯片：![幻灯片示例2](https://img-blog.csdnimg.cn/2020040521355628.png#pic_center =700x550)
