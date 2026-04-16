# 参数配置与通知公告

系统参数配置和通知公告管理模块，用于存储应用设置和向用户发布消息。

## 系统配置

### 功能特性

- 键值对配置存储在数据库中
- 支持分页和搜索的增删改查操作
- 配置可缓存到 Redis 以实现快速访问
- 用于运行时可调整的应用设置

### 数据模型 — SysConfig（`sys_config`）

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| configId | Long | 主键 |
| configName | String | 显示名称 |
| configKey | String | 唯一配置键 |
| configValue | String | 配置值 |
| configType | Integer | 内置或自定义 |
| remark | String | 备注 |
| createTime | DateTime | 创建时间 |
| updateTime | DateTime | 最后更新时间 |

### API 接口

| 方法 | 接口路径 | 描述 |
|--------|----------|-------------|
| POST | `/admin-api/config` | 查询配置列表（分页） |
| POST | `/admin-api/config/create` | 创建配置项 |
| PUT | `/admin-api/config/update` | 更新配置项 |
| POST | `/admin-api/config/delete` | 删除配置项 |

### 使用示例

存储全局设置，例如默认分页大小：

| 配置键 | 配置值 | 描述 |
|-----------|-------------|-------------|
| `sys.default.pageSize` | `20` | 默认分页大小 |
| `sys.account.registerEnabled` | `false` | 是否允许自助注册 |
| `sys.captcha.type` | `math` | 验证码类型 |

### 服务层

`SysConfigService` 提供：
- `findByConfigKey(String key)` — 根据键查找配置值
- 通过 Spring Data JPA `SysConfigRepository` 实现标准增删改查

## 通知公告管理

### 功能特性

- 创建和管理系统通知/公告
- 支持不同的通知类型（通知、公告）
- 状态管理（草稿、已发布）
- 支持分页和搜索的列表

### 数据模型 — SysNotice（`sys_notice`）

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| noticeId | Long | 主键 |
| noticeTitle | String | 通知标题 |
| noticeType | Integer | 类型（1：通知，2：公告） |
| noticeContent | String | 内容（支持富文本） |
| status | Integer | 状态（0：草稿，1：已发布） |
| createBy | String | 创建者 |
| remark | String | 备注 |
| createTime | DateTime | 创建时间 |
| updateTime | DateTime | 最后更新时间 |

### API 接口

| 方法 | 接口路径 | 描述 |
|--------|----------|-------------|
| POST | `/admin-api/notice` | 查询通知列表（分页） |
| POST | `/admin-api/notice/create` | 创建通知 |
| PUT | `/admin-api/notice/update` | 更新通知 |
| POST | `/admin-api/notice/delete` | 删除通知 |

### 通知类型

| 类型 | 值 | 描述 |
|------|-------|-------------|
| 通知 | 1 | 内部团队通知 |
| 公告 | 2 | 系统级公告 |

## 相关页面

- [用户管理](./user-management.md) — 管理配置的系统用户
- [角色与权限](./role-permission.md) — 配置操作的权限控制
