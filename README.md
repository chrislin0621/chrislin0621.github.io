# llinxiao.github.io · 个人学术主页草稿

这是一个零依赖、无需构建的静态网站。所有个人信息都使用明确的占位内容，没有沿用参考作者的姓名、照片、论文或经历。

**你可以先上传这份草稿，再直接在 GitHub 网页中逐项填写。无需现在提供个人资料，也不需要安装开发环境。** 唯一已填写的个人链接是你提供的 GitHub 账号 `chrislin0621`。

## 第一次发布：在 GitHub 网页完成

### 1. 新建独立仓库

在你的 GitHub 账号下新建名为 **`llinxiao.github.io`** 的 Public 仓库；如需让新仓库直接显示文件操作入口，可勾选添加 README。不要将这些主页文件放到 `CleanPose` 的代码仓库里。

**仓库名不等于独立域名。** GitHub Pages 的默认网址取决于账号名和仓库名：

| 账号名 | 仓库名 | 启用 Pages 后的默认地址 |
| --- | --- | --- |
| `chrislin0621`（你提供的账号） | `llinxiao.github.io` | `https://chrislin0621.github.io/llinxiao.github.io/` |
| `llinxiao`（仅当你实际使用此账号） | `llinxiao.github.io` | `https://llinxiao.github.io/` |

本模板使用相对路径，两种情况都能使用，不需要修改 CSS、图片和跳转路径。仅修改仓库名称，不能获得其他账号的 `github.io` 子域名。

### 2. 上传模板文件

1. 解压交付的 ZIP；如直接使用本地文件夹则无需解压。
2. 打开仓库，选择 **Add file → Upload files**。
3. 上传本目录**里面的文件和 `assets` 文件夹**，使 `index.html` 位于仓库根目录。不要把 ZIP 本身当成网站上传，也不要再套一层 `llinxiao.github.io/` 文件夹。
4. 同时保留 `.nojekyll`。macOS 中可按 `Command + Shift + .` 显示隐藏文件；也可在 GitHub 中用 **Add file → Create new file** 新建 `.nojekyll`，内容填写 `Static site` 即可。
5. 选择 **Commit changes**，提交到 `main` 分支。若仓库已有内容，不要覆盖不属于本模板的文件。

上传后，仓库根目录至少应直接显示 `index.html`、`news.html`、`site-data.js`、`assets/` 和 `.nojekyll`。

### 3. 启用 GitHub Pages

在仓库的 **Settings → Pages → Build and deployment** 中设置：

- **Source**：`Deploy from a branch`
- **Branch**：`main`
- **Folder**：`/ (root)`
- 点击 **Save**。

如果你使用了其他默认分支，选择实际存放模板文件的分支。等待部署完成，在 Pages 设置页点击站点访问地址；也可以在仓库 **Actions** 中查看 Pages 部署是否成功。GitHub 提示，推送后的发布可能需要最多约 10 分钟。

此模板不需要配置 Custom domain，不需要 `npm install`、Jekyll、GitHub Token 或额外的部署工作流。仓库和站点发布后可被他人访问，请只上传你希望公开的资料。

## 日常维护：改文件 → 提交 → 主页更新

1. 在 GitHub 仓库中打开 **`site-data.js`**，点击铅笔图标进入编辑。
2. 修改对应栏目内容，保留原有的英文引号、逗号和括号。各字段含义见后面的填写指南。
3. 点击 **Commit changes**，提交到配置为 Pages 发布源的分支（上述设置为 `main`）。如改到其他分支，需要合并回发布分支后才会更新网站。
4. 等待 Pages 部署完成，然后刷新主页。不是仅在编辑框输入就会发布，也无需每次重新上传整个站点。

| 想更新什么 | GitHub 中修改什么 |
| --- | --- |
| 姓名、机构、简介、研究方向 | `site-data.js` 的 `profile`、`about` |
| 添加一条新闻 | 在 `news` 数组添加条目；最新 4 条和 All news 归档会同步更新 |
| 添加论文 | 复制 `publications`、`preprints` 或 `technicalReports` 的一个条目 |
| 添加经历 | 复制 `experiences` 的一个条目，按从近到远排列 |
| 添加头像、论文配图或机构 Logo | 在 `assets/images/` 内上传图片，再在 `site-data.js` 中填写路径 |
| 上传 / 替换简历 | 在 `assets/` 内上传 PDF，将 CV 链接设为 `assets/cv.pdf` |
| 隐藏未填栏目 | 在 `sections` 中把对应开关改为 `false` |
| 去掉草稿提示 | 将 `site.draftMode` 改为 `false`，已填条目的 `placeholder` 改为 `false` |

