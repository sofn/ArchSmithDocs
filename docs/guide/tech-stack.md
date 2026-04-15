# Tech Stack

A detailed breakdown of every major technology used in ArchSmith.

## Backend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Spring Boot | 4.0.5 | Application framework |
| Language | Java (Azul Zulu) | 25 | Virtual threads, pattern matching, records, stable values |
| Build | Gradle | 9.4.1 | Build tool with configuration cache |
| Security | Spring Security | 7.x | Authentication and authorization |
| ORM | Spring Data JPA | 4.x | Data access layer |
| Query | QueryDSL | 5.1.0 | Type-safe dynamic queries |
| JWT | JJWT | 0.12.6 | Token generation and validation |
| Multi-datasource | dynamic-datasource | 4.5.0 | Master/slave routing, read/write split |
| API Docs | SpringDoc OpenAPI | 2.8.11 | Swagger UI and OpenAPI 3.0 spec |
| DB Migration | Flyway | 11.8.0 | Schema version control |
| System Monitor | Oshi | 6.8.1 | CPU, memory, disk, OS monitoring |
| Database | PostgreSQL | 17.x | Relational database (all environments) |
| File Storage | AWS S3 SDK | 2.x | File upload/download with S3-compatible backends (MinIO) |
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
| Testing | Testcontainers | 2.0.4 | Integration tests with Docker containers (PostgreSQL, Redis, MinIO) |
| Testing | RestClient Integration | — | 15 REST API integration tests for user/role/dept CRUD |
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
| Native Compilation | BellSoft Liberica NIK 25 | Ahead-of-time native image compilation for fast startup |
| CDS Optimization | Project Leyden (CDS) | Class Data Sharing for faster JVM startup |
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
