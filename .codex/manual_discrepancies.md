# 手动差异记录

## Phase 1: 代码结构概览

### 1.1 目录与模块分布
- `web/model_manager_frontend`: 管理端前端 SPA（Vue3 + Vite + TS），提供模型管理界面。
用户批示：已确认
- `web/custom_node_frontend`: ComfyUI 前端扩展与节点覆盖层（Vue3 + Vite + TS），用于节点内交互与弹窗管理器。
用户批示：已确认
- `backend`: Python 后端服务、数据库与工具层，提供 API、迁移与图片处理。
用户批示：已确认
- `nodes`: ComfyUI 自定义节点实现（Python），消费 `hikaze_payload` 与模型加载逻辑。
用户批示：已确认
- `shared` 与 `web/shared`: 前后端共享类型/适配器（在依赖关系中使用）。
用户批示：shared用于后端共享，web/shared用于前端共享。此二者的数据结构永远是镜像关系
- `web/dist`: 前端构建产物（管理端静态资源与 ComfyUI 扩展脚本）。
用户批示：已确认
- `data`: 运行期数据目录（DB、图片缓存与类型缓存）。
用户批示：已确认，当前处于开发阶段，本数据目录暂无价值，会经常由用户清空和重新生成

### 1.2 入口与关键配置

#### 1.2.1 ComfyUI 扩展入口
- `custom_nodes/Hikaze-Model-Manager-2/__init__.py`: 注册 ComfyExtension、返回节点列表、初始化数据库并启动内置服务端，负责生命周期管理。
用户批示：已确认

#### 1.2.2 管理端前端入口
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/index.html`: Vite SPA 容器，挂载 `#app` 并加载 `src/main.ts`。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/main.ts`: 创建 Vue 应用并挂载 `App.vue`，引入全局样式。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/vite.config.ts`: 构建输出到 `web/dist/manager`，设置别名 `@` 与 `@shared`。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/tsconfig*.json`: 启用严格模式与路径别名，覆盖 DOM 与 Node 侧构建配置。
用户批示：已确认

#### 1.2.3 节点前端入口
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/extensions/hikaze-model-manager.js`: ComfyUI 扩展入口脚本，注册扩展并注入样式。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/main.ts`: 仅开发模式使用的 NodeShell 入口，非 ComfyUI 运行入口。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/vite.config.ts`: lib 模式单文件构建输出到 `web/dist`，避免多 chunk。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/tsconfig*.json`: TS 编译与 Vite 配置编译。
用户批示：已确认

#### 1.2.4 后端 nodes 入口
- `custom_nodes/Hikaze-Model-Manager-2/nodes/base_nodes.py`: 定义 `hikaze_payload` 统一输入与解析基类。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/nodes/checkpoint_loader.py`: Checkpoint 节点入口。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/nodes/lora_power_loader.py`: LoRA 叠加节点入口。
用户批示：已确认

