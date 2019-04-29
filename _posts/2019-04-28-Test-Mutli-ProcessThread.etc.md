---
layout:       post
title:        "Python 爬虫提速：【多进程、多线程、协程+异步】对比测试"
subtitle:     "同步 CSDN 博文"
date:         2019-04-28 23:30:00 +0800
author:       "Newyee"
header-img:   "img/for-post/20190428-bg.jpg"
header-mask:  0.5
catalog:      true
tags:
    - Python
    - 爬虫
    - 博文
    - 多进程
    - 多线程
    - 协程
    - 异步
---

## 概念介绍
首先简单介绍几个概念：
- **进程和线程**
  - **进程**就是一个程序在一个数据集上的一次动态执行过程（数据集是程序在执行过程中所需要使用的资源）。
  - **线程**也叫轻量级进程，它是一个基本的 CPU 执行单元，是比进程更小的能独立运行的基本单位。
  - **进程和线程的关系**：
    - 一个线程只能属于一个进程，而一个进程可以有多个线程，但至少有一个线程。
    - 资源分配给进程，同一进程的所有线程共享该进程的所有资源。
    - CPU 分给线程，即真正在 CPU 上运行的是线程。
- **并行和并发**
  - **并行处理**是计算机系统中能同时执行两个或更多个处理的一种计算方法。并行处理可同时工作于同一程序的不同方面，其主要目的是节省大型和复杂问题的解决时间。
  - **并发处理**指一个时间段中有几个程序都处于已启动运行到运行完毕之间，且这几个程序都是在同一个 CPU 上运行，但任一个时刻点上只有一个程序在 CPU 上运行。
  - 并发的关键是你有处理多个任务的能力，不一定要同时。并行的关键是你有同时处理多个任务的能力。所以说，**并行是并发的子集**。**多进程是并行的，多线程是并发的**。
- **同步和异步**
  - **同步**就是指一个进程在执行某个请求的时候，若该请求需要一段时间才能返回信息，那么这个进程将会一直等待下去，直到收到返回信息才继续执行下去。
  - **异步**是指进程不需要一直等下去，而是继续执行下面的操作，不管其他进程的状态。当有消息返回时系统会通知进程进行处理，这样可以提高执行的效率。
  - 举个例子，打电话时就是同步通信，发短息时就是异步通信。