图片和简历的文件名区分大小写。为了兼容仓库子路径，请使用 `assets/images/photo.jpg` 这样的相对路径，**不要写成 `/assets/images/photo.jpg`**。

## 预览

直接用浏览器打开 `index.html` 即可，`news.html` 是完整动态归档页。

也可以在本目录运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

然后打开 `http://127.0.0.1:8000`。按 `Ctrl+C` 停止服务。

## 建议的填写顺序

日常更新只需要编辑 **`site-data.js`**，不需要改 HTML 或 CSS。保存后刷新浏览器即可。

| 层次 | 数据字段 | 填写内容 |
| --- | --- | --- |
| 1. 个人信息 | `profile` | 中英文姓名、身份、机构、城市、照片、邮箱和社交链接 |
| 2. 自我介绍 | `about` | 个人简介、研究方向、可选的招生 / 求职 / 合作提示 |
| 3. 最新动态 | `news` | 日期与简短消息；主页自动显示最近 4 条 |
| 4. 研究成果 | `technicalReports`、`preprints`、`publications` | 技术报告、预印本和正式论文 |
| 5. 教育背景 | `education` | 学校、学位、时间、导师与校徽 |
| 6. 科研经历 | `experiences` | 职位、机构、时间、研究内容、导师与 Logo |
| 7. 学术服务 | `services` | 审稿、教学、学术活动等 |
| 8. 发布设置 | `site` | 网页标题、简介、语言、更新时间与草稿提示开关 |

### 1. 照片、Logo 和链接

将图片放进 `assets/images/`，然后填写相对路径。推荐使用英文文件名，不含空格。

```js
photo: "assets/images/portrait.jpg",
photoAlt: "你的姓名的个人照片",
```

论文配图使用 `image` / `imageAlt`，机构标志使用 `logo`；未填写图片或图片加载失败时，会保留占位图形。`initials` 是机构没有 Logo 时显示的简称。

链接留空时只显示不可点击的占位文字，不会跳转到错误页面。填写示例：

```js
{ label: "Email", icon: "mail", url: "mailto:yourname@example.com" },
{ label: "Google Scholar", icon: "scholar", url: "https://scholar.google.com/citations?user=YOUR_ID" },
{ label: "GitHub", icon: "github", url: "https://github.com/YOUR_USERNAME" },
{ label: "Curriculum Vitae", icon: "file", url: "assets/cv.pdf" },
```

CV 文件需要由你放入 `assets/`。本草稿未读取或复制工作目录里的任何个人简历。

### 2. 文字格式

简介段落、动态正文、作者列表和描述支持两种简单格式：

```js
"My research focuses on **spatial intelligence**.",
"I work with [导师姓名](https://example.com/).",
```

不支持任意 HTML；直接粘贴的 `<script>` 等内容会被当作普通文本处理。普通标题、姓名等字段仅显示纯文本。

`about.notice` 为空时不显示；可用来添加你自己的合作邀请、求职信息等。作者列表中的 `**你的姓名**` 会加粗并加下划线。

### 3. News 的最新四条和 All news

```js
{
  date: "2026-10-19",
  text: "在这里填写一条真实动态，也可以添加 [项目链接](https://example.com/).",
  placeholder: false,
},
```

- 日期使用 `YYYY-MM-DD`（也支持 `YYYY-MM`），月和日需要补零；页面显示年月，同月内仍按完整日期排序。
- 主页始终只取按日期倒序排列的前 **4** 条，不足 4 条时全部显示。
- **All news ↗** 进入独立的 `news.html`，显示全部动态并按年份分组，不是把主页列表无限展开。
- 添加新动态不需要删除旧动态；主页和归档共用同一个 `news` 数组。
- 示例日期仅用于演示排序。请用真实日期替换，并把该条的 `placeholder` 改成 `false`。

### 4. 论文与经历

复制对应数组中完整的 `{ ... }` 条目，并修改内容，即可增加论文或经历。相邻条目之间要保留英文逗号。