#### 1.2.5 后端 server 入口
- `custom_nodes/Hikaze-Model-Manager-2/backend/server/instance.py`: aiohttp 服务器线程入口，负责端口选择、应用生命周期。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/server/router.py`: API 与静态资源路由注册入口。
用户批示：已确认

## Phase 2: 前端分析

### 2.1 model_manager_frontend

#### 2.1.1 设计理念
- 以独立管理端 UI 为核心，强调图像优先的模型浏览与编辑。
- 前后端通过统一 API 与共享类型对齐，避免字段漂移。
用户批示：已确认

#### 2.1.2 设计细节
- 三栏布局（库/分割条/详情），支持拖拽调整详情栏宽度。
- 类型标签、搜索、标签过滤、卡片/列表切换、预览轮播与图片管理。
用户批示：已确认，预览轮播似乎没有正常运行，但重构typeapi后未测试过，标签过滤应当将设置了过滤器的标签强制呈现并置顶（即便当前tab下没有对应标签），此外，当设置过滤器时，除强制显示的标签，应当隐藏过滤后符合项为0的标签

#### 2.1.3 技术栈
- Vue 3 + Vite + TypeScript（严格模式），与 `@shared` 类型/适配器联动。
用户批示：已确认

#### 2.1.4 设计模式
- Composition API + 轻量 store 缓存 + 组件分层（布局/库/详情/控件）。
用户批示：已确认，store缓存应当设置根据配置显式重置的功能，以在未来支持切换到pending promotion mode

#### 2.1.5 文件级内容与功能
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/package.json`: 前端脚本（dev/build/preview/test）与 Vue 依赖声明。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/vite.config.ts`: Vue 插件、构建输出 `web/dist/manager`、别名 `@`/`@shared`、vitest 配置。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/tsconfig.json`: TS 项目引用与子配置聚合。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/tsconfig.app.json`: 浏览器端严格编译、路径别名与检查规则。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/tsconfig.node.json`: Vite 配置文件的 Node 侧 TS 配置。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/index.html`: SPA 入口 HTML，挂载 `#app` 并加载 `src/main.ts`。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/main.ts`: 创建 Vue App 并挂载 `App.vue`，引入全局样式。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/style.css`: 全局暗色主题与基础样式、按钮与 `#app` 尺寸控制。
用户批示：已确认，目前不做变动
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/App.vue`: 根据 URL 参数计算 `embedded`/`initialTab`，组织主布局、库与详情面板。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/api/models.ts`: 管理端 API 客户端，覆盖模型/标签/图片/迁移等请求与适配器转换。
用户批示：已确认，该模块下的interface定义应当交由@shared/types统一完成
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/store/models.ts`: 轻量缓存 store，按类型加载模型列表并维护 loading/error 状态。
用户批示：已确认，缓存的预留设计如上
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/util/intersectionObserver.ts`: IntersectionObserver 简易封装，用于懒加载触发。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/components/HikazeManagerLayout.vue`: 处理标签栏、加载类型、可拖拽详情宽度与布局容器。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/components/ModelLibrary.vue`: 卡片/列表视图、搜索与标签过滤、懒加载与预览轮播。
用户批示：已确认，预览轮播未确认是否正常工作
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/components/ModelDetails.vue`: 详情侧栏，加载模型详情与标签编辑、提示词编辑与保存。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/components/HikazeImageGallery.vue`: 图片浏览/翻页/上传/删除与计数刷新。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/model_manager_frontend/src/components/HikazeTagInput.vue`: 标签 chip 输入、建议下拉与新标签临时 id 逻辑。
用户批示：已确认

### 2.2 custom_node_frontend

#### 2.2.1 设计理念
- 以“注入管理器 + 节点控制器”方式覆盖 ComfyUI 节点 UI，统一 `hikaze_payload` 协议。
- 复用管理端组件在 ComfyUI 内展示全局管理弹窗。
用户批示：已确认

#### 2.2.2 设计细节
- 监听节点创建、图切换与模式切换，按需注入/重注入。
- 通过 Teleport 将覆盖层渲染到节点 widget 容器。
用户批示：已确认，现在暂不支持legacy节点（即litegraph的纯canvas实现）覆盖层，只显示裸原生控件搭载的hikaze_payload即可

#### 2.2.3 技术栈
- Vue 3 + Vite + TypeScript，lib 模式输出单脚本扩展。
用户批示：已确认

#### 2.2.4 设计模式
- 控制器注册表、弱引用管理节点生命周期、事件驱动注入。
用户批示：已确认

#### 2.2.5 文件级内容与功能
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/package.json`: 扩展前端依赖与构建脚本定义。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/vite.config.ts`: lib 模式构建配置、输出单文件 JS、设置别名。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/tsconfig.json`: TS 严格模式与路径别名。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/tsconfig.node.json`: Vite 配置文件编译设置。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/index.html`: 开发用 SPA 容器，挂载 `src/main.ts`。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/main.ts`: 开发用 NodeShell 挂载入口。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/shims-vue.d.ts`: Vue SFC 类型声明。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/style.css`: 开发 UI 的基础样式与背景。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/extensions/hikaze-model-manager.js`: ComfyUI 扩展注册、注入样式与事件挂钩。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/injection/types.ts`: 注入上下文与常量/接口定义。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/injection/registerControllers.ts`: 侧效导入控制器并注册。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/injection/modalService.ts`: 全局 modal 状态与 open/close 接口。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/injection/manager.ts`: 注入管理器，管理图变化、模式切换与节点注入/重注入。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/injection/controllers/BaseHikazeNodeController.ts`: 基类控制器，管理 payload 同步、挂载/卸载、VueNodes/legacy 模式适配。
用户批示：已确认，legacy模式行为解释如上
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/injection/controllers/HikazeCheckpointLoaderController.ts`: Checkpoint 节点控制器，绑定覆盖组件。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/injection/controllers/HikazeLoraPowerLoaderController.ts`: LoRA 节点控制器，绑定覆盖组件。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/components/NodeShell.vue`: 开发调试壳，测试打开管理器弹窗。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/components/HikazeNodeFrame.vue`: 覆盖层框架，Teleport 到节点 widget，基于节点强调色渲染。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/components/HikazeManagerModal.vue`: 全局弹窗，复用管理端布局/库/详情组件。
用户批示：已确认，该弹窗应当直接引用管理端组件，而不是重写，当前并未被前端节点引用。
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/components/HikazeCheckpointLoaderOverlay.vue`: Checkpoint 选择 UI，提示输入路径并写入 payload。
用户批示：已确认，选择按键是功能占位符，将打开预定义embedding=True initial_tab=checkpoints两个attr的管理器组件
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/components/HikazeLoraPowerLoaderOverlay.vue`: LoRA 列表编辑 UI，支持启用/删除/强度与整体开关。
用户批示：已确认，选择按键是功能占位符，将打开预定义embedding=True initial_tab=loras两个attr的管理器组件
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/components/HikazeLoraListElement.vue`: LoRA 表格单行，处理强度输入与删除事件。
用户批示：已确认，按钮列的表格行高样式不正确
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/util/dom.ts`: VueNodes DOM 查询与 widget 定位工具。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/util/colors.ts`: 解析颜色与提取节点强调色工具。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/util/object.ts`: 安全 hasOwn 与隐藏标记工具。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/util/lora.ts`: LoRA JSON 解析与规范化、反序列化。
用户批示：已确认，该工具应当放置在@shared中
- `custom_nodes/Hikaze-Model-Manager-2/web/custom_node_frontend/src/util/numbers.ts`: 数值强制转换与默认值。
用户批示：已确认

## Phase 3: 后端分析

### 3.1 nodes（后端节点）

#### 3.1.1 设计理念
- 统一 `hikaze_payload` 输入，前端可自由扩展而不破坏节点接口。
用户批示：已确认

#### 3.1.2 设计细节
- Checkpoint 节点以绝对路径加载模型；LoRA 节点支持多条 LoRA 叠加并解析旧字段。
用户批示：已确认

#### 3.1.3 技术栈
- Python + ComfyUI API + comfy.sd/comfy.utils。
用户批示：已确认

#### 3.1.4 设计模式
- 基类统一 schema 与 payload 解析，子类提供执行逻辑。
用户批示：已确认

#### 3.1.5 文件级内容与功能
- `custom_nodes/Hikaze-Model-Manager-2/nodes/__init__.py`: 节点包说明。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/nodes/base_nodes.py`: 定义 `HikazeBaseNode`，提供 payload 输入创建与 JSON 解析。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/nodes/checkpoint_loader.py`: 解析 `ckpt_path` 并加载模型/CLIP/VAE。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/nodes/lora_power_loader.py`: 解析 LoRA 列表并逐条应用强度，支持 enabled 与多种字段名。
用户批示：已确认，应当只使用带下划线分隔单词的字段名版本，与shared中定义的LoRAEntry统一
- `custom_nodes/Hikaze-Model-Manager-2/nodes/util/lora_list_parser.py`: LoRA JSON 解析器，支持 strict/lenient 与版本控制。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/nodes/util/__init__.py`: 导出 LoRA 数据结构与解析函数，但引用 `dataclasses.py` 未在目录中发现。
用户批示：已确认，数据结构和解析工具应当防在shared中

### 3.2 backend/server（后端服务）

#### 3.2.1 设计理念
- 以 aiohttp 提供本地 API 与静态资源服务，支持迁移与图片处理。
用户批示：已确认

#### 3.2.2 设计细节
- 线程化启动，自动找端口；路由集中注册；静态资源映射到 `web/dist/manager`。
用户批示：已确认

#### 3.2.3 技术栈
- Python + aiohttp + asyncio/threading。
用户批示：已确认

#### 3.2.4 设计模式
- Handler 轻逻辑 + Service 业务层，路由集中注册。
用户批示：已确认

#### 3.2.5 文件级内容与功能
- `custom_nodes/Hikaze-Model-Manager-2/backend/server/__init__.py`: 导出 `HikazeServer` 与 `PortFinder`。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/server/instance.py`: 服务器线程、端口探测、启动/停止逻辑。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/server/router.py`: 注册 API 路由与静态文件服务。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/server/images_handler.py`: 图片获取/上传/删除/计数 API。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/server/library_info_handler.py`: 模型/标签/详情/更新 API，含 Others 类型处理。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/server/migration_handler.py`: 迁移 API，调用 MigrationService。
用户批示：已确认

