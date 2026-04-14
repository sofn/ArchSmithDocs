# Config & Notice

System configuration and notice (announcement) management modules for storing application settings and broadcasting messages to users.

## System Configuration

### Features

- Key-value configuration stored in database
- CRUD operations with pagination and search
- Configurations can be cached to Redis for fast access
- Used for runtime-tunable application settings

### Data Model — SysConfig (`sys_config`)

| Field | Type | Description |
|-------|------|-------------|
| configId | Long | Primary key |
| configName | String | Display name |
| configKey | String | Unique config key |
| configValue | String | Config value |
| configType | Integer | Built-in or custom |
| remark | String | Notes |
| createTime | DateTime | Creation timestamp |
| updateTime | DateTime | Last update timestamp |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin-api/config` | List configs (paginated) |
| POST | `/admin-api/config/create` | Create config entry |
| PUT | `/admin-api/config/update` | Update config entry |
| POST | `/admin-api/config/delete` | Delete config(s) |

### Usage Example

Store a system-wide setting like the default pagination size:

| Config Key | Config Value | Description |
|-----------|-------------|-------------|
| `sys.default.pageSize` | `20` | Default page size |
| `sys.account.registerEnabled` | `false` | Allow self-registration |
| `sys.captcha.type` | `math` | Captcha type |

### Service Layer

`SysConfigService` provides:
- `findByConfigKey(String key)` — look up a config value by key
- Standard CRUD via Spring Data JPA `SysConfigRepository`

## Notice Management

### Features

- Create and manage system notices / announcements
- Support for different notice types (notification, announcement)
- Status management (draft, published)
- List with pagination and search

### Data Model — SysNotice (`sys_notice`)

| Field | Type | Description |
|-------|------|-------------|
| noticeId | Long | Primary key |
| noticeTitle | String | Notice title |
| noticeType | Integer | Type (1: notification, 2: announcement) |
| noticeContent | String | Content (supports rich text) |
| status | Integer | Status (0: draft, 1: published) |
| createBy | String | Creator |
| remark | String | Notes |
| createTime | DateTime | Creation timestamp |
| updateTime | DateTime | Last update timestamp |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin-api/notice` | List notices (paginated) |
| POST | `/admin-api/notice/create` | Create notice |
| PUT | `/admin-api/notice/update` | Update notice |
| POST | `/admin-api/notice/delete` | Delete notice(s) |

### Notice Types

| Type | Value | Description |
|------|-------|-------------|
| Notification | 1 | Internal team notifications |
| Announcement | 2 | System-wide announcements |

## Related Pages

- [User Management](./user-management.md) — system users who manage configs
- [Role & Permission](./role-permission.md) — permission control for config operations
