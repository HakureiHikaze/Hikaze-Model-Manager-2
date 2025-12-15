# Hikaze Model Manager 2 – 开发文档

本项目是一个基于 **ComfyUI V3（schema + `io.ComfyNode`）** 的自定义节点插件，同时配套一个 **前端注入（overlay）框架**，用于在不改动 ComfyUI 核心前端的情况下：

- 为节点输入控件“加壳/覆写”（只读、占位、点击弹窗、复杂交互 UI 等）
- 同时兼容 ComfyUI 新前端的 **VueNodes 模式** 和旧的 **legacy 节点渲染模式**
- 将所有可持久化状态写回节点的 **schema 输入值**，从而自动保存到工作流 JSON

---

## 1. 项目结构导读

### 1.1 后端（Python）

- `custom_nodes/Hikaze-Model-Manager-2/__init__.py`
  - 提供 `comfy_entrypoint()`，返回 `ComfyExtension`
  - `get_node_list()` 返回本插件导出的 V3 节点类列表
- `custom_nodes/Hikaze-Model-Manager-2/base_nodes.py`
  - `HikazeBaseNode`：所有 Hikaze V3 节点的基类（不使用 `abc.ABC`，原因见下）
- `custom_nodes/Hikaze-Model-Manager-2/checkpoint_loader.py`
  - 示例节点：`HikazeCheckpointLoader`，从绝对路径加载 checkpoint，输出 MODEL/CLIP/VAE
- `custom_nodes/Hikaze-Model-Manager-2/lora_power_loader.py`
  - 示例节点：`HikazeLoraPowerLoader`，目前只解析/验证 JSON 并透传 Model/CLIP（UI 由前端覆写）

### 1.2 前端（Vue + TS + Vite）

核心目标：输出 **一个** ComfyUI 前端扩展入口文件（ESM），由 ComfyUI 自动加载。

- `custom_nodes/Hikaze-Model-Manager-2/web/vite.config.ts`
  - Vite build 使用 `lib.entry` 指向 `web/extensions/hikaze-model-manager.js`
  - 关闭 code split、开启 `inlineDynamicImports`：保证 dist 中只有一个 `.js`
- `custom_nodes/Hikaze-Model-Manager-2/web/extensions/hikaze-model-manager.js`
  - ComfyUI 前端扩展入口：`app.registerExtension(...)`
  - 初始化并驱动注入管理器 `HikazeInjectionManager`
- `custom_nodes/Hikaze-Model-Manager-2/web/src/injection/manager.ts`
  - `HikazeInjectionManager`：监听 nodeCreated/loadedGraphNode/graph 切换/VueNodes 模式切换，执行注入与重注入
- `custom_nodes/Hikaze-Model-Manager-2/web/src/injection/controllers/*`
  - 控制器系统：每种节点类型（node_id）对应一个 controller，描述要注入的 overlay
- `custom_nodes/Hikaze-Model-Manager-2/web/src/components/HikazeNodeOverlay.vue`
  - VueNodes 模式下的“注入承载器”：创建 overlay DOM，并用 `<Teleport>` 将 overlay 挂到目标位置
- `custom_nodes/Hikaze-Model-Manager-2/web/src/components/HikazeLoraPowerLoaderOverlay.vue`
  - 示例：复杂交互 UI（展示/编辑 LoRA JSON），最终仍写回 schema 输入 `lora_json`

---

## 2. ComfyUI 如何加载本插件（后端 + 前端）

### 2.1 后端节点加载（V3）

ComfyUI 在启动时会扫描 `custom_nodes/` 下的模块，并在 `nodes.py` 的 `load_custom_node(...)` 中：

1. 发现模块中存在 `comfy_entrypoint`
2. 调用 `comfy_entrypoint()` 得到 `ComfyExtension`
3. `await extension.get_node_list()` 拿到节点类列表
4. 对每个节点类调用 `GET_SCHEMA()`，取 `schema.node_id` 作为注册键写入 `NODE_CLASS_MAPPINGS`

因此：**真正“对外可见”的节点必须实现 schema**；只作为抽象基类/工具类的节点不要加入 `get_node_list()`。

### 2.2 前端资源加载（web/dist）

本插件通过 `pyproject.toml`：

```toml
[tool.comfy]
web = "web/dist"
```

将 `web/dist` 声明为前端资源根目录。ComfyUI 会把它作为扩展 web 目录服务并在前端侧自动导入其中的 JS。

重要结论：

- **ComfyUI 会自动 import web 根目录下的每一个 `.js` 文件**
- 所以前端 build 必须尽量产出 **单文件**（否则多个 chunk 会被重复 import，造成副作用/重复注册）

对应实现见：`web/vite.config.ts`（`cssCodeSplit: false`、`inlineDynamicImports: true` 等）。

---

## 3. 后端“框架”约束（HikazeBaseNode）

### 3.1 为什么 `HikazeBaseNode` 不用 `abc.ABC`

ComfyUI V3 在执行节点时会对节点类做 clone + lock（防 monkey-patch），见核心执行逻辑：