- 论文栏目保留「左侧配图，右侧标题、作者、发表信息、介绍、链接」的结构。
- 论文的 `note` 可填写 Oral、Spotlight 或获奖信息，不需要时留空。
- `education` 和 `experiences` 按你填写的数组顺序显示，请按从近到远排列。时间 `period` 是自由文本，支持 `Present`。
- Experiences 参考左右交替时间线：机构 Logo 和时间在上，职位及机构、研究内容、导师在下；手机上自动变为单侧时间线。
- `mentors`、`description`、`nameNative` 等可选内容留空即可省略。

### 5. 隐藏暂时没有内容的栏目

在 `sections` 中将对应开关设为 `false`，例如：

```js
technicalReports: false,
preprints: false,
```

正文和顶部导航会一起隐藏。把数组清空为 `[]` 也会隐藏对应栏目。`news.html` 会保留，因此隐藏 News 栏目不等于删除或保密归档内容。

### 6. 完成填写后

1. 用真实内容替换所有方括号和占位图片；把已填写条目的 `placeholder` 设为 `false`。
2. 将 `site.draftMode` 改成 `false`，隐藏草稿标记与编辑提示；未处理条目的「待填写」标签仍会保留，避免遗漏。
3. 更新 `site.title`、`site.description`、`site.lastUpdated`。中文为主可将 `site.language` 改为 `zh-CN`（不自动翻译栏目标题）。
4. 同步修改 `index.html` 和 `news.html` 的初始 `<title>`、description 和 Open Graph 信息。这些内容在浏览器中会由数据更新，但部分搜索 / 分享预览服务不会执行 JavaScript。
5. 检查邮箱、简历、论文和项目链接，确认已删除不希望公开的信息。

## 文件结构

```text
llinxiao.github.io/
├── index.html              主页入口
├── news.html               全部动态归档
├── site-data.js            你主要需要填写的内容
├── assets/
│   ├── main.js             共用渲染、导航与图片回退逻辑
│   ├── styles.css          样式、响应式布局和打印样式
│   └── images/
│       └── favicon.svg     通用书本图标；可替换
├── .nojekyll               直接发布静态文件
└── README.md
```

若需要改主题色，在 `assets/styles.css` 顶部修改 `--accent` 等变量即可。页面不依赖 CDN、网络字体、分析脚本或第三方组件。

## 发布范围

这里只准备本地草稿，不会自动创建仓库或上传个人信息。站点采用相对路径，可以放在域名根目录，也可以放在仓库子路径。静态托管时应上传本目录中的文件和 `assets/`，不要上传整个 `LIN` 工作目录。`.nojekyll` 已预留用于 GitHub Pages 静态发布。

## 常见问题

- **访问 404**：检查 Pages 是否已启用、部署是否成功、`index.html` 是否直接在发布目录下。使用 Pages 设置页显示的地址，不要凭仓库名猜测网址。
- **修改后仍是旧内容**：先确认提交到了发布分支，再查看 Actions 中的部署结果；部署完成后尝试强制刷新（macOS：`Command + Shift + R`）。
- **出现“主页内容暂未加载”**：检查 `site-data.js` 是否上传完整，以及最新改动是否遗漏引号、逗号或括号。在文件 History 中可以对照之前的内容修复。
- **图片显示占位图**：检查图片是否上传，路径、扩展名和大小写是否完全一致。空的图片字段和无法加载的图片都会显示占位图。
- **页面还有“待填写”**：这是防止把示例当成真实信息的标记。替换内容后，把该条目的 `placeholder` 改为 `false`；关闭草稿模式不会替你删除未填条目。

## GitHub 官方说明

- Pages 站点类型与默认网址：<https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages>
- 设置发布分支：<https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>
- 创建与发布站点：<https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site>
- 浏览器上传文件：<https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository>
- 浏览器编辑文件：<https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files>

## 参考结构

- 整体结构：<https://jmliu206.github.io/jmliu.github.io/>（侧边个人信息、学术内容分栏）
- News：<https://zmhh-h.github.io/>（精简主页动态与独立 All news 归档）
- Experiences：<http://rh-dang.com/>（机构 Logo、日期、左右交替时间线）

页面代码重新编写，仅参考布局思路，不使用参考站点的人物资料、论文内容或图片资源。
