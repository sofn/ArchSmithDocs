Open `http://localhost:8848` in your browser and log in with:

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

::: info
The dev profile disables captcha verification by default, so you can log in directly.
:::

## Option 2: Docker (One Command)

If you have Docker installed, you can start the entire stack — backend, frontend, MySQL, and Redis — with a single command:

```bash
cd AppForge/scripts

# Copy and customize environment variables (optional)
cp .env.example .env

# Start all services
./start.sh
```

This uses the GraalVM Native Image mode by default. For JVM mode:

```bash
./start.sh jvm
```

Once all containers are healthy, open [http://localhost](http://localhost) (port 80).

See [Docker Deployment](../deploy/docker.md) for detailed configuration options.

## Verify Everything Works

After logging in, you should see the admin dashboard with:

- **System Management** menu — Users, Roles, Menus, Departments
- **System Monitoring** — Server resource metrics (CPU, Memory, JVM, Disk)
- **System Tools** — API documentation (embedded Swagger UI)

### Quick API Check

```bash
# Health check
curl http://localhost:8080/actuator/health

# Login API
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Next Steps

- [Local Development Setup](./local-setup.md) — IDE configuration, hot reload, debugging
- [Configuration](./configuration.md) — customize profiles, JWT, captcha, and more
- [Project Structure](./project-structure.md) — understand the codebase organization
- [Tech Stack](./tech-stack.md) — explore the full dependency list
```

---

### 3. `/home/sofn/code/sofn/AppForgeDocs/docs/guide/tech-stack.md`

```markdown
# Tech Stack

A detailed breakdown of every major technology used in AppForge.

## Backend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Spring Boot | 4.0.5 | Application framework |
| Language | Java | 21 | Virtual threads, pattern matching, records |
| Build | Gradle | 9.4.1 | Build tool with configuration cache |
| Security | Spring Security | 7.x | Authentication and authorization |
| ORM | Spring Data JPA | 4.x | Data access layer |
| Query | QueryDSL | 5.1.0 | Type-safe dynamic queries |
| JWT | JJWT | 0.12.6 | Token generation and validation |
| Multi-datasource | dynamic-datasource | 4.5.0 | Master/slave routing, read/write split |
| API Docs | SpringDoc OpenAPI | 2.8.11 | Swagger UI and OpenAPI 3.0 spec |
| DB Migration | Flyway | 11.8.0 | Schema version control |
| System Monitor | Oshi | 6.8.1 | CPU, memory, disk, OS monitoring |
| Database (dev) | H2 | 2.4.240 | Embedded database for development |
| Database (prod) | MySQL | 8.x | Production relational database |
| Cache | Redis | 7.x | Session cache, data caching |
| Connection Pool | Druid | (via dynamic-datasource) | Connection pooling and monitoring |
| Captcha | Kaptcha | 2.3.2 | Login captcha (text + math) |
| Object Mapping | MapStruct | 1.6.3 | Compile-time bean mapping |
| Utilities | Guava | 33.4.8 | Collections, caching, strings |
| Utilities | Apache Commons | Lang 3.20, IO 2.19 | String/IO utilities |
| IP Lookup | ip2region | 2.7.0 | Offline IP geolocation |
| User Agent | UserAgentUtils | 1.21 | Browser/OS detection for login logs |
| Serialization | Jackson | (Spring Boot managed) | JSON serialization |
| Logging | Log4j2 | (Spring Boot managed) | Structured logging with Spring profiles |
| Tracing | Micrometer + OpenTelemetry | 1.5.6 / 1.52.0 | Distributed tracing and metrics |
| Testing | JUnit 6 | 6.0.3 | Unit testing framework |
| Testing | Spock | 2.4-groovy-5.0 | BDD-style testing with Groovy 5 |
| Testing | Testcontainers | 2.0.4 | Integration tests with Docker containers |
| Code Style | Spotless + Google Java Style | — | Automated code formatting |
| Boilerplate | Lombok | 1.18.44 | Annotation-based code generation |

## Frontend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Vue | 3.5 | Reactive UI framework |
| Build | Vite | 8 | Next-gen frontend build tool |
| Language | TypeScript | 6 | Type-safe JavaScript |
| UI Library | Element Plus | 2.13 | Enterprise UI components |
| State | Pinia | 3 | Vue 3 state management |
| Router | Vue Router | 5 | SPA routing |
| CSS | TailwindCSS | 4 | Utility-first CSS framework |
| HTTP | Axios | — | HTTP client with interceptors |
| i18n | vue-i18n | — | Internationalization |
| Base Template | vue-pure-admin | — | Enterprise admin template |

## Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Reverse Proxy | Nginx | Static file serving, API proxy |
| Containerization | Docker + Docker Compose | Deployment orchestration |
| Native Compilation | GraalVM | Ahead-of-time compilation for fast startup |
| Observability | OTLP (OpenTelemetry Protocol) | Tracing and metrics export |
| Monitoring | Spring Boot Actuator | Health, metrics, Prometheus endpoints |

## Version Management

All dependency versions are centrally managed in `dependencies/build.gradle.kts` using Gradle's `java-platform` plugin. This ensures consistent versions across all modules without version conflicts.

```kotlin
// dependencies/build.gradle.kts
dependencies {
    constraints {
        api("com.baomidou:dynamic-datasource-spring-boot4-starter:4.5.0")
        api("io.jsonwebtoken:jjwt-api:0.12.6")
        api("com.querydsl:querydsl-jpa:5.1.0")
        api("org.flywaydb:flyway-core:11.8.0")
        // ... all versions in one place
    }
}
```

Individual modules reference the platform without specifying versions:

```kotlin
// domain/admin-user/build.gradle.kts
dependencies {
    implementation(platform(project(":dependencies")))
    implementation("com.querydsl:querydsl-jpa")  // version from platform
}
```

## Related Pages

- [Project Structure](./project-structure.md) — how the modules are organized
- [Configuration](./configuration.md) — runtime configuration for each technology
- [Local Development Setup](./local-setup.md) — getting your IDE ready
```

---


```markdown
# Project Structure

AppForge follows a domain-driven, multi-module architecture. Each module has a clear responsibility and well-defined boundaries.

## Backend (AppForge)

```
AppForge/
├── common/                          # Shared libraries
│   ├── common-core/                 # Core utilities
│   │   └── src/main/java/
│   │       ├── enums/               # BasicEnum, DictionaryEnum
│   │       ├── repository/          # BaseEntity, base repository
│   │       ├── utils/               # Encryption, IP, string utilities
│   │       └── annotation/          # @Sensitive, @Dictionary, @BaseInfo
│   └── common-error/                # Error handling
│       └── src/main/java/
│           ├── ErrorCode.java       # Error code interface
│           ├── ErrorInfo.java       # Error response model
│           └── BizException.java    # Business exception base class
│
├── infrastructure/                  # Cross-cutting concerns
│   └── src/main/java/
│       ├── auth/                    # Authentication service, JWT, login models
│       ├── config/                  # AppForgeConfig, SwaggerConfig, CaptchaConfig
│       ├── db/                      # RedisUtil, GroupDataSourceProxy
│       ├── frame/
│       │   ├── context/             # RequestContext, RequestIDGenerator
│       │   ├── filters/             # AuthResourceFilter, RequestLogFilter
│       │   ├── response/            # ResultValueWrapper, ErrorExceptionHandle
│       │   ├── database/            # GroupDataSourceProxy (dynamic-datasource bridge)
│       │   └── spring/              # ApplicationContextHolder
│       └── user/                    # BaseLoginUser, UserProvider SPI
│
├── domain/                          # Business logic modules
│   └── admin-user/                  # User management bounded context
│       └── src/main/java/
│           ├── domain/              # JPA entities
│           │   ├── SysUser.java
│           │   ├── SysRole.java
│           │   ├── SysMenu.java
│           │   ├── SysDept.java
│           │   ├── SysConfig.java
│           │   ├── SysNotice.java
│           │   ├── SysOperLog.java
│           │   ├── SysLoginLog.java
│           │   └── SysRoleMenu.java
│           ├── dao/                 # Spring Data JPA repositories
│           ├── service/             # Business services
│           ├── menu/                # Menu-specific logic, DTOs, custom repository
│           ├── enums/               # MenuTypeEnum, status enums
│           └── errors/              # AdminUserErrorCode, AdminUserException
│
├── server-admin/                    # Web application entry point
│   └── src/main/
│       ├── java/
│       │   ├── Application.java     # @SpringBootApplication main class
│       │   ├── controller/
│       │   │   ├── LoginController.java      # Login, captcha, token, routes
│       │   │   ├── AdminApiController.java   # Admin CRUD APIs
│       │   │   └── system/                   # RESTful system controllers
│       │   ├── security/            # Spring Security filter chain config
│       │   └── error/               # Error controller
│       └── resources/
│           ├── application.yaml          # Shared base configuration
│           ├── application-dev.yaml      # Dev profile (H2, embedded Redis)
│           ├── application-test.yaml.example
│           ├── application-prod.yaml.example
│           ├── db/migration/             # Flyway migration scripts
│           └── log4j2-spring.xml         # Logging config with SpringProfile
│
├── example/                         # Example/extension modules
│   └── example-task/                # Task domain example
│
├── dependencies/                    # Centralized version management
│   └── build.gradle.kts            # java-platform BOM
│
├── scripts/                         # Deployment files
│   ├── docker-compose.yml           # JVM mode deployment
│   ├── docker-compose.native.yml    # Native Image deployment
│   ├── nginx/default.conf           # Nginx reverse proxy config
│   ├── start.sh                     # One-click startup script
│   └── .env.example                 # Environment variable template
│
├── Dockerfile                       # JVM Docker image
└── Dockerfile.native                # GraalVM Native Docker image
```

## Frontend (AppForgeAdmin)

```
AppForgeAdmin/
├── src/
│   ├── api/                 # API endpoint definitions (Axios)
│   ├── assets/              # Static assets (images, SVGs)
│   ├── components/          # Shared Vue components
│   ├── config/              # App configuration
│   ├── directives/          # Vue custom directives
│   ├── layout/              # Page layouts (sidebar, header, tabs)
│   ├── plugins/             # Plugin registrations (Element Plus, i18n)
│   ├── router/              # Vue Router configuration
│   │   └── modules/         # Route module definitions
│   ├── store/               # Pinia state stores
│   │   └── modules/         # Store modules (user, permission, app)
│   ├── utils/               # Utility functions (auth, http, hasPerms)
│   ├── views/               # Page components
│   │   ├── login/           # Login page
│   │   ├── system/          # System management pages
│   │   └── monitor/         # Server monitoring page
│   └── App.vue              # Root component
├── Dockerfile               # Nginx-based Docker image
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # TailwindCSS configuration
└── package.json             # Dependencies and scripts
```

## Module Dependencies

```
server-admin
  ├── infrastructure
  │     ├── common-core
  │     └── common-error
  └── domain/admin-user
        ├── common-core
        └── common-error
```

The dependency flow is strictly top-down: `server-admin` depends on `infrastructure` and `domain` modules, but domain modules never depend on the web layer. This ensures business logic remains portable and testable.

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Multi-module Gradle | Clear boundaries between layers, parallel compilation |
| `dependencies/` BOM module | Single source of truth for all library versions |
| Domain per bounded context | `admin-user` module can be replaced or extended independently |
| QueryDSL predicates in `domain/` | Type-safe filtering logic stays close to entities |
| Flyway scripts in `server-admin/resources/` | Migration scripts deploy with the application |
| Separate `infrastructure/` | Auth, filters, and config are reusable across domains |

## Related Pages

- [Tech Stack](./tech-stack.md) — technology choices explained
- [Configuration](./configuration.md) — YAML config structure
- [Local Development Setup](./local-setup.md) — IDE and tooling
```

---