### 3.3 backend/database（数据库）

#### 3.3.1 设计理念
- SQLite 作为本地持久化，采用单例 + 线程本地连接，数据模型以 SHA256 为主键。
用户批示：已确认，对于activated模型，以SHA256为主键，对于pending模型，以迁移时保留的旧id作为主键。

#### 3.3.2 文件级内容与功能
- `custom_nodes/Hikaze-Model-Manager-2/backend/database/__init__.py`: 导出 `DatabaseManager`。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/database/db.py`: DB 单例、schema 初始化、模型/标签 CRUD 与元数据管理。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/database/migration/__init__.py`: 迁移模块占位（空文件）。
用户批示：已确认，该文件仅用于提示一个python包
- `custom_nodes/Hikaze-Model-Manager-2/backend/database/migration/legacy_database_adapter.py`: 旧库读取与字段映射，区分 active/pending。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/database/migration/service.py`: Stage1/Stage2 迁移流程与冲突策略。
用户批示：已确认

### 3.4 backend/util（工具与常量）

#### 3.4.1 文件级内容与功能
- `custom_nodes/Hikaze-Model-Manager-2/backend/util/__init__.py`: 暴露 model_type_sniffer 的接口。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/util/config.py`: 路径与环境配置，创建数据目录，读取 ComfyUI 类型。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/util/consts.py`: 数据库 schema SQL 定义。
用户批示：已确认，未来可以将其他零散位置的常量统一放置其中
- `custom_nodes/Hikaze-Model-Manager-2/backend/util/hasher.py`: SHA256 计算工具。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/util/image_processor.py`: 图片多质量处理、序列管理与删除。
用户批示：已确认
- `custom_nodes/Hikaze-Model-Manager-2/backend/util/model_type_sniffer.py`: 从 ComfyUI 读取模型类型并缓存，提供兜底。
用户批示：已确认

