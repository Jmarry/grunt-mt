# grunt-mt
## 简单介绍
- 检查快速活动中custom标签的字段规范问题

## 安装
### 一、安装grunt命令行工具
    npm install -g grunt-cli
    ps:可能需要sudo权限
### 二、安装grunt
首先在你的项目根目录下创建一个名为package.json的文件，并且设置name、version和devDependencies等字段，例如：

    {
      "name": "your-project-name",
      "version": "1.0.0",
      "devDependencies": {
        "grunt": "~0.4.2"
      }
    }
然后在项目根目录下执行

    npm install --save-dev grunt
### 三、安装grunt-mt插件
同样在项目根目录下执行

    npm install --save-dev grunt-mt
## 使用
### 一、添加Gruntfile.js
在项目根目录下创建Gruntfile.js，进行插件加载和配置

    module.exports = function(grunt){

        grunt.initConfig({
            mt: {
                Config: {
                    options: {
                        path:'/src/tmall/'
                    }
                }
            },

        });

        //加载grunt-tap插件
        grunt.loadNpmTasks('grunt-mt');

        //注册一个默认任务
        grunt.registerTask('default', ['mt']);
    };
### 二、执行构建
在项目根目录下执行

    grunt
## grunt-mt配置
Config
用于基本配置，配置项：

- options:配置参数
    - path 执行目录