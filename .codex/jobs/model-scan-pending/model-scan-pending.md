# Job: model-scan-pending

## Phase 1: 现状梳理与需求确认
- [x] Task: 确认扫描入口与触发条件
  - [x] Branch: `GET /api/scan` 触发扫描
  - [x] Branch: 类型缓存缺失时返回明确错误
  - 证据: `custom_nodes/Hikaze-Model-Manager-2/backend/server/router.py` 尚未注册 `/api/scan`，需新增。
  - 证据: `custom_nodes/Hikaze-Model-Manager-2/backend/util/model_type_sniffer.py` 缓存缺失时返回空的 ModelTypeIndex（类型与路径为空）。
- [x] Task: 现有类型映射与目录来源确认
  - [x] Branch: 确认模型类型映射的初始化位置与缓存策略
  - [x] Branch: 记录模型目录来源与绝对路径规范
  - 证据: `custom_nodes/Hikaze-Model-Manager-2/backend/util/model_type_sniffer.py` 在模块加载时构建 `_INSTANCE`，优先读取 `folder_paths.folder_names_and_paths`，并写入 `data/types_cache.json`。
  - 证据: `custom_nodes/Hikaze-Model-Manager-2/backend/util/config.py` 定义 `DATA_DIR` 为 `<root>/data`，缓存文件路径来自 `model_type_sniffer._cache_path()`。
- [x] Task: 数据库与 pending_import 结构确认
  - [x] Branch: 现有 models 表路径格式与唯一性约束
  - [x] Branch: pending_import 最小写入字段清单
  - 证据: `custom_nodes/Hikaze-Model-Manager-2/backend/util/consts.py` 定义 `models.path`（索引 `idx_models_path`）与 `pending_import.path`（`UNIQUE NOT NULL`）。
  - 证据: `custom_nodes/Hikaze-Model-Manager-2/backend/database/db.py` 的 `add_pending_import` 将 `PendingModelRecord` 序列化并写入 `pending_import`，仅 `path` 为必填字段，其余字段可空。
- [x] Task: 定义 `/api/scan` 返回结构与错误码
  - 约定: `GET /api/scan` 成功返回 `{ "status": "success", "scanned": number, "added": number, "pending_ids": number[], "skipped": number }`。
  - 约定: 当模型类型缓存为空（未生成 types_cache.json 且无法读取 ComfyUI 类型）时返回 `503` 与 `{ "error": "Model type cache is empty; start ComfyUI once to initialize types cache." }`。
  - 约定: 其他异常返回 `500` 与 `{ "error": "<message>" }`。
- [x] Quality Gates
  - [x] Build passes (if applicable) - N/A (analysis phase)
  - [x] Evidence recorded (file refs / command output)
  - [x] Docs updated (if needed) - N/A (analysis phase)
- [x] User manual verification

## Phase 2: 方案设计与实施计划
- [x] Task: 设计扫描与对比流程
  - [x] Branch: 遍历模型目录并收集绝对路径
  - [x] Branch: 与 DB models 路径集合做差集
  - [x] Branch: 对新增模型创建 pending_import 记录
  - 设计: 使用 `get_model_type_index().model_paths_by_type` 作为扫描目录（仅 `model_types`）。
  - 设计: 若 `model_paths_by_type` 为空则返回 `503`（同 Phase1 约定）。
  - 设计: 目录遍历 `os.walk`，路径采用 `os.path.abspath` + `os.path.normpath`；Windows 额外 `normcase`。
  - 设计: 文件过滤优先使用 `folder_paths.folder_names_and_paths[type][1]`，不可用时退回 `folder_paths.supported_pt_extensions`。
  - 设计: 扩展名比对统一小写，允许 `.ckpt/.safetensors/.pt` 等；若扩展列表为空/不可用则仅跳过目录项与非文件项（不做扩展过滤）。
  - 设计: 当扩展列表包含无前缀的扩展名时，补齐 `.` 后再比对；不支持通配符则直接按后缀匹配。
  - 设计: 预加载 `models.path` 与 `pending_import.path` 到 set，归一化后做差集。
  - 设计: 新增记录使用 `PendingModelRecord`（id=0, sha256=""，meta_json 空 images/prompts），name=basename，type=model_type，size_bytes/created_at 取文件 stat。
  - 设计: 返回 `scanned/added/skipped/pending_ids`；`pending_ids` 由插入结果收集（需要获取 lastrowid）。
  - 设计: 新增 pending 记录不指定 id，依赖 SQLite 自增并读取 lastrowid。
- [x] Task: 设计后端模块与职责划分
  - [x] Branch: 扫描逻辑放入独立 service
  - [x] Branch: handler 负责参数校验与返回结构
  - 设计: 复用 `backend/database/migration/service.py` 增加 `scan_models_to_pending`。
  - 设计: handler 放在 `backend/server/migration_handler.py` 新增 `handle_scan_models`，并用 executor 执行扫描。
- [x] Task: 确认 API 合同更新位置与内容
  - 计划: `custom_nodes/Hikaze-Model-Manager-2/.codex/guidelines/api-contracts.md` 新增 `GET /api/scan`。
  - 计划: `custom_nodes/Hikaze-Model-Manager-2/backend/server/router.py` 注册路由并注明 handler 文件。
- [x] Quality Gates
  - [x] Build passes (if applicable) - N/A (design phase)
  - [x] Evidence recorded (file refs / command output)
  - [x] Docs updated (if needed) - N/A (design phase)
- [x] User manual verification

## Phase 3: 实现与验证
- [x] Task: 实现扫描 service 与路径归一化
- [x] Task: 实现 `/api/scan` handler 与 router 注册
- [x] Task: 更新 API 合同文档（如有变更）
- [x] Quality Gates
  - [x] Build passes (if applicable) - N/A (backend-only change)
  - [x] Evidence recorded (file refs / command output)
  - [x] Docs updated (if needed)
- [ ] User manual verification
