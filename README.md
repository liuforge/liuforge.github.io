# 刘俊言个人主页

这是基于 Quarto 的个人主页源码。仓库维护一份内容，发布两份产物：

- GitHub Pages：渲染到 `docs/` 后推送到个人 GitHub 仓库。
- deploy 服务器：同步 `docs/` 到服务器上的独立目录，用作预览或备用站点。

## 本地构建

```bash
quarto render
```

当前本机可用的 Quarto 路径：

```bash
/Users/liujunyan/.local/quarto-1.9.38/bin/quarto render
```

## 内容结构

- `index.qmd`：首页，包含照片、书写板、教育背景、实习经历和项目鱼骨时间轴。
- `projects.qmd`：项目总览页。
- `projects/`：项目独立详情页。
- `internships/`：实习独立详情页。
- `styles.scss`：站点样式。
- `docs/`：GitHub Pages 发布产物。
