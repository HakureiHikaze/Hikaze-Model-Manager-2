# Comprehensive Discrepancy Report - 2025-12-30

## Executive Summary
This report summarizes the findings of a deep-dive audit of the Hikaze-Model-Manager-2 project. While the core architecture (SHA256 identity, Node-Server decoupling) is solid, significant gaps exist between the implementation and the design documentation, particularly in the frontend UI and certain backend utility integrations. Several "headless" artifacts from previous interrupted sessions have been identified as high-priority "Development Junction Points".

---

## 1. Missing Features (Design > Code)
- **Automatic Model Scanning:** `POST /api/models/scan` and its corresponding utility `backend/util/scanner.py` are missing. Users cannot currently sync the database with new files in ComfyUI directories.
- 模型扫描功能按计划将会在前端模型库界面、模型明细界面功能和pending_models第二阶段导入功能完成后实施开发
- **Dynamic Model Types in UI:** `ModelDetails.vue` uses a hardcoded `<select>` for model types instead of fetching them via `GET /api/models/get_types`.
- 此处模型明细界面的选择类型下拉框是与设计冲突的，删除之。并且按meta_json格式设计模型明细中除去数据库记录外的meta表单。旧数据库extra_json_example.json和新数据库meta_json_example.json已经在根目录下给出，键名中的"?"表示可为空
- **Calculate Hash Action:** The "⚡" (Calculate Hash) button in `ModelDetails.vue` only triggers an alert; no backend implementation or frontend wiring exists for this feature.
- 对主表中的模型，进行sha256计算是与设计完全相反的行为，sha256被设计用于主表主键，为首要记录，只需要在表单中只读显示。sha256必须只能用于pending_model的第二阶段导入，将会在前端模型库界面、模型明细界面功能完成后实施开发。
- **Conflict Resolution UI:** While the backend `import_models` supports conflict strategies (override/merge/delete), the frontend "Pending Import" UI is not yet implemented or wired to these strategies.
- pending_model的第二阶段导入功能尚在计划中，将会在前端模型库界面、模型明细界面功能完成后实施开发。

## 2. Undocumented Features (Code > Design)
- **Other Models Logic:** `DatabaseManager.get_other_models` handles models with unknown types. This is implemented in code but not explicitly detailed in `_codex/backend_apis.md`.
- **Image Deletion Shifting:** `ImageProcessor.delete_image_sequence` implements logic to shift subsequent images down when one is deleted. This sophisticated logic is not mentioned in the design docs.
- **Sniffer Cache:** `model_type_sniffer.py` implements a JSON caching mechanism (`types_cache.json`) for model types, which is undocumented.
- 上述三项均添加到对应的设计中

## 3. Deviations (Logic/Structure Mismatch)
- **LoRA List Schema Mismatch:** `lora_list_parser.py` enforces a strict schema (`LoRAList`, `MStrength`, `toggleOn`), whereas `HikazeLoraPowerLoader.execute` and `loraListExample.json` use more flexible/different keys (`LoRAs`, `strength_model`, `enabled`).
- 全部统一为web/custom_mode_frontend/src/injection/types.ts中LoRAEntry和LoRAListDocument的字段名，丢弃所有其他不符合该字段名的键名
- **Parser Bypass:** `HikazeLoraPowerLoader` bypasses the dedicated `lora_list_parser.py` entirely, using inline `json.loads` and manual dictionary access.
- 节点具体行为将在前端模型库界面、模型明细界面、pending_models第二阶段导入功能、模型扫描功能等开发完成后计划实施，因此该项留作开发计划
- **Node Widget Visibility:** `hikaze_payload` is intended to be a hidden/internal widget but is currently visible on the node for debugging purposes.
- hikaze_payload在节点页面表现为input控件，内部存储结构化文本，在前端由NodeFrame上的控件控制内容。流程图运行时该控件内的内容将会被comfyui送到后端，交由我们的回调处理逻辑处理。hikaze_payload可以理解为是用来绕过comfyui节点控件行为的数据协议，并且其前端样式不易被修改，保留现状即可。如果本段理念与设计有出入，将设计对齐到我所述的理念
- **Image List Return Type:** The design suggests `get_sample_imgs` should return URLs, but `ImageProcessor.get_image_list` returns base names (hash_seq), requiring the router to transform them.
- `get_sample_imgs`是弃用的api，但当前仍在使用。所有使用sha256请求主表中模型的示例图片的逻辑，均由以下二阶段逻辑完成：`GET /api/images/get_img_num?{sha256}`取得该模型的示例图片数，`GET /api/images/{hash}.webp?quality=high|medium|low&seq=N`取得hashed模型指定seq和质量的图片，交由前端呈现

## 4. Development Junction Points (Headless Artifacts)
- **Deprecated Migration Logic:** `handle_import_a_model` and `_import_pending_model` in `router.py` are remnants of an older migration flow. They should be unified or removed in favor of `handle_import_models`.
- 只保留最新的
- **Scanner Placeholder:** The `backend/util/` directory lacks the scanner logic required for the "Auto-Discovery" feature.
- 模型扫描功能见前述说明
- **Frontend/Backend Wiring Gap:** Core API methods in `web/src/api/models.ts` are defined but not utilized by components (e.g., `deleteImage`, `fetchImageCount` inside details).
- deleteImage应当在模型明细中预览图片的浮动按钮中呈现了，检查之；fetchImageCount的作用在第三部分关于图片请求行为中已经解释
- **Incomplete SHA256 Verification:** The `hasher.py` exists but is only used during import, not for the "on-demand" verification requested in the UI.
- 未来将会在模型导入时引用本模块

---

## Actionable Recommendations
1. **Refactor LoRA Parser:** Update `lora_list_parser.py` to be the single source of truth for LoRA JSON parsing, supporting the flexible keys used by the frontend.
   - 见上述关于loraList的表述
2. **Wire Dynamic Types:** Update `ModelDetails.vue` to fetch types from `GET /api/models/get_types`.
   - 见上述关于模型明细表单的表述
3. **Implement Scanner:** Prioritize the creation of `backend/util/scanner.py` to enable model auto-discovery.
   - 见上述关于扫描功能计划的表述
4. **Cleanup Router:** Remove deprecated migration handlers and consolidate logic into the batch `import_models` flow.
   - 见上述关于旧import models接口的表述
5. **Hide Payload Widget:** Set `socketless=True` and ensure the frontend overlay correctly manages the widget visibility.
   - 见上述关于payloadwidget的表述，维持原状
