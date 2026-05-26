---
title: C++ 类的基本概念
date: 2026-05-26 17:20:00
tags:
  - C++
  - 面向对象
categories:
  - C++ 学习
comments: true
---

学 C++ 时，类是一个绕不过去的核心概念。

如果前面的变量、函数是在学习“怎么写零散功能”，那类就是在学习“怎么把数据和行为组织起来”。

## 什么是类

可以先把类理解成一种“自定义类型的模板”。

比如，现实里有“学生”这个对象。一个学生有：

- 姓名
- 年龄
- 学号

同时还有一些行为，比如：

- 介绍自己
- 修改年龄

在 C++ 里，这些数据和行为就可以放进一个类里。

```cpp
#include <iostream>
#include <string>
using namespace std;

class Student {
public:
    string name;
    int age;

    void introduce() {
        cout << "我叫 " << name << "，今年 " << age << " 岁。" << endl;
    }
};
```

这里 `Student` 就是一个类。

## 对象是什么

类只是“设计图”，真正创建出来的具体实例叫对象。

```cpp
Student s1;
s1.name = "Tom";
s1.age = 20;
s1.introduce();
```

这里：

- `Student` 是类
- `s1` 是对象

可以把类看成模具，把对象看成模具做出来的成品。

## 成员变量和成员函数

类里的变量叫成员变量，类里的函数叫成员函数。

上面的例子里：

- `name`、`age` 是成员变量
- `introduce()` 是成员函数

成员变量负责描述对象的状态，成员函数负责定义对象能做什么。

## public 和 private

类里最常见的访问控制有两个：

- `public`
- `private`

`public` 表示类外部可以直接访问。  
`private` 表示只能在类内部访问。

```cpp
class Student {
private:
    int age;

public:
    void setAge(int a) {
        age = a;
    }

    int getAge() {
        return age;
    }
};
```

这样做的好处是，外部不能随便乱改数据，类自己可以控制赋值逻辑。

这就是封装的基础思想。

## 构造函数

构造函数是在创建对象时自动调用的函数，通常用于初始化对象。

构造函数名字和类名相同，并且没有返回值。

```cpp
class Student {
public:
    string name;
    int age;

    Student(string n, int a) {
        name = n;
        age = a;
    }
};
```

使用时：

```cpp
Student s1("Alice", 21);
```

这样对象一创建，就带着初始值了。

## this 的作用

在成员函数中，`this` 指向当前对象本身。

当成员变量和参数同名时，`this` 很常见。

```cpp
class Student {
public:
    string name;

    void setName(string name) {
        this->name = name;
    }
};
```

这里左边的 `name` 是成员变量，右边的 `name` 是函数参数。

## 类和结构体的区别

在 C++ 里，`struct` 和 `class` 很像。

最主要的区别是默认访问权限不同：

- `struct` 默认是 `public`
- `class` 默认是 `private`

所以在偏面向对象的代码里，更常用 `class`。

## 一个完整的小例子

```cpp
#include <iostream>
#include <string>
using namespace std;

class Book {
private:
    string title;
    double price;

public:
    Book(string t, double p) {
        title = t;
        price = p;
    }

    void printInfo() {
        cout << "书名: " << title << ", 价格: " << price << endl;
    }
};

int main() {
    Book b1("C++ Primer", 88.5);
    b1.printInfo();
    return 0;
}
```

这个例子里，`Book` 把书的数据和显示信息的行为放在了一起。

## 小结

刚开始学类时，建议先牢牢记住这几个点：

1. 类是模板，对象是实例
2. 成员变量描述状态
3. 成员函数描述行为
4. `public` 和 `private` 控制访问权限
5. 构造函数负责初始化

把这几块理解清楚，后面再继续学继承、多态、拷贝构造、运算符重载时就不会太乱。
