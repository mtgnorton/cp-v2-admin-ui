## 该项目为cp-v2项目管理后台的前端
路由转发配置修改vue.config.js
## 开发

```bash
# 克隆项目
git clone https://github.com/mtgnorton/cp-v2-admin-ui

# 进入项目目录
cd cp-v2-admin-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 替换vue.config.js第35行的地址为自己的后端地址

# 启动服务
npm run dev
```

浏览器访问 http://localhost:8090

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```