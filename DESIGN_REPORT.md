# Hikaze Model Manager 2 — 完整设计资料报告

> **生成日期**: 2026-04-08  
> **项目路径**: `custom_nodes/Hikaze-Model-Manager-2`  
> **当前分支**: `qwen-test` (HEAD)  
> **最新提交**: `c0bb941` — 2026-04-04 17:50  
> **主分支**: `master` (`eb40401` — 2026-01-29 10:25)

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构总览](#2-技术架构总览)
3. [后端设计](#3-后端设计)
4. [数据库设计](#4-数据库设计)
5. [API 接口文档](#5-api-接口文档)
6. [前端设计 — Custom Node Frontend](#6-前端设计--custom-node-frontend)
7. [前端设计 — Model Manager Frontend](#7-前端设计--model-manager-frontend)
8. [共享层设计](#8-共享层设计)
9. [ComfyUI 集成机制](#9-comfyui-集成机制)
10. [功能模块与修改时间对照表](#10-功能模块与修改时间对照表)
11. [Git 提交历史与分支合并详解](#11-git-提交历史与分支合并详解)
12. [Conductor 开发工作流](#12-conductor-开发工作流)
13. [软件工程模式分析](#13-软件工程模式分析)
14. [ComfyUI 外部依赖与注入性代码分析](#14-comfyui-外部依赖与注入性代码分析)

---

## 1. 项目概述

### 1.1 功能简介

Hikaze Model Manager 2 是一个 ComfyUI 扩展插件，提供以下核心功能：

| 功能 | 说明 |
|------|------|
| **模型库浏览** | 支持搜索、标签过滤、卡片/列表视图的模型库 |
| **模型详情查看** | 预览图片、标签、提示词、描述等模型元数据 |
| **节点内选择器** | Checkpoint Loader 和 LoRA Power Loader 节点中直接打开管理器选择模型 |
| **待导入模型管理** | 审查待导入模型，迁移至活动库 |
| **安全过滤** | 通过 NSFW 标签自动过滤敏感内容 |
| **Legacy Canvas 覆盖层** | 在传统 Canvas 模式下渲染 HTML 覆盖层 UI |
| **VueNodes 模式支持** | 支持 ComfyUI 的 VueNodes 渲染模式 |

### 1.2 设计目标

- **节点集成优先**：模型选择器直接嵌入 ComfyUI 节点，无需切换窗口
- **双前端架构**：节点覆盖层 + 独立全屏管理页面
- **独立后端服务**：基于 aiohttp 的独立 Web 服务器，避免侵入 ComfyUI 主进程
- **结构化数据交换**：通过 `hikaze_payload` 隐藏 widget 实现 Vue ↔ Python 的 JSON 通信
- **Legacy 兼容**：同时支持 VueNodes 模式和传统 Canvas 渲染模式

---

## 2. 技术架构总览

### 2.1 技术栈

| 层级 | 技术 |
|------|------|
| **后端语言** | Python ≥ 3.10 |
| **后端框架** | ComfyUI Custom Node API (V3/V2 hybrid) + aiohttp |
| **数据持久化** | SQLite（SHA256 主键索引） |
| **前端框架** | Vue 3 (Composition API) |
| **前端语言** | TypeScript (Strict) |
| **构建工具** | Vite |
| **样式方案** | CSS3 + CSS Variables |
| **开发工作流** | Conductor（自研阶段化开发管理工具） |

### 2.2 架构模式

```
┌─────────────────────────────────────────────────────┐
│                    ComfyUI Main                      │
│  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │ PromptServer │  │   HikazeModelManagerExtension │ │
│  │  :8188       │  │   (ComfyExtension V3)         │ │
│  │              │  │   ├── HikazeCheckpointLoader   │ │
│  │ /api/hikaze/ │  │   └── HikazeLoraPowerLoader   │ │
│  │ sniffer_port │  │                                │ │
│  └──────┬───────┘  └──────────────────────────────┘ │
│         │ 端口发现                                    │
└─────────┼───────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────┐
│   HikazeServer :8189    │  ← 独立 aiohttp 服务器
│  ┌────────────────────┐ │
│  │   Router + CORS    │ │
│  │  ┌──────────────┐  │ │
│  │  │ /api/models  │  │ │
│  │  │ /api/tags    │  │ │
│  │  │ /api/images  │  │ │
│  │  │ /api/migration│ │ │
│  │  │ /api/scan     │ │ │
│  │  └──────────────┘  │ │
│  │  ┌──────────────┐  │ │
│  │  │ Static Files │  │ │  ← Model Manager SPA
│  │  │ (Vue Build)  │  │ │
│  │  └──────────────┘  │ │
│  └────────────────────┘ │
│  ┌────────────────────┐ │
│  │ DatabaseManager    │ │  ← SQLite Singleton
│  │ (Thread-safe)      │ │
│  └────────────────────┘ │
└─────────────────────────┘
          │
          ▼
┌─────────────────────────┐
│  Browser (ComfyUI UI)   │
│  ┌────────────────────┐ │
│  │ InjectionManager   │ │  ← Custom Node Frontend
│  │ ├── Controllers    │ │    (注入到 ComfyUI 节点)
│  │ ├── Overlays       │ │
│  │ └── Global Modal   │ │
│  └────────────────────┘ │
│  ┌────────────────────┐ │
│  │ Manager SPA        │ │  ← Model Manager Frontend
│  │ (独立全屏页面)      │ │    (iframe / 新标签页)
│  └────────────────────┘ │
└─────────────────────────┘
```

### 2.3 目录结构

```
Hikaze-Model-Manager-2/
├── __init__.py                 # ComfyUI 入口：注册扩展 + 初始化服务
├── pyproject.toml              # 项目配置
├── README.md / README_CN.md    # 项目说明
├── LICENSE                     # MIT 许可证
├── DEVELOPMENT.md              # 开发指南
│
├── backend/                    # 后端 Python 包
│   ├── __init__.py
│   ├── database/               # 数据库层
│   │   ├── __init__.py
│   │   ├── db.py               # DatabaseManager (Singleton, Thread-safe)
│   │   └── migration/          # 数据库迁移脚本
│   ├── server/                 # Web 服务器层
│   │   ├── __init__.py
│   │   ├── instance.py         # HikazeServer (aiohttp Thread + PortFinder)
│   │   ├── router.py           # API 路由注册
│   │   ├── library_info_handler.py  # 模型/标签 API Handler
│   │   ├── images_handler.py        # 图片 API Handler
│   │   └── migration_handler.py     # 迁移 API Handler
│   └── util/                   # 工具层
│       ├── __init__.py
│       ├── config.py           # 配置管理
│       ├── consts.py           # Schema SQL 常量
│       ├── hasher.py           # SHA256 哈希工具
│       ├── image_processor.py  # 图像处理（多质量 WebP）
│       └── model_type_sniffer.py # 模型类型嗅探
│
├── nodes/                      # ComfyUI 节点实现
│   ├── __init__.py
│   ├── base_nodes.py           # HikazeBaseNode (Payload 协议)
│   ├── checkpoint_loader.py    # Checkpoint 加载器节点
│   ├── lora_power_loader.py    # LoRA 批量加载器节点
│   └── util/                   # 节点工具（LoRA 列表解析等）
│
├── shared/                     # 前后端共享层
│   ├── __init__.py
│   ├── types/
│   │   ├── __init__.py
│   │   ├── model_record.py     # ModelRecord, PendingModelRecord, Tag 等 dataclass
│   │   ├── data_adapters.py    # 数据适配器（dict ↔ dataclass）
│   │   └── lora_list.py        # LoRA 列表文档类型
│   └── util/
│       ├── __init__.py
│       └── tools.py            # 共享工具函数
│
├── web/                        # 前端代码
│   ├── custom_node_frontend/   # 节点注入前端（Vue 3 + TS + Vite）
│   │   ├── src/
│   │   │   ├── main.ts         # 入口
│   │   │   ├── components/     # Vue 组件
│   │   │   │   ├── HikazeManagerModal.vue          # 全局模态框
│   │   │   │   ├── HikazeCheckpointLoaderOverlay.vue # Checkpoint 覆盖层
│   │   │   │   ├── HikazeLoraPowerLoaderOverlay.vue  # LoRA 覆盖层
│   │   │   │   ├── HikazeNodeFrame.vue              # 节点框架
│   │   │   │   ├── HikazeLoraListElement.vue         # LoRA 列表元素
│   │   │   │   └── NodeShell.vue                     # 节点外壳
│   │   │   ├── injection/      # 注入系统
│   │   │   │   ├── manager.ts  # HikazeInjectionManager
│   │   │   │   ├── modalService.ts  # 模态框服务
│   │   │   │   ├── registerControllers.ts # 控制器注册
│   │   │   │   ├── types.ts    # 注入类型定义
│   │   │   │   └── controllers/ # 节点控制器
│   │   │   └── util/           # 工具函数
│   │   └── extensions/         # ComfyUI 扩展注册
│   │
│   ├── model_manager_frontend/ # 独立管理器前端（Vue 3 + TS + Vite）
│   │   ├── src/
│   │   │   ├── App.vue         # 根组件
│   │   │   ├── main.ts         # 入口
│   │   │   ├── api/            # API 层
│   │   │   │   └── models.ts   # 模型 API 调用
│   │   │   ├── cache/          # 缓存层
│   │   │   │   ├── images.ts   # 图片缓存
│   │   │   │   ├── models.ts   # 模型缓存
│   │   │   │   └── tags.ts     # 标签缓存
│   │   │   ├── components/     # Vue 组件
│   │   │   │   ├── HikazeManagerLayout.vue     # 管理器布局（Tab 系统）
│   │   │   │   ├── ModelLibrary.vue            # 模型库
│   │   │   │   ├── ModelDetails.vue            # 模型详情
│   │   │   │   ├── PendingModelLibrary.vue      # 待导入模型库
│   │   │   │   ├── PendingModelDetails.vue      # 待导入模型详情
│   │   │   │   ├── HikazeImageGallery.vue       # 图片画廊
│   │   │   │   ├── HikazeTagInput.vue           # 标签输入
│   │   │   │   ├── FloatingToolbar.vue          # 浮动工具栏
│   │   │   │   └── SelectedLoraBar.vue          # 已选 LoRA 栏
│   │   │   ├── store/          # 状态管理
│   │   │   │   └── models.ts   # useModelStore composable
│   │   │   └── util/           # 工具函数
│   │   └── public/             # 静态资源
│   │
│   └── shared/                 # 前端共享代码
│       ├── adapters/           # 数据适配器
│       ├── types/              # 类型定义
│       └── util/               # 工具函数
│
├── conductor/                  # Conductor 开发管理工具
│   ├── product.md              # 产品定义
│   ├── product-guidelines.md   # 产品指南
│   ├── tech-stack.md           # 技术栈文档
│   ├── workflow.md             # 工作流定义
│   ├── tracks.md               # 开发轨道记录
│   ├── setup_state.json        # 设置状态
│   ├── archive/                # 归档轨道
│   ├── code_styleguides/       # 代码风格指南
│   ├── discrepancies/          # 差异报告
│   └── tracks/                 # 活跃轨道
│
├── scripts/                    # 开发/测试脚本
│   ├── api_test.py             # API 测试
│   └── replace_images_with_placeholders.py
│
└── assets/                     # 示例数据
    ├── loraListExample.json
    └── meta_json_example.json
```

---

## 3. 后端设计

### 3.1 启动流程

```
ComfyUI 加载 custom_nodes
    │
    ▼
__init__.py::comfy_entrypoint()
    │
    ├── register_sniffer_route()     # 在 PromptServer 注册 /api/hikaze/sniffer_port
    │
    ├── init_services()
    │   ├── DatabaseManager()        # 初始化 SQLite 单例
    │   │   └── init_db()            # 创建 Schema + 初始化 db_meta
    │   │
    │   └── HikazeServer(port=base+1) # 启动独立 aiohttp 服务器
    │       └── start()              # daemon 线程运行
    │
    └── return HikazeModelManagerExtension()
        └── get_node_list() → [HikazeCheckpointLoader, HikazeLoraPowerLoader]
```

### 3.2 HikazeServer

- **类**: `backend.server.instance.HikazeServer`（继承 `threading.Thread`）
- **端口策略**: 从 ComfyUI 端口 +1 开始查找空闲端口
- **CORS**: 全局中间件，允许所有来源
- **静态文件**: 托管 `web/dist/manager` 下的 Vue SPA 构建
- **关闭**: 通过 `atexit` 注册 `stop_services()` 清理资源

### 3.3 端口发现机制

ComfyUI 主进程通过 `/api/hikaze/sniffer_port` 路由获取 Hikaze Server 的实际端口号，前端据此构建 API 请求 URL。

### 3.4 图像处理策略

3 级 WebP 压缩：
- **High**: 高质量原图
- **Medium**: 中等质量
- **Low**: 低质量缩略图

命名规则: `{hash}_{seq}_{quality}.webp`

---

## 4. 数据库设计

### 4.1 Schema（v2）

```sql
-- 模型主表
CREATE TABLE models (
    sha256 TEXT PRIMARY KEY,    -- SHA256 哈希作为主键
    path TEXT NOT NULL,         -- 模型文件绝对路径
    name TEXT,                  -- 模型名称
    type TEXT,                  -- 模型类型 (checkpoint/lora/vae等)
    size_bytes INTEGER,         -- 文件大小
    created_at INTEGER,         -- 创建时间戳
    meta_json TEXT              -- 元数据 JSON (描述/链接/提示词/图片数)
);

-- 标签表
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- 模型-标签关联表
CREATE TABLE model_tags (
    model_hash TEXT,
    tag_id INTEGER,
    PRIMARY KEY (model_hash, tag_id),
    FOREIGN KEY(model_hash) REFERENCES models(sha256) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 待导入模型-标签关联表
CREATE TABLE pending_model_tags (
    model_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (model_id, tag_id),
    FOREIGN KEY(model_id) REFERENCES pending_import(id) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 待导入模型表
CREATE TABLE pending_import (
    id INTEGER PRIMARY KEY,
    path TEXT UNIQUE NOT NULL,
    sha256 TEXT,
    name TEXT,
    type TEXT,
    size_bytes INTEGER,
    created_at INTEGER,
    meta_json TEXT
);

-- 数据库元数据键值表
CREATE TABLE db_meta (
    key TEXT PRIMARY KEY,
    value TEXT
);
```

### 4.2 DatabaseManager

- **设计模式**: 线程安全单例（`__new__` + `threading.Lock`）
- **连接管理**: `threading.local` 缓存线程本地连接
- **核心方法**:
  - `upsert_model(record)` — UPSERT 模型记录
  - `get_model_by_sha256(sha256)` → `ModelRecord`
  - `add_pending_import(record)` — 添加待导入
  - `get_pending_model_by_id(id)` → `PendingModelRecord`
  - `create_tag(name)` / `upsert_tag_with_id(id, name)` — 标签 CRUD
  - `tag_model()` / `untag_model()` — 模型-标签关联
  - `get_meta()` / `set_meta()` — 元数据读写

### 4.3 数据类型

| Dataclass | 用途 | 关键字段 |
|-----------|------|----------|
| `ModelRecord` | 已入库模型 | sha256, path, name, type, meta_json (含 images_count), tags |
| `PendingModelRecord` | 待导入模型 | id, path, sha256, name, meta_json (含 images 列表), tags |
| `ModelSimpleRecord` | 模型库列表项 | sha256, name, images_count, type, tags |
| `PendingModelSimpleRecord` | 待导入列表项 | id, name, image, type, tags |
| `Tag` | 标签 | id, name |
| `MetaJson` | 新版元数据 | description, community_links, images_count, prompts |
| `OldMetaJson` | 旧版元数据 | description, community_links, images (列表), prompts |

---

## 5. API 接口文档

### 5.1 模型相关

| 方法 | 路径 | 说明 | 实现时间 |
|------|------|------|----------|
| GET | `/api/models` | 获取模型列表（按类型过滤，排除 meta_json） | 2025-12-29 |
| GET | `/api/models/get_types` | 获取所有模型类型 | 2025-12-29 |
| GET | `/api/models/{sha256}` | 获取模型详情 | 2025-12-29 |
| PATCH | `/api/models/{sha256}` | 更新模型信息 | 2025-12-30 |

### 5.2 标签相关

| 方法 | 路径 | 说明 | 实现时间 |
|------|------|------|----------|
| GET | `/api/tags` | 获取所有标签（自动排除 NSFW） | 2025-12-29 |
| POST | `/api/tags_add` | 添加标签 | 2025-12-30 |

### 5.3 图片相关

| 方法 | 路径 | 说明 | 实现时间 |
|------|------|------|----------|
| GET | `/api/images/get_img_count` | 获取模型图片数量 | 2025-12-30 |
| GET | `/api/images/{hash}` | 获取模型图片（支持 seq 参数） | 2025-12-30 |
| GET | `/api/images/pending/{id}` | 获取待导入模型图片（by ID） | 2025-12-27 |
| GET | `/api/images/pending/{name}` | 获取待导入模型图片（by name） | 2025-12-27 |
| POST | `/api/images/upload` | 上传图片 | 2025-12-25 |
| DELETE | `/api/images/delete` | 删除图片（含序列移位） | 2025-12-30 |

### 5.4 迁移相关

| 方法 | 路径 | 说明 | 实现时间 |
|------|------|------|----------|
| GET | `/api/migration/pending_models` | 获取待导入模型列表 | 2025-12-26 |
| GET | `/api/migration/pending_model` | 获取单个待导入模型 | 2025-12-26 |
| POST | `/api/migration/migrate_legacy_db` | 触发旧版数据库迁移 | 2025-12-26 |
| POST | `/api/migration/import_models` | 导入模型到主库 | 2025-12-26 |

### 5.5 扫描

| 方法 | 路径 | 说明 | 实现时间 |
|------|------|------|----------|
| GET | `/api/scan` | 扫描文件系统发现新模型 | 2025-12-26 |

### 5.6 ComfyUI 侧路由

| 方法 | 路径 | 说明 | 实现时间 |
|------|------|------|----------|
| GET | `/api/hikaze/sniffer_port` | 获取 Hikaze Server 端口号 | 2025-12-24 |

---

## 6. 前端设计 — Custom Node Frontend

### 6.1 注入系统架构

```
ComfyUI Extension 注册
    │
    ▼
HikazeInjectionManager.install()
    ├── installVueNodesSettingListener()  # 监听 VueNodes 模式切换
    ├── installGraphChangeListener()      # 监听工作流切换
    └── mountGlobalModal()               # 挂载全局模态框 (HikazeManagerModal)
```

### 6.2 注入模式

| 模式 | 说明 | 渲染方式 |
|------|------|----------|
| `vue` | VueNodes 启用 | DOM-based Vue overlay |
| `legacy` | 传统 Canvas | HTML 覆盖层 + position adapter |

### 6.3 注入触发原因

| 原因 | 说明 |
|------|------|
| `node-created` | 用户创建节点 |
| `loaded-graph-node` | 加载工作流中的节点 |
| `mode-changed` | VueNodes 设置切换 |
| `graph-changed` | 工作流切换 |
| `collapse-changed` | 节点折叠/展开 |
| `manual-reload` | 手动重载 |

### 6.4 控制器体系

```
BaseHikazeNodeController (抽象基类)
    ├── inject(ctx)        # 注入 UI 到节点
    ├── reinject(ctx)      # 重新注入
    ├── dispose()          # 清理 DOM 和资源
    └── resolve(nodeType)  # 查找节点类型对应的控制器子类
```

### 6.5 关键组件

| 组件 | 用途 |
|------|------|
| `HikazeManagerModal.vue` | 全局模态框包装器（使用 Teleport） |
| `HikazeCheckpointLoaderOverlay.vue` | Checkpoint 节点覆盖层 UI |
| `HikazeLoraPowerLoaderOverlay.vue` | LoRA 节点覆盖层 UI |
| `HikazeNodeFrame.vue` | 节点框架组件 |
| `HikazeLoraListElement.vue` | LoRA 列表元素 |
| `NodeShell.vue` | 节点外壳容器 |

### 6.6 工具函数

| 模块 | 用途 |
|------|------|
| `nodePositionAdapter.ts` | Legacy Canvas 模式下的节点位置适配 |
| `colors.ts` | 颜色工具 |
| `dom.ts` | DOM 操作工具 |
| `lora.ts` | LoRA 数据处理 |
| `numbers.ts` | 数值工具 |
| `object.ts` | 对象操作工具 |

---

## 7. 前端设计 — Model Manager Frontend

### 7.1 布局系统

`HikazeManagerLayout.vue` 实现动态 Tab 系统：
- Tab 从 API 动态加载 (`/api/models/get_types`)
- 支持 `initialTab` 自动解析
- 水平滚动 Tab 栏

### 7.2 状态管理

`useModelStore` composable：
- 模型列表缓存
- 按类型分组加载
- Tab 切换时触发数据加载

### 7.3 核心组件

| 组件 | 功能 |
|------|------|
| `ModelLibrary.vue` | 模型库卡片列表（搜索+标签过滤+懒加载+图片轮播） |
| `ModelDetails.vue` | 模型详情（图片+标签+描述+提示词） |
| `PendingModelLibrary.vue` | 待导入模型列表 |
| `PendingModelDetails.vue` | 待导入模型详情 |
| `HikazeImageGallery.vue` | 图片画廊（序列浏览） |
| `HikazeTagInput.vue` | 标签输入（三态选择：包含/排除/忽略） |
| `FloatingToolbar.vue` | 浮动工具栏 |
| `SelectedLoraBar.vue` | 已选 LoRA 展示栏 |

### 7.4 过滤系统

- **搜索**: 实时文本搜索
- **标签过滤**: AND 逻辑 + 三态选择（include/exclude/ignore）
- **NSFW 过滤**: 自动排除带 NSFW 标签的模型

### 7.5 懒加载

- `IntersectionObserver` 驱动的图片懒加载
- Placeholder 处理失败图片
- 模型卡片样式优化

---

## 8. 共享层设计

### 8.1 Python 共享类型 (`shared/types/`)

| 文件 | 内容 |
|------|------|
| `model_record.py` | `ModelRecord`, `PendingModelRecord`, `ModelSimpleRecord`, `Tag`, `MetaJson` 等 dataclass |
| `data_adapters.py` | `DataAdapters` — dict ↔ dataclass 双向转换 |
| `lora_list.py` | `LoRAListDocument` — LoRA 列表 JSON 文档类型 |

### 8.2 "No None Values" 策略

所有 dataclass 字段均不允许 `None` 值，使用默认值代替，确保数据流的鲁棒性。

### 8.3 前端共享代码 (`web/shared/`)

| 目录 | 内容 |
|------|------|
| `adapters/` | 前端数据适配器 |
| `types/` | TypeScript 类型定义 |
| `util/` | 共享工具函数 |

---

## 9. ComfyUI 集成机制

### 9.1 节点注册

通过 `ComfyExtension` V3 API 注册：
- `comfy_entrypoint()` → 返回 `HikazeModelManagerExtension`
- `get_node_list()` → `[HikazeCheckpointLoader, HikazeLoraPowerLoader]`

### 9.2 Payload 协议

前后端通过 `hikaze_payload` 隐藏 widget 交换结构化 JSON：

**Checkpoint Loader Payload**:
```json
{"ckpt_path": "/path/to/model.safetensors"}
```

**LoRA Power Loader Payload**:
```json
{
  "version": 2,
  "loras": [
    {
      "name": "lora_name",
      "full_path": "/path/to/lora.safetensors",
      "strength_model": 1.0,
      "strength_clip": 1.0,
      "enabled": true
    }
  ]
}
```

### 9.3 HikazeBaseNode

所有 Hikaze 节点的基类：
- `create_payload_input()` — 创建 socketless 隐藏输入
- `parse_payload()` — 安全解析 JSON payload
- 支持 `validate_inputs()`, `fingerprint_inputs()`, `check_lazy_status()`

### 9.4 生命周期

```
节点创建 → InjectionManager.onNodeCreated()
    → injectNode() → getOrCreateController()
    → controller.inject(ctx) → 挂载 Vue overlay

工作流加载 → InjectionManager.onLoadedGraphNode()
    → injectNode() → ...

模式切换 → VueNodes Setting Event
    → disposeAllControllers() → reinjectAllForMode()

工作流切换 → litegraph:set-graph Event
    → disposeAllControllers() → reinjectAllForMode()

节点折叠 → node.collapse() hook
    → collapse: disposeControllerIfExists()
    → un-collapse: scheduleReinjectSingleNode()

节点删除 → InjectionManager.onNodeRemoved()
    → disposeControllerIfExists()
```

---

## 10. 功能模块与修改时间对照表

| 功能模块 | 首次实现时间 | 主要修改时间 | 关键提交 |
|----------|-------------|-------------|----------|
| **项目初始化** | 2025-12-10 | 2025-12-10 | `4274c97` |
| **Checkpoint Loader 节点** | 2025-12-14 | 2025-12-14 | `43f533b` |
| **注入系统模块化** | 2025-12-14 | 2025-12-15 | PR #1 (`9780232`) |
| **LoRA Power Loader 节点** | 2025-12-15 | 2025-12-22 | `7501038` → `8161898` |
| **节点 Shell 重构** | 2025-12-18 | 2025-12-19 | `0208510` → `73241fb` |
| **LoRA 覆盖层 UI** | 2025-12-22 | 2025-12-22 | `8161898` |
| **LoRA 重构** | 2025-12-22 | 2025-12-22 | PR #2 (`1eba805`) |
| **数据库基础设施 (v3)** | 2025-12-23 | 2025-12-23 | `2ab44fb` → `c579a99` |
| **aiohttp 服务器** | 2025-12-23 | 2025-12-23 | `ab05b2b` → `7ebcec6` |
| **迁移控制器 API** | 2025-12-23 | 2025-12-23 | `474a9c0` → `b4e81c5` |
| **图像处理基础设施** | 2025-12-25 | 2025-12-25 | `ebf36bf` → `040be21` |
| **全局模态框服务** | 2025-12-25 | 2025-12-25 | `249cee4` → `912dfae` |
| **后端目录重构** | 2025-12-25 | 2025-12-25 | `f03402b` → `9293468` |
| **DB Schema 重构** | 2025-12-25 | 2025-12-26 | PR #7 (`2fcc3ec`) |
| **多质量图像处理** | 2025-12-25 | 2025-12-27 | `f72d753` → `905ab90` |
| **Legacy 数据库迁移** | 2025-12-26 | 2025-12-27 | `8edffba` → `002367b` |
| **双句柄数据库管理** | 2025-12-26 | 2025-12-26 | `cd09c03` |
| **ComfyUI 集成 Hook** | 2025-12-24 | 2025-12-24 | `b5466af` → `8a49b02` |
| **前端脚手架** | 2025-12-23 | 2025-12-23 | `8d51921` |
| **扩展包重构** | 2025-12-28 | 2025-12-28 | PR #9 (`98b506e`) |
| **待导入模型 API** | 2025-12-27 | 2025-12-28 | `4d14862` → `bd728ee` |
| **Tab 系统开发** | 2025-12-29 | 2025-12-29 | PR #10 (`aaa42f7`) |
| **模型库开发** | 2025-12-29 | 2025-12-29 | `24cfde0` → `04d91bd` |
| **标签过滤 + 懒加载** | 2025-12-29 | 2025-12-29 | `05adab4` → `f78584e` |
| **详情面板** | 2025-12-30 | 2025-12-30 | PR #14 (`3266a50`) |
| **图片画廊组件** | 2025-12-30 | 2025-12-30 | `ee27a87` → `6f79d49` |
| **浮动工具栏** | 2025-12-30 | 2025-12-30 | `7f53580` |
| **待导入模型开发** | 2025-12-30 | 2025-12-30 | `c1895ac` |
| **API 修复与扩展** | 2025-12-30 | 2025-12-30 | `d117a3c` → `966eb3b` |
| **大型重构** | 2025-12-31 | 2026-01-06 | PR #15 (`b0b7c0d`) |
| **数据结构重构** | 2025-12-31 | 2025-12-31 | `7b31887` → `9b38042` |
| **数据适配器实现** | 2026-01-04 | 2026-01-04 | `af8795e` |
| **服务层重构** | 2026-01-04 | 2026-01-04 | `8178763` |
| **Manager UI 增强** | 2026-01-06 | 2026-01-06 | `b0b7c0d` |
| **待导入模型升级优化** | 2026-01-28 | 2026-01-29 | PR #16 (`5821e54`) |
| **全屏模态框重构** | 2026-01-29 | 2026-01-29 | `119ccce` → `5ec08f0` |
| **嵌入式模态框实现** | 2026-01-29 | 2026-01-29 | `06f47b7` → `eacfd83` |
| **重构模态框分支** | 2026-02-04 | 2026-02-06 | `8b2810d` → `fa12c18` |
| **Legacy 节点布局** | 2026-02-12 | 2026-02-12 | `dad6918` |
| **Legacy Canvas 覆盖层** | 2026-04-03 | 2026-04-04 | `190faef` → `4872fc4` |

---

## 11. Git 提交历史与分支合并详解

### 11.1 PR 合并记录

| PR | 分支 | 合并时间 | 主要变更 |
|----|------|----------|----------|
| #1 | `modularized-injection` | 2025-12-15 | 注入系统模块化重构；LoRA Loader 占位 |
| #2 | `refactor-lora-power-loader` | 2025-12-22 | LoRA 覆盖层 UI 实现；HikazeNodeFrame 采用；注入修复 |
| #3 | `Backend-development-of-LoRA-power-loader` | 2025-12-23 | LoRA Power Loader 后端开发；Conductor 驱动开发 |
| #4 | `conductor-work` | 2025-12-23 | Conductor 设置；许可证更新 |
| #5 | `conductor-work` | 2025-12-23 | 数据库基础设施 v3；aiohttp 服务器；迁移控制器 |
| #6 | `conductor-work` | 2025-12-25 | 图像处理；全局模态框服务；后端目录重构；ComfyUI 集成 Hook |
| #7 | `refactor-db-schema` | 2025-12-26 | DB Schema 重构；双句柄数据库；待导入模型 API |
| #8 | `conductor-work` | 2025-12-27 | 迁移逻辑大重构；图像处理器升级；Legacy 导入 |
| #9 | `refactor-extension-packages` | 2025-12-28 | 扩展包重构；待导入端点 |
| #10 | `tabs_dev` | 2025-12-29 | Tab 系统开发；动态 UI |
| #14 | `detail-pane` | 2025-12-30 | 详情面板；图片画廊；标签输入；浮动面板 |
| #15 | `large-refactor` | 2026-01-06 | 大型重构；Manager UI 增强；数据适配器 |
| #16 | `promotion-of-pending-models&-other-optimizations` | 2026-01-29 | 待导入模型升级；文档迁移 |

### 11.2 开发阶段时间线

#### 阶段 1：基础搭建（2025-12-10 ~ 2025-12-15）

| 日期 | 提交 | 说明 |
|------|------|------|
| 12-10 | `4274c97` | 项目初始化 |
| 12-14 | `43f533b` | 添加 Checkpoint Loader 节点 |
| 12-14 | `0e62c88` | 注入系统模块化更新 |
| 12-15 | `f787e16` | 更新注入方法 |
| 12-15 | `7501038` | 添加 LoRA Loader 占位 |
| 12-15 | `561a6b2`/`9481d3d` | 更新后端 dataclass |
| 12-15 | PR #1 合并 | 注入系统模块化完成 |

#### 阶段 2：LoRA Power Loader 开发（2025-12-18 ~ 2025-12-23）

| 日期 | 提交 | 说明 |
|------|------|------|
| 12-18 | `0208510` | 重构节点 Shell |
| 12-19 | `73241fb` | 清理和重构 |
| 12-22 | `2746f8b` | 重构 LoRA Loader |
| 12-22 | `8161898` | 实现 LoRA 覆盖层 UI + 数据 Schema 更新 |
| 12-22 | `dd0d766` | 采用 HikazeNodeFrame + 修复 CSS 注入 |
| 12-22 | `96dc033` | 修复未初始化节点问题 |
| 12-22 | `1eba805` | 重命名 LoRA 列表元素 props |
| 12-22 | PR #2 合并 | LoRA 重构完成 |
| 12-22 | `fb76848` | 修复 UI |
| 12-23 | `793fccf` | Conductor 驱动的后端开发 |
| 12-23 | PR #3 合并 | LoRA 后端开发完成 |

#### 阶段 3：后端基础设施（2025-12-23 ~ 2025-12-25）

| 日期 | 提交 | 说明 |
|------|------|------|
| 12-23 | `62312c3` | 创建数据库配置模块 |
| 12-23 | `2ab44fb` | 实现 DatabaseManager 和 Schema 初始化 |
| 12-23 | `05b25a9` | 实现 Model CRUD 操作 |
| 12-23 | `c579a99` | 实现 Tag CRUD 操作 |
| 12-23 | `b34278d` | 从 ComfyUI folder_paths 动态获取 SYSTEM_TAGS |
| 12-23 | `ab05b2b` | 创建服务器模块结构 + PortFinder |
| 12-23 | `7ebcec6` | 实现 aiohttp 服务器逻辑和生命周期 |
| 12-23 | `7dce7ce` | 添加独立入口点 |
| 12-23 | `474a9c0` | 实现同步导入 (Stage 1) |
| 12-23 | `8924dd8` | 实现异步迁移 Worker (Stage 2) |
| 12-23 | `b4e81c5` | 实现迁移控制器 API |
| 12-23 | PR #4 合并 | Conductor 设置 |
| 12-23 | PR #5 合并 | 数据库+服务器基础设施 |
| 12-23 | `8d51921` | 前端脚手架和基础 UI |
| 12-24 | `b5466af` | 实现服务器和数据库初始化 Hook |
| 12-24 | `f619e30` | 修复绝对导入 → 相对导入 |
| 12-24 | `8a49b02` | 修复 sys.path 注入 |
| 12-25 | `f03402b` | 创建后端 Python 包结构 |
| 12-25 | `b70a87d` | 移动数据库和配置模块 |
| 12-25 | `9293468` | 拆分服务器为 instance + router |
| 12-25 | `ebf36bf` | 实现 ImageProcessor（2MP + WebP 压缩） |
| 12-25 | `040be21` | 实现图片服务/上传 API 路由 |
| 12-25 | `249cee4` | 实现 Modal Service + 注入到控制器 |
| 12-25 | `912dfae` | 创建全局模态框包装器 |

#### 阶段 4：数据库 Schema 重构与迁移（2025-12-25 ~ 2025-12-27）

| 日期 | 提交 | 说明 |
|------|------|------|
| 12-25 | `f72d753` | 实现多质量（高/中/低）图像处理 |
| 12-25 | `41aff96` | 实现 Shadow File Generator（测试用） |
| 12-25 | `c9bec3f` | 实现 Mock Hasher（开发模式） |
| 12-25 | `27a96cd` | 更新 Legacy 导入器（多质量图像处理） |
| 12-25 | `3c26b03` | 重构调试工具 + 独立路径重写导入器 |
| 12-26 | `bd71fc7` | 更新 tags Schema → 仅 id + name |
| 12-26 | `be1dc04` | 更新 pending_import Schema + 外键 |
| 12-26 | `91d5af8` | 定义 db_meta 键值表 |
| 12-26 | `c179e2c` | 对齐 models Schema + 修复测试 |
| 12-26 | `678b124` | 重命名 system_tags → system_types |
| 12-26 | `cd09c03` | 重构 DatabaseManager（双句柄 + 只读 Legacy 访问） |
| 12-26 | `ddb2575` | 修复 Legacy DB 检查路由 |
| 12-26 | `14d7fba` | Legacy DB 初始化错误传播为 502 |
| 12-26 | `e7bf29b` | 更新迁移管道匹配新 Schema |
| 12-26 | `18ee790` | 添加批量/单件导入 API 占位 |
| 12-26 | `7a1d691` | 优化 import_a_pending_model 逻辑 |
| 12-26 | PR #7 合并 | DB Schema 重构完成 |
| 12-26 | `8edffba` | 实现 Stage 1 Legacy 导入（DB + Images） |
| 12-26 | `002367b` | 实现 Stage 2 Reactive 迁移 + API |
| 12-26 | `1a80de1` | 大规模 DB + 迁移逻辑重构 |
| 12-27 | `905ab90` | 升级图像处理器（序列支持 + 升级逻辑） |
| 12-27 | `a4e6dad` | Legacy 迁移后清除 meta_json 中的图片路径 |
| 12-27 | `51643d3` | 对齐待导入逻辑为 ID-based 流 |
| 12-27 | `91cbf85` | 清理废弃的迁移逻辑 |
| 12-27 | PR #8 合并 | 迁移逻辑重构 |

#### 阶段 5：前端功能开发（2025-12-28 ~ 2025-12-30）

| 日期 | 提交 | 说明 |
|------|------|------|
| 12-28 | `98b506e`/`8764f15` | 扩展包重构开发 |
| 12-28 | `4d14862` | 实现待导入端点 + 图片样例列表 |
| 12-28 | `bd728ee` | 更新导入模型 API |
| 12-28 | PR #9 合并 | 扩展包重构 |
| 12-29 | `4df0d51` | 添加 fetchModelTypes API 函数 |
| 12-29 | `4a2ec81` | 添加 Tab 状态和加载逻辑 |
| 12-29 | `1d2420b` | 实现动态 Tab 栏 |
| 12-29 | `b9ae411` | 实现 initialTab 解析 |
| 12-29 | `33e3641` | 移除硬编码 mock tabs |
| 12-29 | PR #10 合并 | Tab 系统开发完成 |
| 12-29 | `ffee8aa` | 添加按类型获取模型（含标签）方法 |
| 12-29 | `24cfde0` | 实现 GET /api/models 端点 |
| 12-29 | `df68154` | 简化 /api/models 响应（排除 meta_json） |
| 12-29 | `d31df62` | 添加 Model 接口 + fetchModels API |
| 12-29 | `5dd99c9` | 实现 useModelStore composable |
| 12-29 | `a853e9b` | Tab 切换时触发模型加载 |
| 12-29 | `dabf77c` | 重构 ModelLibrary 消费 store 数据 |
| 12-29 | `05adab4` | 实现响应式搜索 + 标签过滤 |
| 12-29 | `7c02e4a` | 添加刷新按钮 |
| 12-29 | `686a079` | 优化标签过滤（AND 逻辑 + 三态选择） |
| 12-29 | `ac05a10` | 实现图片懒加载 |
| 12-29 | `9d6ecc5` | 应用懒加载属性和样式 |
| 12-29 | `f78584e` | 添加失败图片占位符 |
| 12-29 | `45344f5` | 实现 GET /api/tags + 自动排除 NSFW 标签 |
| 12-29 | `4e952c9` | 修复 IntersectionObserver 集成 |
| 12-29 | `7ba711b` | 启用并样式化水平滚动条 |
| 12-29 | `04d91bd` | 模型库开发完成 |
| 12-30 | `d117a3c` | 实现 GET /api/models/sha256 |
| 12-30 | `20b0eae` | 实现 GET /api/images/get_img_num |
| 12-30 | `c68c228` | 重构图片获取（支持 seq 参数） |
| 12-30 | `9d9bb80` | 实现 DELETE /api/images/delete（含序列移位） |
| 12-30 | `a77c609` | 实现 POST /api/tags_add |
| 12-30 | `966eb3b` | 实现 PATCH /api/models/{sha256} |
| 12-30 | `ee27a87` | 实现 ImageGallery + TagInput 组件 |
| 12-30 | `61281e1` | 修复新组件 TypeScript 错误 |
| 12-30 | `c62c946` | 集成 Model Details 到新组件 |
| 12-30 | `6f79d49` | 重构 ModelLibrary（图片轮播 + 序列预览） |
| 12-30 | `0558d46` | 修复 Library ↔ Details 模型选择事件 |
| 12-30 | `7f53580` | 添加浮动面板 |
| 12-30 | `89c3279` | 完成浮动功能面板 + 待导入模型 API 轨道 |
| 12-30 | PR #14 合并 | 详情面板集成 |
| 12-30 | `c1895ac` | 修复待导入模型行为 |

#### 阶段 6：大型重构（2025-12-31 ~ 2026-01-06）

| 日期 | 提交 | 说明 |
|------|------|------|
| 12-31 | `8c48199` | 更新样式 |
| 12-31 | `7b31887` | 数据结构重构 WIP |
| 12-31 | `55c6104` | 合并 detail-pane 分支 |
| 12-31 | `9b38042` | 重构后端数据结构 |
| 12-31 | `c89ab49` | 移除脚本 |
| 12-31 | `99ae78d` → `d280030` | Dataclass 定型 + DB 简化 + Legacy 适配器重构 |
| 01-01 | `2cd6283` → `4fd3bf0` | 共享基础 + 类型统一 |
| 01-04 | `27c39b6` → `9f2fb5a` | 分析与逻辑映射 |
| 01-04 | `8178763` → `d6a4442` | 逻辑重定位 + 服务层实现 |
| 01-04 | `54dafa2` → `af8795e` | 后端迁移修复 + 数据适配器实现 |
| 01-05 | `28796fa` | 迁移到 Codex Skills |
| 01-05 | `f6b1037` | 大范围重构 |
| 01-06 | `b0b7c0d` | 增强 Manager UI + LoRA 选择流程 |
| 01-06 | PR #15 合并 | 大型重构完成 |

#### 阶段 7：文档迁移与模态框重构（2026-01-07 ~ 2026-02-12）

| 日期 | 提交 | 说明 |
|------|------|------|
| 01-07 | `aa924b0` | 开发 |
| 01-28 | `faa2cde` → `5821e54` | 产品/技术文档迁移 |
| 01-29 | `35283db` → `9cc3452` | 上下文菜单 + 全局入口（Phase 1） |
| 01-29 | `119ccce` → `2427fca` | 全屏模态框重构（Phase 2） |
| 01-29 | `b3742f2` → `58f7503` | LoRA Power Loader 分析（Phase 3） |
| 01-29 | `090e4ee` → `eacfd83` | API + 基础设施 → 嵌入式模态框（Phase 1-4） |
| 01-29 | `5ec08f0` → `fa12c18` | 嵌入式模态框实现 → 最终化 |
| 01-29 | `eb40401` | 构建 Vue（master 分支） |
| 01-29 | PR #16 合并 | 待导入模型升级优化 |
| 02-04 | `8b2810d` | 前端开发（refactor-modals 分支） |
| 02-06 | `fa12c18` | Phase 4 最终化 |
| 02-08 | `07981c0` → `eacfd83` | Phase 4 文档与最终化 |
| 02-12 | `dad6918` | 更新 Conductor（legacy_node_layout 分支） |

#### 阶段 8：Legacy Canvas 覆盖层（2026-04-03 ~ 2026-04-04）

| 日期 | 提交 | 说明 |
|------|------|------|
| 04-03 | `190faef` | feat: 实现 Legacy Canvas 模式下的 HTML 覆盖层渲染 |
| 04-04 | `4872fc4` | fix: Legacy 覆盖层定位、缩放、清理 + LoRA 选择器布局 |
| 04-04 | `c0bb941` | update（当前 HEAD） |

### 11.3 分支一览

| 分支 | 最后提交时间 | 状态 | 说明 |
|------|-------------|------|------|
| `master` | 2026-01-29 | 稳定 | 主分支，Vue 构建完成 |
| `qwen-test` (HEAD) | 2026-04-04 | 活跃 | 当前开发分支，Legacy Canvas 覆盖层 |
| `refactor-modals` | 2026-02-06 | 已合并? | 模态框重构 |
| `legacy_node_layout` | 2026-02-12 | 已合并? | Legacy 节点布局 |
| `large-refactor` | 2026-01-06 | 已合并 | 大型重构（PR #15） |
| `promotion-of-pending-models&-other-optimizations` | 2026-01-29 | 已合并 | 待导入升级（PR #16） |
| `detail-pane` | 2025-12-30 | 已合并 | 详情面板（PR #14） |
| `tabs_dev` | 2025-12-29 | 已合并 | Tab 系统（PR #10） |
| `model_lib_dev` | 2025-12-29 | 已合并 | 模型库开发 |
| `codex-work` | 2025-12-29 | 已合并 | Codex 文档工作 |
| `refactor-extension-packages` | 2025-12-28 | 已合并 | 扩展包重构（PR #9） |
| `pending-import-development` | 2025-12-30 | 开发中 | 待导入开发 |
| `pending_import_dev_new` | 2025-12-29 | 开发中 | 待导入开发（新） |
| `refactor-db-schema` | 2025-12-26 | 已合并 | DB Schema 重构（PR #7） |
| `modularized-injection` | 2025-12-15 | 已合并 | 注入模块化（PR #1） |
| `move-utilities` | 2025-12-16 | 已合并 | 工具移动 |
| `refactor-lora-power-loader` | 2025-12-22 | 已合并 | LoRA 重构（PR #2） |
| `Backend-development-of-LoRA-power-loader` | 2025-12-23 | 已合并 | LoRA 后端（PR #3） |
| `conductor-work` | 2025-12-29 | 已合并 | Conductor 工作 |

---

## 12. Conductor 开发工作流

### 12.1 概述

项目使用自研的 **Conductor** 工具进行阶段化开发管理。每个功能轨道按 Phase 划分，每个 Phase 包含 Checkpoint → Plan → 实现的循环。

### 12.2 Conductor 目录结构

```
conductor/
├── product.md              # 产品定义
├── product-guidelines.md   # 产品指南
├── tech-stack.md           # 技术栈文档
├── workflow.md             # 工作流定义
├── tracks.md               # 开发轨道记录
├── setup_state.json        # 设置状态
├── archive/                # 已完成的轨道归档
├── code_styleguides/       # 代码风格指南
├── discrepancies/          # 差异报告
└── tracks/                 # 活跃轨道
```

### 12.3 工作流模式

1. **Phase 规划** — `conductor(plan): Mark phase 'XXX' as complete`
2. **Checkpoint** — `conductor(checkpoint): Checkpoint end of Phase N`
3. **实现提交** — `feat/fix/refactor: 具体变更`
4. **Notes** — `Notes added by 'git notes add'`（Conductor 自动附加的元数据）

### 12.4 主要开发轨道

| 轨道 | 时间 | 阶段数 | 说明 |
|------|------|--------|------|
| Database Infrastructure (v3 Schema) | 2025-12-23 | 1 | 数据库基础设施 |
| Frontend Scaffold & Basic UI | 2025-12-23 | 2 | 前端脚手架 |
| ComfyUI Integration Hook | 2025-12-24 | 3 | ComfyUI 集成 |
| Global Modal Service | 2025-12-25 | 1 | 全局模态框服务 |
| Image Processing Infrastructure | 2025-12-25 | 2 | 图像处理 |
| Schema and Metadata | 2025-12-26 | 1 | Schema 重构 |
| Database Manager Refactor | 2025-12-26 | 2 | DB 管理器重构 |
| Legacy Migration Pipeline | 2025-12-26~27 | 4 | Legacy 迁移管道 |
| Image Processor Upgrade | 2025-12-27 | 1 | 图像处理器升级 |
| Setup & API Integration (Tabs) | 2025-12-29 | 1 | Tab API 集成 |
| Dynamic UI Implementation | 2025-12-29 | 2 | 动态 UI |
| Model Library Development | 2025-12-29 | 5 | 模型库开发 |
| API Restoration & Extension | 2025-12-30 | 1 | API 修复扩展 |
| Frontend Image Gallery & Tag | 2025-12-30 | 3 | 图片画廊+标签 |
| Details Pane Integration | 2025-12-30 | 4 | 详情面板集成 |
| Comprehensive Codebase Audit | 2025-12-30 | 4 | 代码审计 |
| Floating Function Panel | 2025-12-30 | 1 | 浮动功能面板 |
| Model Details Form Refactor | 2025-12-30 | 2 | 模型详情表单 |
| Dataclass Finalization | 2025-12-31 | 4 | Dataclass 定型 |
| Shared Foundation | 2026-01-01 | 1 | 共享基础 |
| Analysis & Logic Mapping | 2026-01-04 | 1 | 分析与逻辑映射 |
| Logic Relocation & Service Layer | 2026-01-04 | 2.5 | 逻辑重定位 |
| Data Adapter Implementation | 2026-01-04 | 3 | 数据适配器 |
| Context Menu & Global Entry | 2026-01-29 | 1 | 上下文菜单 |
| Fullscreen Modal Refactor | 2026-01-29 | 2 | 全屏模态框 |
| LoRA Power Loader Analysis | 2026-01-29 | 3 | LoRA 分析 |
| API and Infrastructure | 2026-01-29 | 1 | API 基础设施 |
| Standalone Implementation | 2026-01-29 | 2 | 独立实现 |
| Embedded Modal Implementation | 2026-01-29 | 3 | 嵌入式模态框 |
| Documentation & Finalization | 2026-02-08 | 4 | 文档与最终化 |

---

*本报告基于 Git 历史和代码分析自动生成，涵盖了 Hikaze Model Manager 2 项目的完整设计架构、功能模块、开发时间线和所有重要的提交与分支合并记录。*

---

## 13. 软件工程模式分析

> 本章节从现代软件工程角度审视项目架构，识别符合最佳实践的设计模式和存在问题的反模式。

### 13.1 ✅ 符合现代软件工程模式的设计

#### 13.1.1 分层架构 (Layered Architecture)

**优秀实践**: 后端清晰地分为 `server` / `database` / `util` 三层，API Handler → DatabaseManager → SQLite 的调用链路清晰。

- Handler 只负责请求解析和响应格式化
- DatabaseManager 封装所有数据访问逻辑
- 符合 **关注点分离 (Separation of Concerns)** 原则

**工程意义**: 分层架构使各层可以独立演化，便于测试和维护。

#### 13.1.2 单例模式 (Singleton Pattern)

**优秀实践**: `DatabaseManager` 使用 `__new__` + `threading.Lock` 实现线程安全单例：

```python
def __new__(cls):
    if cls._instance is None:
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(DatabaseManager, cls).__new__(cls)
```

- 符合 GoF 单例模式的最佳实践
- 双重检查锁定 (Double-Checked Locking) 正确实现
- 使用 `threading.local` 管理线程本地连接

**工程意义**: 确保全局只有一个数据库连接管理器，避免资源竞争。

#### 13.1.3 前后端结构化数据交换协议

**优秀实践**: `hikaze_payload` 隐藏 widget + JSON 协议是一个巧妙的 ComfyUI 集成方案。

- 将 Vue 前端状态与 Python 后端通过 JSON 解耦
- `socketless=True` + `multiline=True` 的 widget 设计合理
- Payload 协议有版本号 (`version: 2`)，便于向前兼容

**工程意义**: 在 ComfyUI 的约束下实现了优雅的跨层通信。

#### 13.1.4 Controller Registry 模式

**优秀实践**: `BaseHikazeNodeController.registry` 提供了节点类型到控制器的映射：

```typescript
static readonly registry = new Map<string, HikazeNodeControllerConstructor>()
static register(nodeType: string, ctor: HikazeNodeControllerConstructor) { ... }
static resolve(nodeType: string): HikazeNodeControllerConstructor | undefined { ... }
```

- 符合 **策略模式 (Strategy Pattern)**
- 新节点类型只需 `register()` 即可接入注入系统
- 遵循 **开闭原则 (OCP)**：对扩展开放，对修改关闭

**工程意义**: 插件化的节点控制器架构，易于扩展新节点类型。

#### 13.1.5 Dataclass + "No None Values" 策略

**优秀实践**: 使用 Python `@dataclass(slots=True)` 替代原始字典：

```python
@dataclass(slots=True)
class ModelRecord:
    sha256: str
    path: str
    name: str
    ...
```

- `slots=True` 减少内存开销（约 40% 内存节省）
- 显式类型标注提高可维护性
- `DataAdapters` 中 `or ""` / `or 0` 模式消除 None 值，减少空指针异常风险

**工程意义**: 类型安全的内部数据流，减少运行时错误。

#### 13.1.6 独立服务器架构

**优秀实践**: 将管理器服务器独立于 ComfyUI 的 PromptServer，通过端口发现机制连接。

- 避免侵入 ComfyUI 主进程
- 可独立部署和测试
- CORS 中间件正确处理跨域
- `PortFinder` 自动发现可用端口

**工程意义**: 微服务思想的轻量实现，降低系统耦合度。

#### 13.1.7 Conductor 阶段化开发

**优秀实践**: 自研的 Conductor 工具实现了结构化的开发管理：

- Phase → Checkpoint → Implement 的循环
- 每次 Checkpoint 自动记录状态
- 提供可追溯的开发历史

**工程意义**: 类似于 Scrumban 的轻量项目管理，适合个人/小团队。

#### 13.1.8 响应式状态管理

**优秀实践**: 前端使用 Vue 3 Composition API 的 `reactive`/`ref`/`computed` 实现状态管理：

```typescript
async function loadModels(type: string, force = false) {
    if (cachedModels[type] && !force) return;
    loadingTypes[type] = true;
    try {
        const models = await fetchModels(type);
        cachedModels[type] = models;
    } finally {
        loadingTypes[type] = false;
    }
}
```

- 缓存策略避免重复请求
- `computed` 实现派生状态的懒计算
- 按类型分组的加载/错误状态管理

**工程意义**: 轻量级状态管理，避免过度引入全局状态库。

---

### 13.2 ❌ 不符合或冗余的设计

#### 13.2.1 🔴 N+1 查询问题 (Critical)

**问题**: `handle_get_models` 中对每个模型单独查询标签：

```python
for m in raw_models:
    # ... 每个模型都调用一次 get_tags_for_model()
    tag_rows = db.get_tags_for_model(record.sha256)
```

**影响**: 当模型数量为 N 时，产生 N+1 次 SQL 查询。在大型模型库中（100+ 模型）性能严重退化。

**建议**: 使用 JOIN 或批量 IN 查询一次性获取所有标签：

```python
# 推荐方案：批量查询
sha256_list = [m["sha256"] for m in raw_models]
placeholders = ", ".join(["?"] * len(sha256_list))
tag_rows = db.execute_query(
    f"SELECT mt.model_hash, t.id, t.name FROM tags t "
    f"JOIN model_tags mt ON t.id = mt.tag_id "
    f"WHERE mt.model_hash IN ({placeholders})",
    tuple(sha256_list)
)
# 然后在 Python 中按 model_hash 分组
```

#### 13.2.2 🔴 `requestAnimationFrame` 无条件轮询 (Critical)

**问题**: `BaseHikazeNodeController.startPositionSync()` 使用 `requestAnimationFrame` 持续轮询位置：

```typescript
const syncLoop = () => {
    // 即使没有变化，也会持续执行
    this.positionSyncTimer = window.requestAnimationFrame(syncLoop)
}
```

**影响**: 60fps 的持续轮询，即使节点完全静止也在消耗 CPU。每个 Hikaze 节点都会启动一个 RAF 循环，多节点时严重影响性能和电池寿命。

**建议**: 使用事件驱动替代持续轮询：

```typescript
// 推荐方案：仅在变化时同步
const observer = new MutationObserver(() => this.syncOverlayPosition());
observer.observe(canvasElement, { attributes: true, childList: true, subtree: true });
// 或监听 LiteGraph 的绘制事件
```

#### 13.2.3 🟡 过度的 Hydration 同步 (Medium)

**问题**: `scheduleHydrationSync` 使用 5 个定时器（0ms, 50ms, 150ms, 400ms, 800ms）轮询 widget 值：

```typescript
const delays = [0, 50, 150, 400, 800]
for (const delay of delays) {
    const timer = window.setTimeout(() => this.syncFromWidget(), delay)
}
```

**影响**: 这是一种"暴力同步"方式，表明对 ComfyUI widget 初始化时序缺乏可靠的事件驱动机制。5 次定时器创建不必要的 CPU 开销。

**建议**: 监听 ComfyUI 的 widget 初始化回调事件，而非定时轮询。或使用 `Promise` + 单次 `requestAnimationFrame` 的方式等待 DOM 就绪。

#### 13.2.4 🟡 `ensureFrameMounted` 递归重试 (Medium)

**问题**: 当 `nodeId` 为空时，使用 `setTimeout` 递归重试，最多 50 次：

```typescript
if (this.node.id == null || this.node.id === -1) {
    setTimeout(() => this.inject(ctx), 200)
}
// ensureFrameMounted 中:
if (nodeId == null) {
    this.vueMountRetryTimer = window.setTimeout(
        () => this.ensureFrameMounted(ctx, attemptsRemaining - 1), 50
    )
}
```

**影响**: 最差情况 50 × 50ms = 2.5s 的重试链，缺乏指数退避，也没有最大超时保护和失败回调。

**建议**: 使用指数退避 + 明确的超时上限：

```typescript
const MAX_RETRY = 10;
const BASE_DELAY = 50;
function retryWithBackoff(attempt: number) {
    const delay = BASE_DELAY * Math.pow(2, attempt);
    setTimeout(() => mount(attempt + 1), Math.min(delay, 2000));
}
```

#### 13.2.5 🟡 API Handler 中混杂业务逻辑 (Medium)

**问题**: `handle_update_model` 中包含了完整的业务逻辑（读取现有记录 → 更新字段 → 保存 → 更新标签 → 返回结果），违反了 `tech-stack.md` 中声明的 "Pure Controller" 模式：

```python
# 声明: "Pure Controller" pattern, delegating to Service classes
# 实际: 业务逻辑直接写在 handler 中
if "name" in data:
    record.name = data["name"]
    has_changes = True
```

**影响**: Handler 膨胀（233 行）、难以单元测试、逻辑复用困难。

**建议**: 引入 `ModelService` / `TagService` 服务层：

```python
# handler 只负责 HTTP 协议层
async def handle_update_model(request):
    sha256 = request.match_info.get("sha256", "")
    data = await request.json()
    result = await ModelService.update_model(sha256, data)
    return web.json_response(DataAdapters.to_dict(result))
```

#### 13.2.6 🟡 `OldMetaJson` / `MetaJson` 双数据类型 (Medium)

**问题**: 同时存在两个版本的元数据 dataclass：

```python
@dataclass(slots=True)
class MetaJson:
    images_count: int  # 新版：图片计数

@dataclass(slots=True)  
class OldMetaJson:
    images: list[str]  # 旧版：图片路径列表
```

**影响**: 迁移过渡期遗留产物。`PendingModelRecord` 仍使用 `OldMetaJson`，说明迁移未完成。增加了 `DataAdapters` 的复杂度（需要两套转换方法）。

**建议**: 完成迁移后统一为 `MetaJson`，或使用版本化元数据策略（如 `meta_version` 字段 + 工厂方法）。

#### 13.2.7 🟡 全局模块级状态 (Medium)

**问题**: `useModelStore` composable 使用模块级 `reactive` 变量：

```typescript
const cachedModels = reactive<Record<string, Model[]>>({});
const loadingTypes = reactive<Record<string, boolean>>({});
const errorTypes = reactive<Record<string, string | null>>({});
```

**影响**: 模块加载时就创建状态，而非在组件实例化时。这在 SSR 场景下会导致状态泄漏；虽然当前是纯客户端，但不符合 Vue 3 推荐的 composable 模式。

**建议**: 将状态放入 composable 函数内部，或使用 Pinia 的 `defineStore`：

```typescript
// 推荐方案：Pinia
export const useModelStore = defineStore('models', () => {
    const cachedModels = reactive<Record<string, Model[]>>({});
    // ...
});
```

#### 13.2.8 🟡 `from .xxx import *` 通配符导入 (Low)

**问题**: `router.py` 使用通配符导入：

```python
from .library_info_handler import *
from .images_handler import *
from .migration_handler import *
```

**影响**: 命名空间污染，无法从导入语句判断函数来源模块，IDE 无法提供有效代码补全和类型检查。

**建议**: 使用显式导入：

```python
from .library_info_handler import (
    handle_get_model_types, handle_get_models,
    handle_get_model_details, handle_update_model,
    handle_get_tags, handle_add_tags
)
```

#### 13.2.9 🟡 Schema 硬编码在 Python 代码中 (Low)

**问题**: 数据库 Schema 以 SQL 字符串形式硬编码在 `consts.py` 中，`db_meta` 表记录版本号但没有实际使用它做迁移。

**影响**: 缺乏版本化迁移机制。Schema 变更需要手动管理，没有 `ALTER TABLE` 迁移脚本。与 ComfyUI 主项目使用的 Alembic 不一致。

**建议**: 使用 Alembic 或类似工具管理数据库迁移，与 ComfyUI 主项目的 Alembic 基础设施对齐。

#### 13.2.10 🟢 Conductor 产出大量 Git Notes (Low)

**问题**: Git 历史中有大量 `Notes added by 'git notes add'` 提交，这些是 Conductor 自动生成的元数据。

**影响**: 污染 Git 历史，使 `git log` 可读性下降。真正的代码变更被 Conductor 提交稀释。

**建议**: Conductor 状态应存储在仓库外（如本地 `.conductor/` 目录加入 `.gitignore`），而非提交到 Git。

#### 13.2.11 🟢 未使用的代码和分支 (Low)

**问题**:
- `conductor/` 目录包含大量归档数据，作为仓库的一部分提交
- 多个开发分支（`pending-import-development`, `pending_import_dev_new`）长期处于未合并状态
- `scripts/api_test.py` 和 `replace_images_with_placeholders.py` 可能已过时

**影响**: 增加仓库体积，混淆项目状态。

**建议**: 清理过期分支；将 Conductor 归档移出仓库；标记或移除过时脚本。

---

### 13.3 📊 总结评分

| 维度 | 评分 | 说明 |
|------|------|------|
| **架构分层** | ⭐⭐⭐⭐ | 后端三层分离清晰，但 Handler 层业务逻辑渗透 |
| **设计模式** | ⭐⭐⭐⭐ | 单例、策略、适配器模式使用恰当 |
| **性能** | ⭐⭐⭐ | N+1 查询和 RAF 轮询是主要瓶颈 |
| **可维护性** | ⭐⭐⭐ | Dataclass 类型安全好，但双元数据类型增加复杂度 |
| **可测试性** | ⭐⭐⭐ | Handler 逻辑耦合降低可测试性，缺少 Service 层 |
| **代码风格** | ⭐⭐⭐ | 通配符导入、暴力重试等不符合最佳实践 |
| **工程化** | ⭐⭐⭐⭐ | Conductor 工具创新，但 Git 污染需要改善 |

### 13.4 优先改进建议

| 优先级 | 改进项 | 预期收益 | 实施难度 |
|--------|--------|----------|----------|
| P0 | 修复 N+1 查询 | 大幅提升模型列表 API 性能 | 低 |
| P0 | 替换 RAF 轮询为事件驱动 | 降低 CPU 占用，改善电池寿命 | 中 |
| P1 | 抽取 Service 层 | 提高可测试性和代码复用 | 中 |
| P1 | 统一元数据类型 | 简化数据适配器，消除技术债务 | 低 |
| P2 | 改进重试机制 | 更健壮的初始化流程 | 低 |
| P2 | 改用显式导入 | 提高代码可读性和 IDE 支持 | 低 |
| P3 | 引入数据库迁移工具 | 规范化 Schema 变更流程 | 中 |
| P3 | 清理 Conductor Git 提交 | 改善 Git 历史可读性 | 低 |

---

## 14. ComfyUI 外部依赖与注入性代码分析

> 本章节深入挖掘项目中所有受 ComfyUI 外部代码影响的关键耦合点，包括 Monkey Patch、非标准钩子、自定义钩子、注入性方法等，评估其风险等级和失效后果。

### 14.1 🔴 高风险 Monkey Patch

#### 14.1.1 `node.onRemoved` Monkey Patch

**位置**: `extensions/hikaze-model-manager.js` → `injectOnRemovedHook()`

```javascript
const originalOnRemoved = node.onRemoved;
node.onRemoved = function (...args) {
    try { manager.onNodeRemoved?.(node); } catch (e) { ... }
    return originalOnRemoved?.call(this, ...args);
};
```

**原因**: ComfyUI 的 `registerExtension` API **不提供** `nodeRemoved` 回调。项目通过运行时替换节点的 `onRemoved` 方法来监听节点删除。

**风险**: 如果 ComfyUI 修改了节点生命周期 API 或重命名该方法，补丁将静默失效，导致 DOM 覆盖层泄漏（已删除节点的覆盖层仍残留在画面上）。

**缓解建议**: 定期清理孤儿覆盖层（当前 `disposeAllControllers` 已有部分清理逻辑）；向 ComfyUI 上游提交 Feature Request 请求公开 `nodeRemoved` 事件。

---

#### 14.1.2 `node.collapse` Monkey Patch

**位置**: `injection/manager.ts` → `ensureCollapseHook()`

```typescript
const originalCollapse = node.collapse;
node.collapse = (...args: any[]) => {
    const wasCollapsed = !!node?.flags?.collapsed;
    try { return originalCollapse.call(node, ...args); }
    finally {
        const isCollapsed = !!node?.flags?.collapsed;
        if (wasCollapsed !== isCollapsed) {
            if (isCollapsed) this.disposeControllerIfExists(node);
            else this.scheduleReinjectSingleNode(node, 'collapse-changed');
        }
    }
};
```

**原因**: 需要检测节点的折叠/展开状态变化，以便在折叠时清理覆盖层、展开时重新注入。ComfyUI 不提供折叠变化事件。

**风险**: LiteGraph 的 `collapse` 方法签名或行为变化会导致覆盖层无法正确清理或重新注入。特别是如果 `collapse` 方法改为异步执行，`finally` 块中的状态检测将不再准确。

**缓解建议**: 使用 `MutationObserver` 监听节点 DOM 的 `collapsed` 类名变化，作为备用检测机制。

---

#### 14.1.3 `node.onWidgetChanged` Monkey Patch

**位置**: `injection/controllers/BaseHikazeNodeController.ts` → `ensureWidgetChangeHook()`

```typescript
this.onWidgetChangedOriginal = node.onWidgetChanged;
this.onWidgetChangedWrapper = (name, value, oldValue, widget) => {
    if (name === PAYLOAD_WIDGET) {
        this.payloadRef.value = String(value ?? '{}');
    }
    const original = this.onWidgetChangedOriginal;
    if (typeof original === 'function') {
        return original.call(node, name, value, oldValue, widget);
    }
};
node.onWidgetChanged = this.onWidgetChangedWrapper;
```

**原因**: 需要监听 `hikaze_payload` widget 值的变化，以保持 Vue 响应式状态与 widget 同步。ComfyUI 没有提供 widget 值变化的订阅机制。

**风险**: 如果 ComfyUI 改变了 widget 变更通知机制（如改为事件分发），此补丁将失效，导致前端状态与 widget 值不同步。

**缓解建议**: 在 `scheduleHydrationSync` 中已有定时轮询作为备用同步机制，但应考虑更健壮的事件监听方案。

---

#### 14.1.4 `widget.mouse` Monkey Patch

**位置**: `injection/controllers/BaseHikazeNodeController.ts` → `hookLegacyWidgetClick()`

```typescript
const originalMouse = widget.mouse;
widget.mouse = (event, pos, node) => {
    if (event.type === 'pointerdown' || event.type === 'mousedown') {
        const current = String(widget.value ?? '');
        const next = onPick(current);
        if (next !== null && next !== current) {
            this.commitPayload(next);
        }
        return true; // 阻止默认行为（如进入文本编辑模式）
    }
    return originalMouse ? originalMouse.call(widget, event, pos, node) : undefined;
};
```

**原因**: 需要拦截 widget 的鼠标点击事件，将其重定向到模型选择器 UI，而非默认的文本编辑行为。

**风险**: 完全依赖于 LiteGraph 的内部 widget 交互实现（`widget.mouse` 属性），这不是公开 API。如果 LiteGraph 重构 widget 交互为事件委托模式，此补丁将失效，用户无法通过点击打开模型选择器。

**缓解建议**: 考虑使用覆盖在 widget 上方的透明 HTML 元素拦截点击，而非直接修改 widget 的 `mouse` 处理器。

---

### 14.2 🟡 中风险 — 依赖 ComfyUI 内部结构

#### 14.2.1 `PromptServer.instance` 单例获取

**位置**: `__init__.py` → `register_sniffer_route()`

```python
from server import PromptServer
prompt_server = getattr(PromptServer, "instance", None)
if not prompt_server or not getattr(prompt_server, "app", None):
    LOGGER.warning("PromptServer is not available; sniffer route not registered.")
    return
prompt_server.app.router.add_get("/api/hikaze/sniffer_port", handle_sniffer_port)
```

**原因**: 需要在 ComfyUI 的主 HTTP 服务器上注册端口发现路由，以便前端获取 Hikaze Server 的实际端口。

**风险**: 直接访问 `PromptServer.instance` 并向其路由表注入自定义端点。这不是 ComfyUI 官方文档化的 API。如果 PromptServer 的初始化方式或实例暴露方式改变，路由注册将失败，前端无法发现后端端口。

**缓解建议**: 当前已有 `LOGGER.warning` 处理注册失败的情况。可考虑将端口信息写入文件作为备用发现机制。

---

#### 14.2.2 `folder_paths.folder_names_and_paths` 内部数据结构

**位置**: `backend/util/model_type_sniffer.py` → `_load_index()`

```python
import folder_paths
raw = folder_paths.folder_names_and_paths
supported_exts = set(getattr(folder_paths, "supported_pt_extensions", set()))
for type_name in types:
    paths, exts = raw[type_name]  # 直接遍历内部字典
```

**原因**: 需要获取 ComfyUI 注册的所有模型类型和搜索路径，以构建模型类型索引。

**风险**: `folder_names_and_paths` 是 ComfyUI 的内部数据结构，其键值格式可能随版本变化。项目已有文件缓存机制（`types_cache.json`）作为降级方案。

**缓解建议**: 当前的缓存降级策略已足够健壮。

---

#### 14.2.3 `comfy.cli_args.args.port` 命令行参数访问

**位置**: `__init__.py` → `init_services()`

```python
from comfy.cli_args import args
if hasattr(args, "port"):
    base_port = args.port
```

**原因**: 需要获取 ComfyUI 的监听端口，以确定 Hikaze Server 的基础端口。

**风险**: 依赖 `comfy.cli_args` 模块的内部 `args` 对象。如果参数名改变或模块结构重构，将回退到默认端口 8188，可能导致端口冲突。

**缓解建议**: 使用 `PortFinder` 从基础端口开始扫描，即使基础端口错误也能找到可用端口。当前实现已有足够的容错。

---

#### 14.2.4 `sys.path` 运行时注入

**位置**: `__init__.py`

```python
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)
```

**原因**: ComfyUI 的动态加载器不会将 custom_node 根目录加入 `sys.path`，导致 `from backend.xxx import yyy` 等绝对导入失败。

**风险**: 可能导致命名冲突——如果有其他包也叫 `backend` 或 `shared`，将产生不可预测的导入行为。

**缓解建议**: 考虑将所有导入改为相对导入（`from .backend.xxx import yyy`），逐步消除对 `sys.path` 注入的依赖。

---

### 14.3 🟡 中风险 — 依赖前端内部结构

#### 14.3.1 `LiteGraph.vueNodesMode` 全局状态检测

**位置**: `injection/manager.ts` → `getCurrentMode()`

```typescript
private getCurrentMode(): InjectionMode {
    const mode = (globalThis as any)?.LiteGraph?.vueNodesMode;
    if (typeof mode === 'boolean') return mode ? 'vue' : 'legacy'
    return document.querySelector("[data-testid='transform-pane']") ? 'vue' : 'legacy'
}
```

**原因**: 需要检测当前是 VueNodes 模式还是 Legacy Canvas 模式，以选择正确的覆盖层渲染策略。

**风险**: 依赖两个非标准检测方式：1) `LiteGraph.vueNodesMode` 全局属性；2) DOM 中是否存在 `data-testid='transform-pane'` 元素。两者都不是 ComfyUI 的公开 API。

**缓解建议**: 已有双重检测机制（先检查全局属性，再检查 DOM），降低了单一检测失效的风险。

---

#### 14.3.2 `app.canvas.ds` (DragScale) 内部状态

**位置**: `util/nodePositionAdapter.ts` → `canvasToScreen()`

```typescript
const ds = canvas.ds
const scale = ds?.scale ?? 1
const offset = ds?.offset ?? [0, 0]
```

**原因**: Legacy Canvas 模式下需要将图空间坐标转换为屏幕像素坐标，依赖 LiteGraph 的 DragScale 状态。

**风险**: 直接读取 LiteGraph 的 `DragScale` (ds) 内部对象的 `scale` 和 `offset` 属性。如果 LiteGraph 重构其画布缩放/偏移管理，所有 Legacy 模式的覆盖层定位将失效。

**缓解建议**: 封装 `getScale()`/`getOffset()` 访问器，集中管理降级逻辑。

---

#### 14.3.3 `widget.last_y` 绘制时计算的属性

**位置**: `util/nodePositionAdapter.ts` → `getTargetWidgetGeometry()`

```typescript
const widget = Array.isArray(this.node.widgets)
    ? this.node.widgets.find((w: any) => w?.name === widgetName)
    : undefined
const widgetY = (typeof widget?.last_y === 'number')
    ? widget.last_y
    : this.getWidgetsStartY()
```

**原因**: 需要精确定位覆盖层到 `hikaze_payload` widget 的位置。`last_y` 是 LiteGraph 在绘制节点时计算的 widget Y 坐标。

**风险**: `last_y` 不是公开 API，且在节点首次绘制前可能不存在（值为 `undefined`）。项目已有 `getWidgetsStartY()` 作为估算降级。

**缓解建议**: 当前的双重策略（优先 `last_y`，降级为估算）已足够健壮。

---

#### 14.3.4 `node.widgets_start_y` / `LiteGraph.NODE_SLOT_HEIGHT` 常量

**位置**: `util/nodePositionAdapter.ts` → `getWidgetsStartY()`

```typescript
if (typeof this.node?.widgets_start_y === 'number' && this.node.widgets_start_y > 0) {
    return this.node.widgets_start_y
}
const slotHeight = (globalThis as any)?.LiteGraph?.NODE_SLOT_HEIGHT ?? 20
return maxSlots * slotHeight
```

**原因**: 需要估算 widget 区域在节点内的起始 Y 偏移，以正确放置覆盖层。

**风险**: 依赖 LiteGraph 的 `widgets_start_y` 计算属性和 `NODE_SLOT_HEIGHT` 全局常量。如果 LiteGraph 修改节点布局算法或常量值，定位将偏移。

**缓解建议**: 当前的三重降级策略（`widgets_start_y` → IO 槽位数估算 → 默认值）已足够健壮。

---

### 14.4 📊 影响矩阵

| # | 耦合点 | 类型 | 风险等级 | ComfyUI 变更概率 | 失效后果 |
|---|--------|------|----------|-----------------|----------|
| 1 | `node.onRemoved` | Monkey Patch | 🔴 高 | 中 | DOM 覆盖层泄漏 |
| 2 | `node.collapse` | Monkey Patch | 🔴 高 | 中 | 覆盖层状态错误 |
| 3 | `node.onWidgetChanged` | Monkey Patch | 🔴 高 | 中 | 前后端状态不一致 |
| 4 | `widget.mouse` | Monkey Patch | 🔴 高 | 高 | 无法通过点击选择模型 |
| 5 | `PromptServer.instance` | 内部 API | 🟡 中 | 低 | 前端无法连接后端 |
| 6 | `folder_paths.*` | 内部数据 | 🟡 中 | 中 | 模型类型列表错误 |
| 7 | `cli_args.args` | 内部 API | 🟡 中 | 低 | 回退默认端口 |
| 8 | `sys.path` 注入 | 环境依赖 | 🟡 中 | 低 | 命名冲突 |
| 9 | `LiteGraph.vueNodesMode` | 全局状态 | 🟡 中 | 中 | 使用错误的渲染模式 |
| 10 | `canvas.ds.*` | 内部状态 | 🟡 中 | 中 | 覆盖层位置偏移 |
| 11 | `widget.last_y` | 绘制属性 | 🟡 中 | 高 | 覆盖层 Y 坐标错误 |
| 12 | `NODE_SLOT_HEIGHT` | 全局常量 | 🟡 中 | 低 | 位置估算偏差 |

### 14.5 🛡️ 缓解策略建议

| 策略 | 说明 | 优先级 |
|------|------|--------|
| **建立 ComfyUI API 兼容层** | 将所有外部依赖封装在 `comfyApiCompat.ts` / `comfy_api_compat.py` 中，集中管理版本检测和降级逻辑 | P1 |
| **Monkey Patch 统一注册表** | 所有补丁通过一个中心注册，支持批量卸载和版本兼容检测 | P1 |
| **运行时验证** | 对 `ds.scale`/`ds.offset`/`widget.last_y` 等内部属性添加类型和范围校验，异常时输出警告 | P2 |
| **监听 ComfyUI 更新** | 在 `setup()` 中检测 ComfyUI 版本号，对已知破坏性变更输出明确警告 | P2 |
| **推动上游 API** | 向 ComfyUI 提交 Feature Request，请求公开 `nodeRemoved`、`collapseChanged`、`widgetChanged` 等事件 | P3 |
| **替代 Mouse Patch** | 使用覆盖在 widget 上方的透明 HTML 元素拦截点击，而非修改 `widget.mouse` | P3 |
