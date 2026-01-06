# Hikaze Model Manager 2 - 开发设计说明

本文件记录当前的设计细节，用于实现和维护对齐，内容以功能与交互为核心。

## 1. 设计理念
- 统一管理界面：模型浏览、筛选、编辑集中在管理器中完成。
- 无侵入集成：不修改 ComfyUI 核心，通过自定义节点与前端扩展实现。
- 数据可靠性：以 SHA256 作为主标识，避免路径变更造成失联。
- 安全优先：默认过滤敏感内容，降低误触风险。
- 体验一致：保持暗色调与三栏结构，卡片与列表统一视觉语言。

## 2. 系统结构
- 后端
  - nodes/：自定义节点，如 HikazeCheckpointLoader 与 HikazeLoraPowerLoader。
  - backend/server/：独立管理器 API、图片与迁移相关逻辑。
  - shared/types/：统一数据结构与约束（ModelRecord、PendingModelRecord、LoRAListDocument）。
- 前端
  - web/model_manager_frontend/：独立管理器界面（全屏）。
  - web/custom_node_frontend/：节点内嵌界面与模态。
  - web/shared/：共享类型与适配器，确保前后端一致。

## 3. 关键交互设计
- 管理器入口
  - 从节点进入时，按 initialTab 进入特定模型类型并隐藏顶栏 tabs。
  - 独立页面默认全屏显示。
- 模型浏览
  - 左侧模型库支持搜索、标签过滤、卡片或列表视图。
  - 右侧详情面板展示完整信息并支持编辑。
- LoRA 选择模式
  - 顶部 SelectedLoraBar 单行六列卡片，超出数量横向滚动。
  - 卡片点击仅切换右侧详情；复选框负责选中或取消。
  - 已选项从下方库中排除，确认时合并为 LoRAListDocument 并保留原强度。
- 模态与工具栏
  - 节点内模态可切换全屏，但保留标题栏。
  - 浮动工具栏仅在独立页面显示，并在会话内记忆位置。

## 4. 数据与缓存
- ModelSimpleRecord 用于列表渲染；ModelRecord 用于详情展示与编辑。
- 缓存按类型分组，支持刷新和详情缓存更新。
- 图片通过顺序 WebP 资源加载，SelectedLoraBar 使用固定单图预览。
- LoRA payload 版本默认 2，字段保持稳定。

## 5. 节点与持久化
- 前端改动必须写回 hikaze_payload 或其他 schema 输入，保证工作流可保存。
- LoRA Power Loader 支持绝对路径与相对路径解析，跨盘绝对路径直接使用本地路径。

## 6. 构建约束
- custom_node_frontend 输出单一 JS 文件，避免 ComfyUI 自动导入多 chunk。
- 共享类型通过 web/shared 与别名引用保持一致性。
