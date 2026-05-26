---
title: C++ 基本数据类型入门
date: 2026-05-26 17:10:00
tags:
  - C++
  - 基础语法
categories:
  - C++ 学习
comments: true
---

C++ 的基本数据类型是后续学习变量、函数、类和 STL 的基础。刚开始学时，最容易混淆的是“这个类型到底存什么、占多少、什么时候该用它”。

这篇先把最常见的几类梳理清楚。

## 整型

整型用来表示整数，不带小数部分。

常见类型有：

- `short`
- `int`
- `long`
- `long long`

它们的主要区别是表示范围不同。通常来说，范围越大的类型，占用的字节也越多。

```cpp
#include <iostream>
using namespace std;

int main() {
    int age = 18;
    long long population = 8000000000;

    cout << age << endl;
    cout << population << endl;
    return 0;
}
```

如果只存普通整数，最常用的是 `int`。

## 浮点型

浮点型用来表示带小数的数字。

常见类型有：

- `float`
- `double`
- `long double`

通常开发中更常见的是 `double`，因为精度更高。

```cpp
double price = 19.99;
float score = 95.5f;
```

要注意 `float` 字面量后面经常要加 `f`，否则默认会被当成 `double`。

## 字符型

字符型使用 `char`，通常用来存单个字符。

```cpp
char grade = 'A';
char ch = 'x';
```

这里必须用单引号。  
如果写成双引号，比如 `"A"`，那表示的是字符串，不是单个字符。

## 布尔型

布尔型使用 `bool`，只有两个值：

- `true`
- `false`

它通常用于条件判断。

```cpp
bool isPassed = true;

if (isPassed) {
    cout << "考试通过" << endl;
}
```

## 无符号类型

前面这些整型默认都是“有符号”的，也就是既能表示正数，也能表示负数。

如果明确只需要非负整数，可以使用 `unsigned`。

```cpp
unsigned int count = 100;
```

这样能把全部表示范围都用于非负数，但要注意和有符号类型混用时容易出现比较问题。

## 类型转换

不同类型之间可以互相转换，但有时会丢失信息。

```cpp
double x = 3.14;
int y = (int)x;
```

此时 `y` 的值会变成 `3`，小数部分会被截断。

更推荐使用 C++ 风格转换：

```cpp
int y = static_cast<int>(x);
```

这样表达更明确，也更安全一些。

## sizeof 的用法

如果想知道某个类型在当前环境下占多少字节，可以用 `sizeof`。

```cpp
cout << sizeof(int) << endl;
cout << sizeof(double) << endl;
cout << sizeof(char) << endl;
```

不同平台、不同编译器下，某些类型的大小可能会有差异，所以不要死记硬背所有字节数，更重要的是理解它们的用途。

## 一点使用建议

刚开始写程序时，可以先这样记：

- 普通整数优先用 `int`
- 小数优先用 `double`
- 单个字符用 `char`
- 条件真假用 `bool`

先把“场景”和“类型”对应起来，比一开始纠结底层细节更重要。

## 小结

C++ 基本数据类型并不复杂，重点是先搞清楚：

1. 这个类型存什么
2. 它和相近类型的区别是什么
3. 在实际代码里最常见的选择是什么

把这些基础打稳，后面学数组、指针、引用、类时会顺很多。