## Phase 4: 依赖与协作关系

### 4.1 model_manager_frontend <-> backend/server
- 依赖：管理端前端通过相对路径调用 `/api/*` 接口获取模型、标签、图片与迁移数据。
- 协作：后端 server 负责提供 API 与静态资源（`web/dist/manager`），前端负责界面呈现与交互提交。
- 共享：前端通过 `@shared` 类型与适配器对齐后端模型字段。
用户批示：已确认

### 4.2 custom_node_frontend <-> backend/nodes
- 依赖：节点前端通过 `hikaze_payload` 隐藏字段写入结构化 JSON。
- 协作：后端节点读取 `hikaze_payload` 并执行加载/应用逻辑。
- 约定：payload 键名（如 `ckpt_path`、`LoRAs`/`LoRAList`）是协作协议。
用户批示：已确认

### 4.3 custom_node_frontend <-> backend/server
- 依赖：节点前端弹窗复用管理端组件，仍通过 `/api/*` 访问后端服务。
- 协作：后端 server 提供与管理端一致的 API，前端负责在 ComfyUI 内嵌调用。
- 注意：前端基于相对路径调用 API，依赖运行时同源或代理配置。
用户批示：已确认，节点前端应当直接引用模型管理器前端组件

### 4.4 backend/nodes <-> backend/server
- 依赖：两者由扩展入口共同初始化（数据库与服务端），共享配置与数据目录。
- 协作：节点侧负责模型加载与执行，服务侧负责管理 UI 与数据读写。
用户批示：已确认

### 4.5 shared/types 与适配层
- 依赖：前后端共享类型/适配器保证字段一致性。
- 协作：适配器承担字段映射与兼容，降低端间耦合。
用户批示：已确认

### 4.6 构建产物与加载路径
- 依赖：管理端构建到 `web/dist/manager`，节点前端构建到 `web/dist/hikaze-model-manager.js`。
- 协作：后端 server 托管管理端静态文件，ComfyUI 加载节点前端扩展脚本。
用户批示：已确认

## Phase 5: 实施记录（Refactor）

### 5.1 管理器前端（cache 替换与交互修复）
- 新增缓存模块 `web/model_manager_frontend/src/cache/tags.ts`、`models.ts`、`images.ts` 并替换 `store/models.ts` 使用路径。
用户批示：待确认
- ModelLibrary/HikazeTagInput/ManagerLayout 统一通过 tags cache 提供候选与 NSFW 自动排除。
用户批示：待确认
- 预览轮播与图片计数改为 image cache 统一读取，使用 `/api/images/<sha>_<seq>.webp?quality=...&rev=...`。
用户批示：待确认
- 标签过滤规则更新：已选标签置顶强制显示，0 结果标签隐藏。
用户批示：待确认

### 5.2 节点前端（openManager 集成）
- ManagerModal 去除硬编码 tabs，使用布局 slot，并新增 Confirm/Cancel 返回选择结果。
用户批示：待确认
- Checkpoint/LoRA Loader 接入 openManager，返回 `{"ckpt_path": "..."}`
  或 `LoRAListDocument`。
用户批示：待确认
- legacy 注入模式移除 prompt hook，仅保留原生控件行为。
用户批示：待确认
- LoRA 列表行高与对齐样式修复。
用户批示：待确认

### 5.3 后端服务
- router 去重并保留规范路径（含 `/api/images/get_img_count`）。
用户批示：待确认
- images_handler 文档注释与路径命名一致性修复。
用户批示：待确认

### 5.4 共享接口与 LoRA 协议
- LoRA schema 统一为 version=2 + `loras` 列表 + 下划线字段。
用户批示：待确认
- 前端 LoRA 解析迁移至 `web/shared/adapters/loras.ts`，后端 loader 使用统一解析器。
用户批示：待确认
- pending promotion 的 cache.reset 触发点未接入 UI 流程，记录于 `guidelines/not_implemented.md`。
用户批示：待确认
