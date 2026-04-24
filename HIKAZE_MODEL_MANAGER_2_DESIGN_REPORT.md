# Hikaze Model Manager 2 — 设计规范书

> **面向 AI Vibe Coding 的完整设计参考文档**
>
> 生成时间：2026-04-25
> 源码基准：`custom_nodes/Hikaze-Model-Manager-2`
> 版本：0.0.1（`pyproject.toml` 中声明版本，实际功能成熟度已达 release 级别）

---

## 1. 项目概述

Hikaze Model Manager 2 是 ComfyUI 自定义节点插件，提供**模型管理后台系统**和**节点内模型选择增强**。核心能力：

- **模型库**：浏览、搜索、过滤、查看详情、管理标签和图片
- **节点覆盖层**：在 Checkpoint Loader / LoRA Loader 节点上嵌入模型选择 UI
- **迁移系统**：从旧版 SQLite 数据库批量导入模型元数据，支持冲突策略
- **双前端架构**：Vue 3 管理界面（全屏模态框）+ 原生 JS Canvas 覆盖层

### 1.1 能力边界

| 边界 | 说明 |
|------|------|
| **不做** | 不管理模型文件本身，不移动/复制/删除磁盘文件 |
| **只做** | 索引文件路径 + 元数据，提供快捷选择入口 |
| **数据** | 自建 SQLite 数据库，独立于 ComfyUI 原生 `extra_model_paths.yaml` |

---

## 2. 系统架构

### 2.1 宏观组件

```
┌─────────────────────────────────────────────────────────────┐
│ ComfyUI 主进程 (main.py)                                    │
│  ├── execution.py (执行引擎)                                │
│  └── server.py (aiohttp Web Server)                        │
│       │                                                     │
│       ├── /api/*    → ComfyUI 原生 API                     │
│       ├── /api/hikaze/*  → Hikaze Model Manager 2 后端 API  │
│       └── /web/extensions/hikaze-models/  → SPA 前端       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 进程模型

Hikaze 后端运行在**独立 aiohttp 子应用**上，挂载到 ComfyUI 主服务器：

```
ComfyUI Main Server (aiohttp)
  └── Hikaze SubApp (aiohttp.Application)
       ├── router.py          → 12 个 API 路由
       ├── ServerInstance     → 单例，持有 DatabaseManager
       └── migration_handler  → HTTP 请求/响应转换
```

### 2.3 数据流

```
用户操作
  ├── Vue 管理界面 ──HTTP──▶ 后端 API ──SQL──▶ models.db
  ├── 节点覆盖层 ──ComfyUI Widget──▶ 节点执行
  └── Canvas 覆盖层 ──DOM 注入──▶ 节点执行
