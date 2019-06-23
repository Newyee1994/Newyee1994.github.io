---
layout:       post
title:        "Python 数据可视化：【拉勾网】职位信息数据分析与可视化绘图"
subtitle:     "同步 CSDN 博文"
date:         2019-06-23 22:50:00 +0800
header-img:   "img/for-post/20190623-bg.jpg"
header-mask:  0.3
author:       "Newyee"
catalog:      true
tags:
    - Python
    - 数据可视化
    - 博文
---


笔者爬取了【拉勾网】17 个城市的 1600+ 个【数据分析】岗位进行分析并绘图展示，尝试探索该岗位当前市场状况。
> ps.目标城市主要挑选的是排名靠前的互联网城市，剔除了个别职位数只有一两个的城市。
![新一线城市互联网生态指数](https://img-blog.csdnimg.cn/20190617102653430.png)

## 数据摘要
```python
import pandas as pd

df_all = pd.read_csv(file, encoding='utf-8')
print(df_all.info())
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 1689 entries, 0 to 1688
    Data columns (total 20 columns):
    position_id             1689 non-null int64
    position_name           1689 non-null object
    salary                  1689 non-null object
    work_year               1689 non-null object
    education               1689 non-null object
    job_nature              1689 non-null object
    city                    1689 non-null object
    district                1689 non-null object
    work_addr               1689 non-null object
    position_advantage      1689 non-null object
    position_labels         1679 non-null object
    position_description    1689 non-null object
    company_short_name      1689 non-null object
    company_size            1689 non-null object
    industry_field          1689 non-null object
    finance_stage           1689 non-null object
    investment_agencies     424 non-null object
    company_full_name       1689 non-null object
    company_homepage        1689 non-null object
    company_inLaGou         1689 non-null object
    dtypes: int64(1), object(19)
    memory usage: 264.0+ KB



## 职位数量
```python
city_counts = df_all.city.value_counts()
print(city_counts[:10])
```
    上海    446
    北京    437
    深圳    291
    广州    182
    杭州    150
    成都     44
    武汉     38
    南京     24
    长沙     16
    西安     14
    Name: city, dtype: int64

使用 seaborn[^1] 绘制：
 [^1]: [seaborn 官网](https://seaborn.pydata.org/)

![各城市职位数量条形图-seaborn](https://img-blog.csdnimg.cn/20190617143030600.png#pic_center)
 使用 matplotlib[^2] 绘制：
 [^2]: [matplotlib 官网](http://matplotlib.org/)

![各城市职位数量条形图-plt](https://img-blog.csdnimg.cn/20190617143044258.png#pic_center)
 从条形图上可以很直观地观察到：
 - **北上广深杭**对于数据分析岗位的需求量远超其他城市，上海、北京尤甚；
 - 数据分析师如果选错了就业地点可能面临无业可就的风险。
 *[北上广深杭]:   北京、上海、广州、深圳、杭州

## 地图分布
![各城市职位数分布](https://img-blog.csdnimg.cn/20190622204945948.png#pic_center)


![上海各区职位数分布](https://img-blog.csdnimg.cn/20190622204955909.png#pic_center)
- 上海的数据分析岗位主要集中分布在**浦东新区**、**徐汇区**和**长宁区**，其他区的职位数较少。
## 工作经验
```python
print(work_year_sizes)
```
    不限       10.834813
    应届毕业生     5.032564
    1年以下      2.131439
    1-3年     28.478390
    3-5年     39.964476
    5-10年    13.380699
    10年以上     0.177620
    Name: work_year, dtype: float64

 使用 matplotlib 绘制：
![工作经验饼图-plt](https://img-blog.csdnimg.cn/20190617150928404.png#pic_center)
 使用 pyecharts[^3] 绘制：
 [^3]: [pyecharts 官网](https://github.com/pyecharts/pyecharts/)

![工作经验饼图-pyecharts](https://img-blog.csdnimg.cn/20190617152238423.png#pic_center)
由饼图可以看出：
- 数据分析岗位对于经验的要求主要集中在“**1-3年**”和“**3-5年**”；
- 对于“1年以下”和“10年以上”经验的需求非常小。


## 薪资分布
> 取薪资区间的中间值计算，如 **10k-14k** 记为 **12k**

```python
print(salary_dict)
```
    {'5k及以下': 104,
     '5k-10k': 231,
     '10k-25k': 1002,
     '25k-50k': 325,
     '50k以上': 27}

 使用 matplotlib 绘制：
![薪资分布饼图-plt](https://img-blog.csdnimg.cn/20190617154658530.png#pic_center)
 ![Top10城市-平均月薪分布图](https://img-blog.csdnimg.cn/20190617161157963.png#pic_center)
使用 pyecharts 绘制：
![薪资分布玫瑰图-pyecharts](https://img-blog.csdnimg.cn/20190617154625860.png#pic_center)

![Top10城市-平均月薪柱状图](https://img-blog.csdnimg.cn/20190617161234204.png#pic_center)
由此可见：
- 数据分析岗位的月薪多数分布在**10-25k**范围；
- **北京、深圳**平均月薪以**大于20k**超过平均水平。





## 学历要求
```python
print(education_pairs)
```
    [('学历不限', 0.05979869745411486),
     ('大专及以上', 0.06867969212551805),
     ('本科及以上', 0.8158673771462404),
     ('博士及以上', 0.0017761989342806395),
     ('硕士及以上', 0.053878034339846066)]

![学历要求饼图-pyecharts](https://img-blog.csdnimg.cn/20190617161718542.png#pic_center)
- 学历要求“**本科及以上**”占比超过80%！硕士博士占比不足10%。
- 学历要求没有想象得那么严格。

## 公司规模
```python
print(company_size_pairs)
```
    [('2000人以上', 571),
     ('500-2000人', 428),
     ('150-500人', 340),
     ('50-150人', 224),
     ('15-50人', 102),
     ('少于15人', 23),
     ('10-50人', 1)]

![公司规模-漏斗图](https://img-blog.csdnimg.cn/2019061716242821.png#pic_center)
- 基本上，规模越大的公司对数据分析师的需求也越大。


## 行业领域
![行业领域](https://img-blog.csdnimg.cn/20190617164646737.png#pic_center)
- 各行各业都设有数据分析岗位，**移动互联网**领域为最。

## 职位词云
### 职位标签
使用 wordcloud[^4] 绘制：
 [^4]: [wordcloud 官网](https://github.com/amueller/word_cloud)
 
![职位标签词云](https://img-blog.csdnimg.cn/20190617170858217.png#pic_center)
职位标签反应出了该岗位的特点：
- 数据分析岗位的关键词提及最多的自然是“数据分析”啦；
- 所属的行业领域也多有提及，如“移动互联网”、“金融”、“电商”等；
- 岗位的技术特点有“大数据”、“数据挖掘”、“数据运营”、“可视化”等；
- 技术工具则以“SQL”、“MySQL”、“SQLServer”、“BI”、“SPSS”、“Hadoop”等，“Python”也在其中、但频数很小。

### 职位诱惑
使用 pyecharts 绘制：
![职位诱惑词云](https://img-blog.csdnimg.cn/20190617170748205.png#pic_center)
职位诱惑多以基本福利频数最高，如“五险一金”、“六险一金”、“带薪年假”、“周末双休”、“年终奖”等。

## 薪资影响因素
下面的 ``Boxplot`` 展示了**薪资**分别与**学历要求**、**工作经验**、**公司规模**、**融资阶段**的关系：
![Salary Boxplot](https://img-blog.csdnimg.cn/20190622201552555.png#pic_center)
一般地，
- 学历越高，薪资越高，硕士的薪资中位数在20k左右；
- 工作经验越丰富，薪资越高，3-5年经验的薪资基本都有15-25k；
- 公司规模越大，给的薪水也相对比较高。
- 未融资及天使轮公司的薪资都比较低，应该是公司刚起步比较缺钱的缘故；经历A、B、C、D轮融资后的公司，给出的薪水依次提高；上市公司的薪资相对较高。


## 融资阶段

![融资阶段 极区图](https://img-blog.csdnimg.cn/20190622204625715.png#pic_center)
> 为这个图调试样式费了不少时间，特在此展示以作纪念。。。







