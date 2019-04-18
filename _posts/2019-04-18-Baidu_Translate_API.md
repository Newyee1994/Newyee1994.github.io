---
layout:       post
title:        "Python 小工具：调用「百度翻译 API」实现英汉互译及多语言翻译"
subtitle:     "同步 CSDN 博文"
date:         2019-04-18 22:05:00 +0800
author:       "Newyee"
header-img:   "img/for-post/20190418-bg.jpg"
header-mask:  0.4
catalog:      true
tags:
    - Python
    - 爬虫
    - 博文
    - Selenium
---

>官方 Demo 是 Python 2 版本的，笔者基于 Python 3 实现，并简化请求翻译结果的过程、扩展功能

前段时间写的小脚本，得空整理一下和大家交流学习

## API 简介
- **什么是百度翻译开放平台？**
百度翻译开放平台是百度翻译面向广大开发者提供开放服务的平台。服务涵盖：通用翻译API、定制化翻译API、语音翻译SDK、拍照翻译SDK等，并持续更新中。
- **通用翻译 API**
通用翻译API支持28种语言互译，覆盖中、英、日、韩、西、法、泰、阿、俄、葡、德、意、荷、芬、丹等；支持28种语言的语种检测。您只需调用通用翻译API，传入待翻译的内容，并指定要翻译的源语言（支持源语言语种自动检测）和目标语言，即可得到相应的翻译结果。任何第三方应用或网站都可以通过使用通用翻译API为用户提供实时优质的多语言翻译服务，提升产品体验。
- **语种识别 API**
语种识别API可识别给出文本的语种，并返回识别结果。首批支持中文、英语、日语、韩语、泰语、越南语等六个语种的语种识别。
>摘自官网介绍，官网还有更多高级（shou fei）功能的介绍，[可移步了解详情 &rarr; ](http://api.fanyi.baidu.com/api/trans/product/apidoc/)

## 过程详解
> 通用翻译 API 采用全流程自助申请的模式：
> &nbsp; &nbsp; 点击网站上方的“登录”按钮，以百度账号登录平台；
> &nbsp; &nbsp; 在产品服务页面点击“立即使用”，按照页面提示信息注册成为开发者，即可获得APPID和密钥信息。

- 首先需要去[百度翻译开放平台](http://api.fanyi.baidu.com/api/trans/product/index)注册为开发者、申请 **通用翻译 API** 的 **API Key**。
- 通过 HTTP 接口调用通用翻译 API，传入待翻译的内容，并指定要翻译的源语言和目标语言种类，就可以得到相应的翻译结果。
- 向通用翻译 API HTTP 地址：http://api.fanyi.baidu.com/api/trans/vip/translate 通过POST或GET方法发送下列字段即可访问服务：
![字段](https://img-blog.csdnimg.cn/20190418153608239.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05ld3llZQ==,size_16,color_FFFFFF,t_70)
- 语言列表：（源语言语种不确定时可设置为 auto，目标语言语种不可设置为 auto）
![语言列表](https://img-blog.csdnimg.cn/20190418160439888.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05ld3llZQ==,size_16,color_FFFFFF,t_70)
- 其中， `sign` 是使用 MD5 算法生成的一段长度为 32位的字符串，具体方法如下：
  - 1.准备好请求参数中的 appid、q、salt 以及平台分配的密钥；
  - 2.按照 `appid+q+salt+密钥` 的顺序拼接得到字符串1；
  - 3.对字符串1计算 MD5 值即可得到32位小写的 `sign`。
- 返回结果是json格式，包含以下字段：（其中 trans_result 包含了 src 和 dst 字段）

| 字段名       | 类型         | 描述        |
|:-----------:|:-------------:|:-------------:|
| from| TEXT| 翻译源语言
| to| TEXT| 译文语言
| trans_result| MIXED LIST| 翻译结果
| src| TEXT| 原文
| `dst`| `TEXT`| `译文`

&nbsp; &nbsp; 例如：
```python
		{
		    "from":"en",
		    "to":"zh",
		    "trans_result":[
		        {
		            "src":"apple",
		            "dst":"苹果"
		        }
		    ]
		}
```
&nbsp; &nbsp; 只要取出 `dst` 键对应的值即是翻译结果。

## 完整代码
```python
"""
调用「百度翻译 API」实现英汉互译及多语言翻译
@Author: Newyee
@Python: 3.6.5
@Create: 2019-04-18
"""
# 导入相关模块
import hashlib
import random
import requests


# 你的APP ID
appID = 'xxx'
# 你的密钥
secretKey = 'xxx'
# 百度翻译 API 的 HTTP 接口
apiURL = 'http://api.fanyi.baidu.com/api/trans/vip/translate'


def baiduAPI_translate(query_str, to_lang):
    '''
    传入待翻译的字符串和目标语言类型，请求 apiURL，自动检测传入的语言类型获得翻译结果
    :param query_str: 待翻译的字符串
    :param to_lang: 目标语言类型
    :return: 翻译结果字典
    '''
    # 生成随机的 salt 值
    salt = str(random.randint(32768, 65536))
    # 准备计算 sign 值需要的字符串
    pre_sign = appID + query_str + salt + secretKey
    # 计算 md5 生成 sign
    sign = hashlib.md5(pre_sign.encode()).hexdigest()
    # 请求 apiURL 所有需要的参数
    params = {
        'q': query_str,
        'from': 'auto',
        'to': to_lang,
        'appid': appID,
        'salt':salt,
        'sign': sign
    }
    try:
        # 直接将 params 和 apiURL 一起传入 requests.get() 函数
        response = requests.get(apiURL, params=params)
        # 获取返回的 json 数据
        result_dict = response.json()
        # 得到的结果正常则 return
        if 'trans_result' in result_dict:
            return result_dict
        else:
            print('Some errors occured:\n', result_dict)
    except Exception as e:
        print('Some errors occured: ', e)


def baiduAPI_translate_main(query_str, dst_lang=''):
    '''
    解析翻译结果后输出，默认实现英汉互译
    :param query_str: 待翻译的字符串，必填
    :param dst_lang: 目标语言类型，可缺省
    :return: 翻译后的字符串
    '''
    if dst_lang:
        # 指定了目标语言类型，则直接翻译成指定语言
        result_dict = baiduAPI_translate(query_str, dst_lang)
    else:
        # 未指定目标语言类型，则默认进行英汉互译
        result_dict = baiduAPI_translate(query_str, 'zh')
        if result_dict['from'] == 'zh':
            result_dict = baiduAPI_translate(query_str, 'en')
    # 提取翻译结果字符串，并输出返回
    dst = result_dict['trans_result'][0]['dst']
    print('{}: {} -> {}: {}'.format(result_dict['from'], query_str, result_dict['to'], dst))
    return dst


if __name__ == '__main__':
    baiduAPI_translate_main('This is English.')
    baiduAPI_translate_main('这是中文')
    baiduAPI_translate_main('翻译成法语', 'fra')

```
## 结果展示
![输出结果](https://img-blog.csdnimg.cn/20190418172950330.png)

###  附：官方 Demo - Python 2 版本
```python
#/usr/bin/env python
#coding=utf8
 
import httplib
import md5
import urllib
import random

appid = '' #你的appid
secretKey = '' #你的密钥

 
httpClient = None
myurl = '/api/trans/vip/translate'
q = 'apple'
fromLang = 'en'
toLang = 'zh'
salt = random.randint(32768, 65536)

sign = appid+q+str(salt)+secretKey
m1 = md5.new()
m1.update(sign)
sign = m1.hexdigest()
myurl = myurl+'?appid='+appid+'&q='+urllib.quote(q)+'&from='+fromLang+'&to='+toLang+'&salt='+str(salt)+'&sign='+sign
 
try:
    httpClient = httplib.HTTPConnection('api.fanyi.baidu.com')
    httpClient.request('GET', myurl)
 
    #response是HTTPResponse对象
    response = httpClient.getresponse()
    print response.read()
except Exception, e:
    print e
finally:
    if httpClient:
        httpClient.close()
```