- `execution.py`：对 V3 节点走 `_ComfyNodeInternal` 分支，调用 `PREPARE_CLASS_CLONE` 并 `lock_class(...)`

`ABCMeta` 会在类创建/抽象方法解析期间写入 `__abstractmethods__` 等元信息，容易与 ComfyUI 的 clone/lock 策略冲突，导致验证/执行异常。

因此本项目的 `HikazeBaseNode` **不继承 `ABC`**，只提供“约定式”的基类与可选 hooks。

### 3.2 节点命名约定（非常关键）

前端注入框架默认只处理 `node.type` / `node.comfyClass` 以 `Hikaze` 开头的节点：

- `web/src/injection/types.ts`：`HIKAZE_NODE_TYPE_PREFIX = 'Hikaze'`
- `HikazeInjectionManager.isHikazeNode()`：`startsWith('Hikaze')`

因此：

- 后端 `io.Schema(node_id=...)` 建议统一以 `Hikaze` 前缀命名
- controller 的 `NODE_TYPE` 必须与 `node_id` **完全一致**

### 3.3 可持久化状态：一定要落到 schema 输入

工作流 JSON 保存的是节点的输入值（包括 socketless widget）。所以：

- 任何你希望“刷新/重载/导入导出工作流后仍存在”的数据，都必须变成某个输入（推荐 socketless）。
- 前端 UI 的任何编辑动作最终必须写回 widget value。

示例：

- `HikazeCheckpointLoader`：`ckpt_path`（socketless string）
- `HikazeLoraPowerLoader`：`lora_json`（socketless multiline string）

---

## 4. 前端注入框架如何工作

### 4.1 扩展入口（注册时机）

`web/extensions/hikaze-model-manager.js` 会：

1. `import "../src/injection/registerControllers"`：加载各节点 controller，完成注册
2. 创建 `HikazeInjectionManager`
3. `app.registerExtension({ nodeCreated, loadedGraphNode, ... })`
4. `manager.install()` 并对当前图执行一次 `reinjectAll('startup')`

### 4.2 注入管理器（HikazeInjectionManager）

关键能力：

- 识别 Hikaze 节点：`node.type` / `node.comfyClass` 前缀
- 兼容两种模式：
  - `vue`：新前端 VueNodes（DOM 渲染节点）
  - `legacy`：旧前端（canvas/litegraph 传统 widget）
- 监听并处理：
  - 节点创建：`nodeCreated`
  - 图加载时节点恢复：`loadedGraphNode`
  - 图切换：canvas 事件 `litegraph:set-graph`
  - VueNodes 开关：设置项 `Comfy.VueNodes.Enabled` 的 change 事件
  - 节点折叠：hook `node.collapse()`，折叠时 dispose，展开后 reinject

### 4.3 控制器系统（BaseHikazeNodeController）

每个节点类型可以定义一个 controller：

- `BaseHikazeNodeController.register(nodeType, ctor)`
- `HikazeInjectionManager` 会基于 nodeType 从 registry 找到 controller

controller 的职责是“描述 UI 注入策略”，主要通过覆写两类方法：

- `getVueBodyOverlays(ctx)`：在 VueNodes 模式下为整个节点 body 注入 overlay（可挂载 Vue 组件）
- `getVueWidgetOverlays(ctx)`：在 VueNodes 模式下针对某个 schema 输入控件注入 overlay（常用于点击拦截/只读/placeholder）
- `onInjectLegacy(ctx)`：在 legacy 模式下 hook widget 的交互（例如把点击改成 prompt）

### 4.4 Overlay 的两种粒度

#### A) Node body overlay（覆盖整个节点 body）

适合：

- 完全接管节点内部 UI（渲染一套复杂 Vue UI）
- 需要接管鼠标事件（阻止默认行为/实现拖拽/弹窗等）

示例：`HikazeLoraPowerLoaderController` 使用 `component: HikazeLoraPowerLoaderOverlay`。

#### B) Widget overlay（覆盖某个输入控件）

适合：

- 只想“接管某个输入”的点击行为
- 需要把输入变成只读并显示 placeholder

Widget overlay 的定位依赖：

- `HikazeNodeOverlay.vue` 中通过 `input[aria-label="${widgetName}"]` 找到输入框

因此：**schema 输入 id（widget.name）必须稳定且唯一**。

### 4.5 为什么必须用 `setWidgetValue(...)`

在 controller 中，不要直接 `widget.value = ...` 了事。应使用 `BaseHikazeNodeController.setWidgetValue`：

- 触发 widget.callback / node.onWidgetChanged
- 增加 graph 版本号，标记画布 dirty
- 同步 inputEl.value
- 让 ComfyUI 认为“节点输入已变更”，从而：
  - 工作流 JSON 保存会带上新值
  - 执行缓存/依赖能正确失效

---

## 5. 如何按本框架新增一个节点（推荐流程）

下面以新增 `HikazeFooBar` 为例，给出后端与前端的最小步骤。

### 5.1 后端：新增 V3 节点类

1) 新建 `custom_nodes/Hikaze-Model-Manager-2/foo_bar.py`：