```

---

## 3. 目录结构

```
custom_nodes/Hikaze-Model-Manager-2/
├── __init__.py                    # 插件入口：注册节点、注入前端、启动 ServerInstance
├── pyproject.toml                 # 项目元数据（版本 0.0.1）
├── requirements.txt               # Python 依赖 (aiohttp, Pillow)
│
├── backend/                       # 后端
│   ├── database/
│   │   ├── db.py                  # DatabaseManager：双句柄 SQLite 管理
│   │   └── db_legacy.py           # 旧版 DB 只读句柄
│   ├── server/
│   │   ├── instance.py            # ServerInstance：aiohttp 子应用生命周期
│   │   ├── router.py              # 12 个 API 端点注册
│   │   └── migration_handler.py   # 迁移阶段 HTTP 处理器
│   ├── util/
│   │   ├── hasher.py              # SHA-256 文件哈希
│   │   ├── image_processor.py     # ImageProcessor：WebP 转换 + 多尺寸
│   │   ├── port_finder.py         # 动态端口分配
│   │   └── config.py              # system_types 定义（模型分类列表）
│   └── type/
│       └── dataclass_migrate.py   # 迁移相关的共享数据类型
│
├── web/                            # 前端（双前端架构）
│   ├── src/
│   │   ├── api/models.ts          # 前端 API 客户端（完整定义但部分未使用）
│   │   ├── stores/useModelStore.ts # 全局状态 Composable
│   │   ├── components/
│   │   │   ├── ModelLibrary.vue       # 模型列表（搜索+标签过滤）
│   │   │   ├── ModelDetails.vue       # 详情面板（元数据表单、图片画廊）
│   │   │   ├── PendingModelLibrary.vue# 待导入模型审核
│   │   │   ├── HikazeImageGallery.vue # 图片轮播/懒加载
│   │   │   ├── TagInput.vue           # 标签输入/管理
│   │   │   └── TabBar.vue             # 动态 Tab 导航
│   │   ├── overlays/
│   │   │   ├── lora-overlay/      # LoRA Power Loader 覆盖层（Vue）
│   │   │   └── checkpoint-overlay/ # Checkpoint 选择器覆盖层（Vue）
│   │   └── main.ts               # Vue 3 入口
│   └── dist/                      # Vite 构建产物
│
├── nodes/                          # ComfyUI 节点定义
│   ├── loaders/
│   │   └── hikaze_lora_power_loader.py  # HikazeLoraPowerLoader 节点
│   └── util/
│       └── lora_list_parser.py         # LoRA 列表 JSON 解析器（v1+v2）
│
├── injector/                       # ComfyUI 前端注入
│   ├── injection_manager.py        # InjectionManager：注册覆盖层/模态框
│   └── canvas_overlay.py           # Legacy Canvas HTML 覆盖层渲染
│
├── old_code/                       # 过时代码归档（建议后续清理）
├── tests/                          # 测试文件（覆盖率不足）
└── data/                           # 运行时数据（.gitignore 排除）
    ├── models.db                   # 主数据库
    └── legacy.db                   # 旧版数据库（只读引用）
```

---

## 4. 后端设计

### 4.1 ServerInstance — 单例服务器

**职责**：管理 aiohttp 子应用的生命周期，持有 `DatabaseManager` 单例。

```python
class ServerInstance:
    _instance = None       # 单例
    
    def __init__(self):
        self.app = web.Application()           # aiohttp 子应用
        self.db_manager = DatabaseManager()    # DB 管理器
        self.image_processor = ImageProcessor()# 图片处理器
        
    def setup_routes(self):
        # 注册所有 API 路由到 self.app.router
        
    async def start(self):
        # 1. 初始化 DatabaseManager（读写 DB + 只读 legacy）
        # 2. 查找可用端口
        # 3. 注册到 ComfyUI 主 app 作为子应用
