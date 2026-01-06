# Job: fullscreen-floating-toolbar

## Phase 1: 需求与交互确认
- [x] 任务: 明确全屏模态触发入口与展示条件
  - [x] 条目: 仅在从节点打开管理器时展示标题栏全屏按钮
  - [x] 条目: 独立页面默认全屏呈现，不提供全屏/恢复按钮
  - [x] 条目: 从节点打开切换到全屏后标题栏仍保留
  - [x] 条目: 全屏/窗口切换按钮图标为 U+1F5D7
- [x] 任务: 定义悬浮工具栏的行为与边界
  - [x] 条目: 悬浮工具栏仅独立全屏可见，从节点全屏不显示
  - [x] 条目: 默认位置中下方，可拖动并在会话内记忆
  - [x] 条目: 暗色半透明背景 + 阴影
- [x] 任务: 定义悬浮工具栏与当前 tab 的数据接口
  - [x] 条目: 工具栏可获取当前激活 tab（供未来按钮使用）
- [x] 用户手动验证

## Phase 2: 结构与技术方案
- [x] 任务: 梳理涉及组件与状态
  - [x] 条目: custom_node_frontend 的 HikazeManagerModal 使用 modalState 与 HikazeManagerLayout（embedded=true, initialTab）
  - [x] 条目: model_manager_frontend 的 App.vue 通过 URL 参数决定 embedded 并持有选中模型
  - [x] 条目: HikazeManagerLayout 内部维护 activeTab，仅透出给 library slot
- [x] 任务: 设计状态流与组件边界
  - [x] 条目: embedded 全屏切换由 HikazeManagerModal 本地状态控制，标题栏按钮触发
  - [x] 条目: standalone 悬浮工具栏位于 model_manager_frontend 层，基于 activeTab
  - [x] 条目: HikazeManagerLayout 增加 toolbar slot 以提供 activeTab
- [x] 任务: 拖拽实现方案
  - [x] 条目: pointer/mouse events 绑定工具栏，记录拖拽起点与偏移
  - [x] 条目: 位置在 viewport 内 clamp，拖拽结束写入会话内缓存
- [x] 用户手动验证

## Phase 3: 实施计划
- [x] 任务: 变更清单与文件范围
  - [x] 条目: 新增 `web/model_manager_frontend/src/components/FloatingToolbar.vue`（独立全屏悬浮工具栏）
  - [x] 条目: 修改 `web/model_manager_frontend/src/components/HikazeManagerLayout.vue`，新增 `toolbar` slot 并透出 activeTab
  - [x] 条目: 修改 `web/model_manager_frontend/src/App.vue`，仅在 standalone 模式渲染 FloatingToolbar
  - [x] 条目: 修改 `web/custom_node_frontend/src/components/HikazeManagerModal.vue`，标题栏新增全屏按钮并支持全屏样式
  - [x] 条目: 样式调整集中在对应组件内，不新增全局样式文件
  - [x] 条目: 现有类型无需扩展，FloatingToolbar 仅新增 activeTab prop
- [x] 任务: 交互/视觉细节计划
  - [x] 条目: FloatingToolbar 固定定位，默认中下方；拖拽时 `cursor: grabbing`
  - [x] 条目: 视觉为深色半透明背景（rgba）+ 阴影 + 边框，圆角风格与现有 UI 对齐
  - [x] 条目: 嵌入式 modal 标题栏右侧新增 U+1F5D7 按钮，切换全屏/窗口；全屏状态下保持标题栏
  - [x] 条目: 悬浮工具栏在 embedded 模式始终不渲染
  - [x] 条目: activeTab 传入工具栏，并写入 data 属性便于调试（不展示文字）
- [x] 任务: 手动验证步骤草案
  - [x] 条目: 从节点打开管理器，确认标题栏出现 U+1F5D7，点击后切换全屏且标题栏保留，悬浮工具栏不出现
  - [x] 条目: 再次点击 U+1F5D7 恢复窗口尺寸
  - [x] 条目: 独立页面打开管理器，确认悬浮工具栏默认中下方并可拖动，拖动位置在会话内保持
  - [x] 条目: 切换 tab，确认工具栏 data 属性随 activeTab 变化
- [x] 用户手动验证

## Phase 4: 实施与记录
- [x] 任务: 新增悬浮工具栏组件并接入拖拽
  - [x] 文件: `web/model_manager_frontend/src/components/FloatingToolbar.vue` - 新增独立全屏悬浮工具栏组件，支持拖拽与会话内位置记忆
- [x] 任务: 全屏/窗口模态切换逻辑（标题栏按钮，嵌入式全屏保留标题栏）
  - [x] 文件: `web/custom_node_frontend/src/components/HikazeManagerModal.vue` - 标题栏新增 U+1F5D7 按钮，嵌入式全屏切换保持标题栏
- [x] 任务: 将 active tab 传递给工具栏
  - [x] 文件: `web/model_manager_frontend/src/components/HikazeManagerLayout.vue` - 新增 toolbar slot 并向 slot 提供 activeTab
  - [x] 文件: `web/model_manager_frontend/src/App.vue` - standalone 模式渲染 FloatingToolbar 并传入 activeTab
- [x] 任务: 样式调整与层级修复
  - [x] 文件: `web/model_manager_frontend/src/components/FloatingToolbar.vue` - 半透明暗色背景、阴影、圆角、拖拽 cursor 与层级
  - [x] 文件: `web/custom_node_frontend/src/components/HikazeManagerModal.vue` - 全屏状态样式与按钮对齐
- [x] 任务: 前端构建验证
  - [x] 条目: `web/model_manager_frontend` 执行 `npm run build`
  - [x] 条目: `web/custom_node_frontend` 执行 `npm run build`
- [x] 用户手动验证