## 测试环境
进行对比测试之前，我们先来创建一个合适的实验环境：<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**模拟一个需要等待一定时间才可以获取返回结果的网页。**<br>
如果直接用百度、CSDN 等站点的话，一方面响应太快、难以看出各种方法的差距，另一方面响应速度会受网速影响、每次发送请求获取响应所需的时间不完全一致导致重复实验结果差距较大，所以在此用 Flask 模拟一个本地慢速服务器。
`flask_server.py` 代码如下：
`flask_server.py` 代码如下：
```python
from flask import Flask     # pip install flask
import time

app = Flask(__name__)

@app.route('/')
def index():
    time.sleep(3)    	    # 休眠 3 秒再返回结果
    return 'Hello!'

if __name__ == '__main__':
    app.run(threaded=True)  # 以多线程模式启动服务
```
启动之后，Flask 服务默认在 `127.0.0.1:5000` 上运行，控制台输出结果如下：
```python
 * Serving Flask app "flask_server" (lazy loading)
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```
在浏览器中访问 `http://127.0.0.1:5000/` 等待 3 秒即会出现 Hello! 页面，表明简单的慢速服务器搭建完成！
![Hello!](https://img-blog.csdnimg.cn/20190428115845147.png)

## 开始测试
首先导入需要的模块，以请求 10 次为例准备 `urls`，再定义一个 `get_html_text()` 函数：
```python
import requests
import time
# 用于多进程
from multiprocessing import Process
# 用于多线程
from threading import Thread
# 用于协程+异步 
import asyncio
import aiohttp      # pip install aiohttp

urls = ['http://127.0.0.1:5000' for _ in range(10)]

def get_html_text(url):
    response = requests.get(url)
    return response.text
```

### 测试【单进程单线程】
```python
start = time.time()
for url in urls:
    result = get_html_text(url)
    print(result)
end = time.time()
print('【单进程单线程】耗时：%s 秒' %(end - start))
```
结果如下：

    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    【单进程单线程】耗时：30.15605854988098 秒
    

### 测试【多进程 并行】
```python
start = time.time()
processes = []
for url in urls:
    p = Process(target=get_html_text, args=(url,))
    processes.append(p)
    p.start()
for p in processes:
    p.join()
    print('Hello!')
end = time.time()
print('【多进程  并行】耗时：%s 秒' %(end - start))
```
结果如下（测试电脑为 4 核 CPU，核心数越大加速越明显）：

    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    【多进程  并行】耗时：5.511234283447266 秒
    

### 测试【多线程 并发】
```python
start = time.time()
threads = []
for url in urls:
    t = Thread(target=get_html_text, args=(url,))
    threads.append(t)
    t.start()
for t in threads:
    t.join()
    print('Hello!')
end = time.time()
print('【多线程  并发】耗时：%s 秒' %(end - start))
```
结果如下：

    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    【多线程  并发】耗时：3.030653953552246 秒
    

### 测试【协程 + 异步】
```python
# 因为 requests 模块不支持异步操作，需要借助 aiohttp 模块
async def get_html_text_async(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            text = await response.text()
            return text

start = time.time()
tasks = [asyncio.ensure_future(get_html_text_async(url)) for url in urls]
loop = asyncio.get_event_loop()
loop.run_until_complete(asyncio.wait(tasks))
for task in tasks:
    print(task.result())
end = time.time()
print('【协程 ++ 异步】耗时：%s 秒' %(end - start))
```
结果如下：

    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    Hello!
    【协程 ++ 异步】耗时：3.046288251876831 秒

## 结果对比
`len(urls)==1:`
![n=1](https://img-blog.csdnimg.cn/20190428132747667.png)
`len(urls)==4:`
![n=4](https://img-blog.csdnimg.cn/20190428120800721.png)
`len(urls)==10:`
![n=10](https://img-blog.csdnimg.cn/20190428120036243.png)
`len(urls)==100:`
![m=100](https://img-blog.csdnimg.cn/20190428131839210.png)
- **单进程单线程**是将 n 次请求顺次执行，每次要等待 3 秒才能返回结果，故耗时 `3n+` 秒；
- **多进程-并行处理**则利用 CPU 的多核优势，在同一时间并行地执行多个任务，可以大大提高执行效率，但系统实现多进程前需要一些准备工作、将耗费大量时间。
- **多线程-并发处理**和**协程+异步**的耗时由单进程单线程的 3n+ 秒变成了 3+  秒！
  - 前者是 n 个请求几乎同时进行、几乎同时得到响应返回结果。
  - 后者是每当请求任务遇到阻塞（`time.sleep(3)`）时被挂起，n 个任务都处于挂起状态后等待 3 秒，n 个请求几乎同时都有了响应，然后挂起的任务被唤醒接着执行，输出请求结果，最后耗时：3 秒！（多出来的时间是 IO 时延）


>注意：
>- 搭建的实验环境是慢速服务器，若不进行 time.sleep(3) 休眠 3 秒再返回 而是立即响应的话，单进程单线程的实际耗时则会大大缩短，请求次数少的话甚至会超过多进程。
>- 而且笔者在 Windows 4 核 CPU 环境下测试，最多开启 4 个进程，未能发挥多进程的真实实力。
>- 另外，多进程、多线程还可以通过进程池、线程池来实现，与文中方法耗时基本一致，故未做展示；多进程或多线程与协程异步IO结合的效率尚待测试。

## 绘图展示
![子图](https://img-blog.csdnimg.cn/20190429120739690.png)
![总图](https://img-blog.csdnimg.cn/20190429120802182.png)

---