```

### 4.2 DatabaseManager — 双句柄 SQLite 管理

**设计理念**：读写分离 + 安全迁移。

```
DatabaseManager
├── conn (读写)          → models.db        # 主数据库
└── legacy_conn (只读)   → legacy.db        # 旧版数据源
```

**核心方法签名**：

| 方法 | 说明 |
|------|------|
| `get_models_by_type(type)` | 按类型获取模型列表（排除 meta_json，减少传输量）|
| `get_model_by_sha256(sha256)` | 按 SHA256 获取完整详情（含 meta_json + tags + images）|
| `update_model(sha256, data)` | 更新元数据（filename, model_type, meta_json）|
| `get_tags()` | 获取所有标签，自动排除 NSFW |
| `add_tag(name)` | 添加新标签 |
| `add_model_tag(sha256, tag_id)` | 关联标签到模型 |
| `get_images(sha256, seq?)` | 获取模型图片（可选按序号筛选）|
| `get_image_count(sha256)` | 获取图片数量 |
| `delete_image(sha256, seq)` | 删除图片并重排后续序号 |
| `get_other_models()` | 获取未知类型的模型（审计发现：已实现但此前未文档化）|
| `get_pending_models()` | 获取待导入列表 |
| `get_pending_model_details(id)` | 获取单个待导入详情 |
| `promote_pending_models(ids, conflict_strategy)` | 批量导入（返回 207 Multi-Status）|
| `scan_to_pending()` | 扫描 ComfyUI 模型目录到 pending_import |

> **架构偏差（审计发现）**：`get_other_models()` 处理未知模型类型的逻辑已实现，但早期设计文档未记载。该方法在类型嗅探失败时作为兜底分类。

### 4.3 ImageProcessor — 图片处理管道

**处理规格**：

| 步骤 | 参数 | 说明 |
|------|------|------|
| 输入 | 原始图片文件 | PNG/JPEG/WebP 等 |
| 缩放 | 最大 2MP (1920×1080 级) | 保持宽高比 |
| 编码 | WebP, quality=85 | 固定质量 |
| 输出 | `data/images/{sha256}_{seq}_{quality}.webp` | 多质量版本 |

**精巧逻辑（审计发现）**：`delete_image_sequence()` 删除指定序号的图片后，自动将后续图片序号前移，保持序号连续性。此前未在设计文档中体现。

### 4.4 Hasher — SHA-256 文件哈希

- **生产模式**：读取文件分块计算 SHA-256
- **开发模式**：Mock Hasher 跳过计算（加速开发）
- 仅在导入阶段使用，不支持按需验证（审计发现：断点）

### 4.5 Model Type Sniffer — 模型类型嗅探

**位置**：`backend/util/model_type_sniffer.py`

**缓存机制**（审计发现：此前未文档化）：
- 使用 `types_cache.json` 缓存嗅探结果
- 减少重复文件扫描开销
- 缓存逻辑在代码中实现但早期设计文档未描述

---

## 5. 前端设计

### 5.1 双前端架构

| 前端 | 技术栈 | 用途 | 注入方式 |
|------|--------|------|----------|
| **管理界面** | Vue 3 + TypeScript + Vite | 模型库浏览、详情编辑、待导入审核、设置 | `InjectionManager` 注入全屏模态框 |
| **Canvas 覆盖层** | 原生 JS + HTML | Legacy Canvas 模式下的模型选择 | DOM 直接注入到 Canvas 容器 |

**设计决策**：
- Vue 3 选择 Composition API，状态管理使用 Composable（`useModelStore`），避免引入 Vuex/Pinia 依赖
- Canvas 覆盖层独立于 Vue，直接操作 DOM，在 Legacy 模式下生效

### 5.2 Vue 组件树

```
App.vue
└── GlobalModalWrapper        # Provide/Inject 全局模态框服务
    ├── TabBar                # 动态 Tab 导航（从 API 获取类型列表）
    ├── ModelLibrary          # 模型卡片网格
    │   ├── 搜索栏（文本 + 标签 AND 过滤）
    │   ├── 模型卡片
    │   │   ├── 封面图片（懒加载 + 轮播）
    │   │   └── 基本信息
    │   └── 刷新按钮
    ├── ModelDetails          # 详情面板（从 Library 点击触发）
    │   ├── TagInput          # 标签增删管理
    │   ├── HikazeImageGallery# 图片查看、上传、删除
    │   └── 元数据表单        # 高级编辑（触发 PATCH API）
    └── PendingModelLibrary   # 待导入审核列表
        ├── 导入按钮          # 调用 promotion API
        └── [扫描按钮 缺失]   # 设计预期存在但前端待实现
```

### 5.3 状态管理 — useModelStore

```typescript
// web/src/stores/useModelStore.ts

interface ModelStoreState {
  models: Model[]           // 当前 Tab 的模型列表
  selectedType: string      // 当前选中的模型类型 Tab
  selectedModel: Model | null  // 当前详情面板选中的模型
  tags: Tag[]               // 全局标签列表
  loading: boolean
  error: string | null
}

// Composable 导出响应式状态 + 操作方法
function useModelStore() {
  return {
    state: reactive<ModelStoreState>(),
    fetchModels(type: string),
    fetchModelDetail(sha256: string),
    updateModel(sha256: string, data: Partial<Model>),
    fetchTags(),
    addTag(name: string),
    // ...
  }
}
```

**设计特点**：
- 单例模式：通过模块级 `reactive()` 确保全局唯一状态
- 与 Provide/Inject 协同：Modal Service 也使用 Provide/Inject 实现跨组件通信

### 5.4 API 调用层

**文件**：`web/src/api/models.ts`

定义了完整的前端 API 方法集，但部分尚未在组件中使用（审计发现：接线缺口）：
- `fetchModels(type?)` ✅ 已连接
- `fetchModelDetail(sha256)` ✅ 已连接
- `updateModel(sha256, data)` ✅ 已连接
- `fetchTags()` ✅ 已连接
- `addTag(name)` ✅ 已连接
- `fetchImages(sha256)` ✅ 已连接
- `deleteImage(sha256, seq)` ❌ API 已定义但组件未使用
- `fetchImageCount(sha256)` ❌ API 已定义但组件未使用
- `scanModels()` ❌ API 已定义但前端无触发按钮

---

## 6. 节点注入与 ComfyUI 集成

### 6.1 HikazeLoraPowerLoader 节点

**文件**：`nodes/loaders/hikaze_lora_power_loader.py`

```python
class HikazeLoraPowerLoader:
    """
    增强版 LoRA 加载器，同时接受 JSON 格式的 LoRA 列表。
    
    INPUT_TYPES:
      required: { model: MODEL, clip: CLIP }
      optional: { lora_list: LORA_LIST }  # JSON 字符串

    RETURN_TYPES: (MODEL, CLIP)
    CATEGORY: "loaders"
    """