- `class HikazeFooBar(HikazeBaseNode): ...`
- `define_schema()`：
  - `node_id="HikazeFooBar"`（必须以 Hikaze 开头）
  - 输入（需要持久化的配置用 `socketless=True`）
  - 输出（用 `io.Model/Clip/Vae/...` 等类型）
- `execute(...)`：实现逻辑并 `return io.NodeOutput(...)`

2) 在 `custom_nodes/Hikaze-Model-Manager-2/__init__.py`：

- `from .foo_bar import HikazeFooBar`
- 把它加入 `get_node_list()` 返回列表

### 5.2 前端：新增 controller（把 UI 绑定到节点）

1) 新建 `web/src/injection/controllers/HikazeFooBarController.ts`：

- `const NODE_TYPE = 'HikazeFooBar'`（必须匹配 node_id）
- `class HikazeFooBarController extends BaseHikazeNodeController { ... }`
- 选择一种注入方式：
  - **简单点击拦截**：`getVueBodyOverlays` + `onClick`
  - **复杂 UI**：`getVueBodyOverlays` + `component: YourVueComponent`
  - **只覆盖一个输入控件**：实现 `getVueWidgetOverlays`
- `BaseHikazeNodeController.register(NODE_TYPE, HikazeFooBarController)`

2) 在 `web/src/injection/registerControllers.ts` 增加：

```ts
import './controllers/HikazeFooBarController'
```

（该文件只负责 side-effect import，让 controller 注册生效。）

3) 若需要 Vue UI：新增组件 `web/src/components/HikazeFooBarOverlay.vue`，在 controller 中引用。

### 5.3 构建与验证

1) 安装依赖：

```bash
cd custom_nodes/Hikaze-Model-Manager-2/web
npm install
```

2) build：

```bash
npm run build
```

预期产物：

- `custom_nodes/Hikaze-Model-Manager-2/web/dist/hikaze-model-manager.js`
- `custom_nodes/Hikaze-Model-Manager-2/web/dist/hikaze-model-manager.js.map`

3) 启动/重启 ComfyUI，打开浏览器控制台，确认看到：

- `[Hikaze.ModelManager2] loaded`
- `[Hikaze.ModelManager2] registered`

4) 在画布右键菜单中可以使用：

- `Reload Hikaze Node UI`：触发 `manager.reinjectAll("manual-reload")`，用于调试

---

## 6. 典型“框架生态”节点的设计原则

1) **后端 schema 是唯一真相**  
前端只是展示/交互层，所有可持久化数据必须落到 schema 输入。

2) **输入 id 稳定**  
controller 通过 widget.name / `aria-label` 定位控件，重命名输入会导致前端注入失效。

3) **node_id 以 `Hikaze` 开头**  
否则注入管理器不会处理，UI 覆写不会生效。

4) **前端更新必须调用 `setWidgetValue`**  
确保 ComfyUI 的缓存/保存/脏标记机制正常工作。

5) **兼容两种模式（可选但建议）**
controller 同时实现 VueNodes 与 legacy 的注入逻辑，至少保证在 legacy 模式下不会“完全不可用”。

---

## 7. 常见问题排查

### 7.1 前端没生效 / 没有任何日志

- 检查 `pyproject.toml` 的 `[tool.comfy].web` 是否指向 `web/dist`
- 确认 `web/dist/hikaze-model-manager.js` 存在
- 确认没有多余的 `.js` 文件被输出到 `web/dist`（会导致重复注册或行为异常）

### 7.2 节点 UI 没注入，但扩展已注册

- 节点 `node_id` 是否以 `Hikaze` 开头？
- controller 的 `NODE_TYPE` 是否与 `node_id` 完全一致？
- `registerControllers.ts` 是否 import 了你的 controller？
- 节点是否处于折叠状态？折叠会 dispose overlay，展开会自动 reinject（异步，稍等）

### 7.3 工作流保存后丢失 UI 内容

- 是否把数据写回了 schema 输入（widget value）？
- 是否通过 `setWidgetValue` 更新？
- 仅存 Vue state（ref/reactive）不会被工作流 JSON 持久化

---

## 8. 参考实现（建议阅读顺序）

1) 前端入口：`custom_nodes/Hikaze-Model-Manager-2/web/extensions/hikaze-model-manager.js`
2) 注入管理器：`custom_nodes/Hikaze-Model-Manager-2/web/src/injection/manager.ts`
3) 控制器基类：`custom_nodes/Hikaze-Model-Manager-2/web/src/injection/controllers/BaseHikazeNodeController.ts`
4) Vue overlay 承载：`custom_nodes/Hikaze-Model-Manager-2/web/src/components/HikazeNodeOverlay.vue`
5) 示例 controller：
   - `custom_nodes/Hikaze-Model-Manager-2/web/src/injection/controllers/HikazeCheckpointLoaderController.ts`
   - `custom_nodes/Hikaze-Model-Manager-2/web/src/injection/controllers/HikazeLoraPowerLoaderController.ts`
6) 后端示例节点：
   - `custom_nodes/Hikaze-Model-Manager-2/checkpoint_loader.py`
   - `custom_nodes/Hikaze-Model-Manager-2/lora_power_loader.py`

