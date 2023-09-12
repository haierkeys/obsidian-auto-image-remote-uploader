[English Document](README.md)

# Auto Image Remote Uploader For Obsidian

为 Obsidian 增加图片远端上传保存功能,主要特性:

- 拖拽图片上传
- 粘贴图片上传
- 右键图片上传
- 批量下载网络图片到本地
- 批量上传笔记中的所有本地图像文件
- 笔记的图片上传到远端服务器上,例如您的web服务器或者你家庭的NAS上
- 可以选择同时同步到云存储上, 例如:阿里云OSS / AWS S3 / Google ECS
## 价格

本插件是免费提供给大家的，但如果您想表示感谢或帮助支持继续开发，请随时通过以下任一方式为我提供一点帮助：

- [![Paypal](https://img.shields.io/badge/paypal-HaierSpi-yellow?style=social&logo=paypal)](https://paypal.me/haierspi)

- [<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="BuyMeACoffee" width="100">](https://www.buymeacoffee.com/haierspi)
<img src="https://raw.githubusercontent.com/haierspi/obsidian-auto-image-remote-uploader/main/bmc_qr.png" style="width:120px;height:auto;">


- 爱发电 https://afdian.net/a/haierspi

# 开始使用

1. 安装插件
2. 打开插件配置项，将 **图片上传API** 设置为您的图片上传API`http://127.0.0.1:8000/api/upload`,并设置**授权令牌**
3. 启动 **golang-image-upload-service** 服务
4. 接下来打开看能否上传成功

## 图片上传API服务端

本插件需要配合**golang-image-upload-service** https://github.com/haierspi/golang-image-upload-service 才能正常使用

# 使用帮助

## 剪切板上传

支持黏贴剪切板的图片的时候直接上传，目前支持复制系统内图像直接上传。
支持通过设置 `frontmatter` 来控制单个文件的上传，默认值为 `true`，控制关闭请将该值设置为 `false`

支持 ".png", ".jpg", ".jpeg", ".bmp", ".gif", ".svg", ".tiff"

```yaml
---
image-auto-upload: true
---
```

## 批量上传一个文件中的所有图像文件

输入 `ctrl+P` 呼出面板，输入 `upload all images`，点击回车，就会自动开始上传。

路径解析优先级，会依次按照优先级查找：

1. 绝对路径，指基于库的绝对路径
2. 相对路径，以./或../开头
3. 尽可能简短的形式

## 批量下载网络图片到本地

输入 `ctrl+P` 呼出面板，输入 `download all images`，点击回车，就会自动开始下载。

## 支持右键菜单上传图片

目前已支持标准 md 以及 wiki 格式。支持相对路径以及绝对路径，需要进行正确设置，不然会引发奇怪的问题。

## 支持拖拽上传
支持图片的各种拖拽

## 感谢

https://github.com/renmu123/obsidian-image-auto-upload-plugin