# dsh-workspace-categories

> **给 DeepSeek Harness 的工作区加分类。** 把平铺的项目列表分成自定义分组，直接在侧边栏按分类浏览，拖一下就能改归类。
>
> **Category groups for DeepSeek Harness workspaces.** Split a flat project list into named sections, browse them right in the sidebar, and re-file by drag and drop.

<sub>DeepSeek Harness 0.2.x · Web / Desktop · MIT</sub>

---

## 它解决什么

Harness 的侧边栏默认只有「工作区」这一层：项目一多就平铺成一条长列表，找东西只能靠记名字。这个插件在工作区之上再加一层**自定义分类**，让列表变成

```
▾ 产品                      3
    📁 项目一                 12
    📁 项目二                  4
    📁 项目三                  1
▾ 研发                      2
    📁 项目四                  8
    📁 项目五                  2
▾ 归档                      3
    📁 项目六                  6
    📁 项目七                  3
    📁 项目八                  2
▾ 未分类                    2
```

分类和文件夹层级无关，可以任意组合；同一分类内的顺序仍由 Harness 的工作区顺序决定。

## 功能

- **分类侧边栏**：分组头可折叠，工作区行显示会话数，展开后是会话列表（标题 + 相对时间）
- **两种归类方式**：把工作区行拖到别的分组，或在分类管理面板里用下拉框选
- **分类管理面板**：新建 / 重命名 / 删除分类，一眼看到每个分类下有哪些工作区
- **无彩色设计**：只用 Harness 主题的文字层级区分，不引入额外配色
- **搜索**：按工作区名、路径、会话标题过滤
- **保留的操作**：打开工作区 / 打开会话 / 新建会话 / 添加工作区（系统目录框）/ 归档会话 / 搜索

## 安装

这是一个 Harness **bundle**（`dsh.bundle.patch` + 浏览器半），不是 npm 包。在 Harness 的插件页安装时，填本仓库的地址：

```
github:burningg/dsh-workspace-categories
```

也可以把它加进 profile 的依赖后启用：

```bash
# ~/.dsh/profiles/<profile>/package.json → dependencies
"dsh-workspace-categories": "github:burningg/dsh-workspace-categories"
```

启用后侧边栏图标栏会出现「工作区分类」，左侧列表在有至少一个分类后自动变成分组视图。

> **装完要重启 DSH。** 插件的包路径在进程启动时就已确定，安装或更换来源后必须重启才会生效。
>
> **不要用 `link:` 装一个之后会被移动的目录。** `link:` 会把仓库的绝对路径写进 profile 依赖；之后移动或改名该目录，DSH 仍按旧路径读包，插件页就会报
> `包元信息错误：Plugin metadata for dsh-workspace-categories: Error: ENOENT: no such file or directory, scandir '<旧路径>/locale'`。
> 换回 `github:` 安装（或用 `dsh plugin --profile <profile> remove` 后再装）并重启即可恢复。

## 用法

1. 点侧边栏的 **工作区分类**（文件夹 + 三个点的图标），打开分类管理
2. **新建分类**，起个名字（例如 `产品`、`研发`、`归档`）
3. 回到侧边栏，把工作区行**拖进**对应分组；或在管理面板里用下拉框选
4. 不想看分组时，把面板里的开关 **「侧边栏按分类分组」** 关掉，原生列表立刻回来

## 和原生列表的关系

Harness 的工作区浏览区（`sidebar.workspaces`）是一个单占位槽，原生组件只按工作区一层分组，没有插入分组的接口。所以本插件以 `priority: -10` 占住同一个槽位来渲染分组视图，并且：

- **可一键关闭**：面板里的开关会注销这次占位，原生列表立即恢复，无需刷新
- **零分类时自动让位**：没有任何分类时插件不占位，列表保持原生
- **出错自动回退**：组件渲染异常时插槽会让出单元格（abdicate），原生列表自动回来

代价是原生浏览区内部的一些能力不再提供（它们没有对外接口）：会话置顶、会话右键菜单里的重命名 / 分叉 / 复制 ID、归档筛选、悬停卡片、拖拽排序、`Mod+K` 快捷键。需要它们时关掉开关即可。

## 数据

分类和归类关系存在当前页面的 `localStorage`（`dsh.workspace-categories.v2`，会从 v1 自动迁移）：

- 不修改工作区注册、不移动文件、不改会话归属或工作目录
- 换浏览器或清站点数据会丢分类；工作区本身不受影响

## 兼容性

面向 DeepSeek Harness `0.2.x` 开发与验证：插件行加载、`main` / `sidebar.panellist` / `sidebar.workspaces` 三个扩展点的注册均已确认。视觉上依赖 Harness 的 `--dsw-alias-*` 主题令牌，浅色 / 深色主题通用；行高与字号取自 Harness 自带的 `WorkspaceBrowser.module.css` / `Rows.module.css`，以便和原生列表一致。

## 结构

| 文件 | 作用 |
| --- | --- |
| `index.js` | Host 侧空壳，只提供 Loader 行，让浏览器半可被组合下发 |
| `client.js` | 全部界面与状态：分类面板（`main`）、侧边栏图标（`sidebar.panellist`）、分类侧边栏（`sidebar.workspaces`） |
| `cordis.patch.yml` | 插入 `workspace-categories` 这一行 |
| `locale/*.json` | 插件列表里的标题与描述 |
| `icon.svg` | 插件图标 |

## License

MIT