```

**LoRA 列表格式**（v1 和 v2 共存）：

| 版本 | 键名 | 特性 |
|------|------|------|
| v1 | `name`, `weight` | 单一权重，兼容旧版 |
| v2 | `name`, `weight_model`, `weight_clip` | 分离 model/clip 权重 |

> **架构偏差（审计发现）**：`HikazeLoraPowerLoader.execute()` 直接使用 `json.loads` 解析 `lora_list` 输入，**完全绕过** `lora_list_parser.py`。Parser 有严格的 Schema 校验和类型转换，但实际执行路径不使用它。这是后续重构的重点。

### 6.2 LoRA 列表解析器

**文件**：`nodes/util/lora_list_parser.py`

提供两种模式：
- **严格模式** (`strict=True`)：校验所有必需字段，缺失则报错
- **宽松模式** (`strict=False`)：兼容缺失字段，使用默认值

**当前问题**：Parser 定义了规范的解析逻辑但被绕过，实际成了死代码。

### 6.3 InjectionManager — 前端注入

通过 ComfyUI 的 `InjectionManager` API 实现三种注入模式：

| 注入类型 | 触发条件 | 渲染方式 |
|----------|----------|----------|
| 节点覆盖层 | Checkpoint/LoRA 节点被选中 | Vue 组件覆盖在节点上方 |
| 全局模态框 | 右键菜单 / 快捷键 | Provide/Inject 服务触发的全屏 Vue 模态框 |
| Canvas 覆盖层 | Legacy Canvas 模式 | 原生 HTML DOM 注入到 Canvas 容器内 |

### 6.4 Canvas 覆盖层实现细节

Canvas 覆盖层是 2026-04-03 添加的独立功能，在 Legacy Canvas 模式下直接注入 HTML 覆盖层：

- **定位计算**：监听 Canvas 变换事件，同步覆盖层位置和缩放
- **清理机制**：Canvas 刷新时自动清理和重建覆盖层
- **LoRA 选择器**：在覆盖层中嵌入简化的 LoRA 选择 UI
- **修复历史**（2026-04-04）：修复了定位/缩放精度问题和 LoRA 选择器布局错位

---

## 7. 数据库 Schema 设计

### 7.1 当前 Schema（最终态）

```sql
-- 模型主表：以 SHA-256 为唯一主键
CREATE TABLE models (
    sha256      TEXT PRIMARY KEY,
    filename    TEXT NOT NULL,          -- 原始文件名
    filepath    TEXT NOT NULL,          -- 相对于 ComfyUI 模型目录的路径
    model_type  TEXT NOT NULL,          -- checkpoint / lora / vae / controlnet / ...
    meta_json   TEXT DEFAULT '{}',      -- 自由格式 JSON：名称、描述、采样参数等
    created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 图片表：一个模型可有多张图片，按序号排序
CREATE TABLE images (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    sha256   TEXT REFERENCES models(sha256),
    seq      INTEGER NOT NULL,          -- 序号（删除后自动重排）
    quality  TEXT NOT NULL,             -- high / medium / low
    filepath TEXT NOT NULL,             -- 图片文件路径
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 标签表：扁平结构，全局共享
CREATE TABLE tags (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- 模型-标签多对多关联
CREATE TABLE model_tags (
    sha256 TEXT REFERENCES models(sha256),
    tag_id INTEGER REFERENCES tags(id),
    PRIMARY KEY (sha256, tag_id)
);

-- 待导入暂存表：扫描结果在此等待用户审核
CREATE TABLE pending_import (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    sha256      TEXT,                   -- 可为空（扫描时可能未计算哈希）
    filename    TEXT NOT NULL,
    filepath    TEXT NOT NULL,
    model_type  TEXT NOT NULL,
    meta_json   TEXT DEFAULT '{}',
    scanned_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 待导入模型标签关联（使用 tag_name 而非 tag_id）
CREATE TABLE pending_model_tags (
    pending_id INTEGER REFERENCES pending_import(id),
    tag_name   TEXT NOT NULL            -- 未入库的标签名
);

-- 键值对元数据表
CREATE TABLE db_meta (
    key   TEXT PRIMARY KEY,
    value TEXT
);
```

### 7.2 Schema 演进记录

| 阶段 | 关键变更 | 动机 |
|------|----------|------|
| **v3 初始** | `models` + `tags` + `model_tags` 三表 | 建立基础模型索引 |
| **添加暂存** | 新增 `pending_import` | 支持扫描→审核→导入工作流 |
| **Schema 重构** | `system_tags` → `system_types`；移除 `rating` | 概念对齐：类型分类 vs 标签 |
| **元数据表** | 新增 `db_meta` | 键值对存储迁移状态等运行时数据 |
| **图片支持** | 新增 `images` 表 + `seq` 字段 | 多质量图片 + 排序展示 |

---

## 8. 迁移系统设计

### 8.1 三阶段管道

```
Stage 1: Legacy Import (一次性)
  旧版 SQLite DB ──▶ 数据解析 ──▶ 新 DB + 图片复制
  
Stage 2: Model Scan (可重复)
  ComfyUI 模型目录 ──▶ 文件遍历 + SHA256 ──▶ pending_import 暂存
  
Stage 3: Promote (用户触发)
  pending_import ──▶ 审核 + 冲突策略 ──▶ models 正式库
```

### 8.2 MigrationService 核心流程

```python
class MigrationService:
    
    @staticmethod
    def run_legacy_migration(legacy_db_path, legacy_images_dir):
        """
        Stage 1: 旧版数据库 → 新版数据库
        1. 打开旧版 SQLite (只读)
        2. 遍历旧表行
        3. 解析 meta_json 中的图片路径引用
        4. 调用 ImageProcessor 复制/转换图片到新位置
        5. 清理 meta_json 中的图片路径（仅保留其他字段）
        6. 写入新 DB
        """
    
    @staticmethod
    def scan_models_to_pending():
        """
        Stage 2: 扫描 ComfyUI 模型目录
        1. 遍历所有模型类型子目录 (checkpoints, loras, vae, ...)
        2. 读取 system_types 配置获取类型列表
        3. 对每个文件计算 SHA-256
        4. 去重：SHA256 已存在则跳过
        5. 新模型加入 pending_import
        """
    
    @staticmethod
    def promote_pending_models(ids, conflict_strategy):
        """
        Stage 3: 批量导入
        1. 遍历 ID 列表
        2. 根据 conflict_strategy 处理冲突
        3. 返回 207 Multi-Status (每个 ID 独立结果)
        """
```

### 8.3 冲突处理策略

| 策略 | 行为 |
|------|------|
| `skip` | SHA256 重复则跳过（默认）|
| `replace` | 替换同名模型的所有数据 |
| `rename` | 修改文件名后导入 |
| `null` / `None` | 等同于 `skip` |

**当前实现**：冲突解决 UI 使用浏览器原生 `window.confirm()` 对话框，而非自绘 UI。Codex 审计确认此为**可接受的设计决策**。

### 8.4 已知断点（审计发现）

| 断点 | 说明 | 状态 |
|------|------|------|
| 弃用迁移逻辑 | `router.py` 中 `handle_import_a_model` 和 `_import_pending_model` 为旧迁移流残余 | 建议清理 |
| Scanner 占位符 | `backend/util/` 缺少 scanner 实现文件 | 后端已实现于 DB 层，文件分散 |
| SHA256 按需验证 | `hasher.py` 仅在导入阶段使用，不支持 UI 触发的独立验证 | 功能缺失 |

---

## 9. API 路由设计

### 9.1 完整路由表

```
基础路径：/api/（挂载到 ComfyUI 主服务器子路径）

GET    /api/models?type={type}          # 按类型获取模型列表（不含 meta_json）
GET    /api/models/{sha256}             # 按 SHA256 获取完整详情
PATCH  /api/models/{sha256}             # 更新模型元数据

GET    /api/models/sha256                # 获取模型 SHA256 
GET    /api/models/get_types             # 获取系统定义的所有模型类型

GET    /api/tags                        # 获取标签列表（自动排除 NSFW）
POST   /api/tags/add                    # 添加新标签

GET    /api/images/{sha256}?seq={n}     # 获取模型图片（按序号）
GET    /api/images/get_img_num          # 获取指定模型的图片总数
DELETE /api/images/delete               # 删除图片（自动重排序号）

GET    /api/scan                        # 扫描模型目录 → pending_import

POST   /api/migration/migrate_legacy_db  # Stage 1：旧版数据库迁移
GET    /api/migration/pending_models     # 待导入模型列表
GET    /api/migration/pending_model?id=  # 单个待导入详情
POST   /api/migration/import_models      # 批量导入（207 Multi-Status）
```

### 9.2 关键 API 设计细节

**GET /api/models（列表）**：
- 排除 `meta_json` 以减少传输量
- 返回 `tags`（标签名数组）和 `image_count`（聚合统计）
- 支持 `?type=` 过滤

**PATCH /api/models/{sha256}**：
- 可更新 `filename`、`model_type`、`meta_json` 中任意字段
- 自动更新 `updated_at` 时间戳

**DELETE /api/images/delete**：
- 请求体：`{"sha256": "...", "seq": 2}`
- 后端自动重排剩余图片的 `seq` 序号

**POST /api/migration/import_models**：
- 请求体：`{"id": [1,2,3], "conflict_strategy": "skip"}`
- 响应：207 Multi-Status，逐 ID 返回结果

### 9.3 API 与前端接线缺口（审计发现）

| API 端点 | 后端 | 前端调用 |
|----------|------|----------|
| `GET /api/scan` | ✅ | ❌ 前端无扫描触发按钮 |
| `DELETE /api/images/delete` | ✅ | ⚠️ API 客户端已定义，组件未调用 |
| `GET /api/images/get_img_num` | ✅ | ⚠️ API 客户端已定义，组件未调用 |

---

## 10. 关键设计模式与技术决策

### 10.1 架构模式

| 模式 | 位置 | 理由 |
|------|------|------|
| **Singleton** | `ServerInstance`、`DatabaseManager` | 全局唯一数据源，避免连接泄露 |
| **Service Layer** | `MigrationService` | 业务逻辑独立于 HTTP 层，可独立测试 |
| **Handler Wrapper** | `migration_handler.py` | HTTP 请求/响应格式转换 |
| **Composable** | `useModelStore` | Vue 3 原生状态管理，零额外依赖 |
| **Provide/Inject** | 全局 Modal Service | 跨组件通信，避免 prop drilling |
| **Strategy** | 迁移冲突处理 | skip / replace / rename 策略可扩展 |
| **Pipeline** | 三阶段迁移 | 关注点分离：导入 → 扫描 → 审核 |

### 10.2 技术选型

| 决策项 | 选型 | 理由 |
|--------|------|------|
| HTTP 框架 | aiohttp | 与 ComfyUI 同栈，轻量异步 |
| 数据库 | SQLite | 零配置，文件级管理，生态一致 |
| DB 架构 | 读写主库 + 只读旧库 | 安全迁移，不修改旧数据 |
| 前端框架 | Vue 3 + Composition API | 渐进式，类型安全，Tree Shaking |
| 构建工具 | Vite | 快速 HMR，ES 模块原生支持 |
| 图片格式 | WebP (85% quality) | 高压缩比，浏览器广泛支持 |
| 模型标识 | SHA-256 | 唯一性保证，防重复导入 |
| 端口 | 动态分配 | 多实例不冲突 |

---

## 11. 设计审计与架构偏差

项目在开发过程中进行了两次正式审计，发现若干设计偏差。以下整合审计结论。

### 11.1 设计缺失项（预期功能未实现）

| 功能 | 设计预期 | 实际状态 | 影响 |
|------|----------|----------|------|
| **自动模型扫描 UI** | `PendingModelLibrary.vue` 应有"扫描"按钮 | 后端 `GET /api/scan` 已实现，前端无触发按钮 | 用户需手动操作，工作流不完整 |
| **动态模型类型选择器** | `ModelDetails.vue` 从 `GET /api/models/get_types` 动态获取类型 | 当前使用硬编码 `<select>` | 新类型需改代码 |
| **Calculate Hash 按钮** | 详情页"⚡"按钮触发按需 SHA256 验证 | 按钮仅触发 `alert()`，无后端实现 | 功能缺失 |
| **冲突解决 UI** | 导入时提供自绘的策略选择界面 | 使用浏览器原生 `window.confirm()` | 已确认可接受 |

### 11.2 未文档化功能（审计补充）

| 功能 | 位置 | 说明 |
|------|------|------|
| **Other Models 逻辑** | `DatabaseManager.get_other_models()` | 处理未知类型模型的兜底分类 |
| **图片删除序号重排** | `ImageProcessor.delete_image_sequence()` | 删除后自动前移后续图片序号 |
| **类型嗅探缓存** | `model_type_sniffer.py` → `types_cache.json` | JSON 文件缓存嗅探结果 |

### 11.3 架构偏差

| 偏差 | 描述 | 严重度 |
|------|------|--------|
| **LoRA Parser 被绕过** | `lora_list_parser.py` 有严格 Schema 校验，但 `HikazeLoraPowerLoader.execute()` 直接用 `json.loads` | 中 |
| **payload widget 可见** | `hikaze_payload` widget 应为隐藏，当前对节点面板可见（调试用途） | 低 |
| **图片列表返回格式** | `ImageProcessor.get_image_list` 返回基础名称，由路由层转换 URL，设计文档未记录此转换 | 低 |
| **迁移逻辑残留** | `router.py` 中旧版单条导入逻辑未清理 | 低 |

### 11.4 审计建议

1. **重构 LoRA Parser**：统一解析入口到 `lora_list_parser.py`
2. **连接动态类型**：`ModelDetails.vue` 从 API 获取类型列表
3. **实现 Scanner UI**：`PendingModelLibrary.vue` 添加扫描按钮
4. **清理 Router**：移除弃用的迁移处理器
5. **隐藏 Payload Widget**：设置 `socketless=True`

---

## 12. 代码规范

### 12.1 Python（Google Style Guide 衍生）

| 规则 | 要求 |
|------|------|
| Linting | `pylint` 检查代码质量 |
| Imports | `import module` 导入模块；子模块用 `from x import y` |
| Exceptions | 使用内置异常类；**禁止裸 `except:`**（2026-04-24 已部分修复） |
| 全局状态 | 避免可变全局；常量用 `ALL_CAPS` |
| 默认参数 | 禁止可变对象（`[]`、`{}`）作为默认值 |
| 类型注解 | 公共 API 必须标注 |
| 行长度 | 最大 80 字符 |
| 缩进 | 4 空格，禁止 tab |
| 文档字符串 | `"""三重双引号"""`，含 `Args:` / `Returns:` / `Raises:` |
| 命名 | `snake_case`（函数/变量）、`PascalCase`（类）、`ALL_CAPS`（常量） |
| Main | 所有可执行文件需 `main()` + `if __name__ == '__main__':` |

### 12.2 TypeScript / Vue 3

| 规则 | 要求 |
|------|------|
| 类型系统 | TypeScript Strict 模式 |
| 类型检查 | `vue-tsc` 静态类型检查 |
| 构建验证 | 强制 `npm run build` 零错误通过 |
| 组件风格 | Composition API (`<script setup>`) |
| 状态管理 | Composable（`useXxx`），不引入 Vuex / Pinia |

### 12.3 提交规范（Conventional Commits）

```
<type>(<scope>): <description>

type: feat | fix | docs | style | refactor | chore
scope: api | backend | frontend | ui | db | migration
```

---

## 13. 功能状态与改进路线

### 13.1 已实现功能

| 功能 | 后端 | 前端 | 备注 |
|------|------|------|------|
| 模型库浏览 + 搜索过滤 | ✅ | ✅ | AND 逻辑三态标签过滤 |
| 模型详情面板 | ✅ | ✅ | 元数据表单 + 图片管理 |
| 节点内模型选择器 | — | ✅ | Checkpoint + LoRA 覆盖层 |
| 待导入模型审核 | ✅ | ✅ | 暂存区 + 批量导入 |
| 旧版数据库迁移 | ✅ | ✅ | 三阶段管道 |
| NSFW 安全过滤 | ✅ | ✅ | 标签查询自动排除 |
| Vue 覆盖层 | — | ✅ | LoRA Power Loader UI |
| Canvas HTML 覆盖层 | — | ✅ | Legacy Canvas 模式 |
| 全局全屏模态框 | — | ✅ | Provide/Inject 服务 |
| 图片懒加载 + 轮播 | ✅ | ✅ | IntersectionObserver |
| 持久会话缓存 | ✅ | ✅ | 状态保持 |

### 13.2 已知问题

| 问题 | 位置 | 严重度 | 状态 |
|------|------|--------|------|
| 版本号过旧 | `pyproject.toml` | 低 | `0.0.1`，未随功能更新 |
| 过时代码 | `old_code/` | 低 | 建议清理 |
| 裸 except | 多处 | 中 | 2026-04-24 已部分修复 |
| 测试覆盖不足 | `tests/` | 中 | 测试框架已配但用例少 |
| 构建产物混入源码 | `web/*/dist/` | 低 | 应 `.gitignore` |
| LoRA Parser 被绕过 | `nodes/loaders/` | 中 | 重构待办 |
| 动态类型硬编码 | `ModelDetails.vue` | 中 | 重构待办 |
| 扫描按钮缺失 | `PendingModelLibrary.vue` | 低 | 前端待实现 |

### 13.3 未来规划

| 功能 | 状态 | 备注 |
|------|------|------|
| 模型自动发现 Scanner | 后端就绪，前端待接线 | `GET /api/scan` 已有 |
| 扫描按钮 UI | 待实现 | `PendingModelLibrary.vue` 工具栏 |
| 冲突解决自绘 UI | 浏览器对话框已可用 | 可后续升级 |
| i18n 多语言 | 未实现 | en-US + zh-CN 计划 |
| ComfyUI Settings 集成 | 未实现 | 语言切换入口 |

---

## 附录

### A. 文件统计

| 类别 | 数量 |
|------|------|
| Python 源文件 | ~40 |
| TypeScript / Vue 源文件 | ~30 |
| API 端点 | 12 |
| 数据库表 | 6 |
| 已合并 PR | 16 |

### B. 关键文件索引

| 文件 | 章节参考 |
|------|----------|
| `backend/database/db.py` | §4.2 DatabaseManager |
| `backend/server/instance.py` | §4.1 ServerInstance |
| `backend/server/router.py` | §9 API 路由 |
| `backend/server/migration_handler.py` | §8 迁移系统 |
| `backend/util/image_processor.py` | §4.3 ImageProcessor |
| `backend/util/hasher.py` | §4.4 Hasher |
| `nodes/loaders/hikaze_lora_power_loader.py` | §6.1 LoRA 节点 |
| `nodes/util/lora_list_parser.py` | §6.2 LoRA 解析器 |
| `injector/injection_manager.py` | §6.3 前端注入 |
| `injector/canvas_overlay.py` | §6.4 Canvas 覆盖层 |
| `web/src/stores/useModelStore.ts` | §5.3 状态管理 |
| `web/src/components/ModelLibrary.vue` | §5.2 组件树 |
| `web/src/components/ModelDetails.vue` | §5.2 组件树 |
| `web/src/api/models.ts` | §5.4 API 调用层 |

---

> **文档说明**：本设计规范书基于对源码的完整分析及两次正式审计（2025-12-30 代码库审计 + 2026-01-28 Codex 迁移审计）整合而成。所有设计描述均从代码实现逆向提取，不依赖已有分析报告。设计偏差和未文档化功能已内联标注于相关章节，以便 AI Vibe Coding 场景下快速理解全貌。