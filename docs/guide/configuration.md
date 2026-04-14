# Configuration

AppForge uses Spring Boot's profile-based configuration system with a custom `app-forge` properties prefix.

## Profile System

| Profile | File | Database | Redis | Flyway | Captcha |
|---------|------|----------|-------|--------|---------|
| **dev** (default) | `application-dev.yaml` | H2 (file-based) | Embedded | Disabled | Disabled |
| **test** | `application-test.yaml` | MySQL | Real Redis | Enabled | Enabled |
| **prod** | `application-prod.yaml` | MySQL (master/slave) | Real Redis | Enabled | Enabled |

Switch profiles via environment variable or JVM argument:

```bash
# Environment variable
SPRING_PROFILES_ACTIVE=prod ./gradlew server-admin:bootRun

# JVM argument
java -Dspring.profiles.active=prod -jar server-admin.jar
```

## Configuration Files

```
server-admin/src/main/resources/
├── application.yaml              # Shared base config (all profiles)
├── application-dev.yaml          # Dev overrides
├── application-test.yaml.example # Template for test (copy and edit)
├── application-prod.yaml.example # Template for prod (copy and edit)
└── log4j2-spring.xml            # Logging with <SpringProfile> sections
```

::: warning
`application-test.yaml` and `application-prod.yaml` are gitignored. Always copy from the `.example` files and fill in real values.
:::

## AppForge Properties (`app-forge.*`)

### Core Settings

```yaml
app-forge:
  name: AppForge                      # Application name
  version: 1.0.0                      # Version string
  copyright-year: 2025                # Footer copyright year
  captcha-type: math                  # Captcha type: "math" or "text"
  rsa-private-key: "MIICeAIB..."     # RSA key for frontend encryption
```

### JWT Configuration

```yaml
app-forge:
  jwt:
    secret: "your-base64-secret-key"  # HMAC-SHA512 signing key
    expire-seconds: 604800            # Token TTL (default: 7 days)
```

::: danger
Always change `jwt.secret` in production! The default key is for development only.
:::

### Token Configuration

```yaml
app-forge:
  token:
    header: Authorization             # HTTP header name
    auto-refresh-time: 20             # Auto-refresh threshold (minutes)
```

### Captcha Configuration

```yaml
app-forge:
  captcha:
    enabled: true                     # Enable/disable login captcha
```

### Server Monitor

```yaml
app-forge:
  monitor:
    enabled: true                     # Enable Oshi system monitoring
```

### Embedded Services (Dev Only)

```yaml
app-forge:
  embedded:
    redis: true                       # Start embedded Redis via Testcontainers
    h2-init: true                     # Load H2 seed data on startup
```

### Data Sensitivity

```yaml
app-forge:
  sensitive:
    enabled: true                     # Enable sensitive data masking in responses
```

## Datasource Configuration

AppForge uses `dynamic-datasource-spring-boot4-starter` for multi-datasource support with master/slave routing.

### Dev Profile (H2)

```yaml
spring:
  datasource:
    dynamic:
      primary: user_master
      strict: false
      datasource:
        user_master:
          driver-class-name: org.h2.Driver
          url: jdbc:h2:file:~/.h2/user;AUTO_SERVER=TRUE;MODE=MySQL
          username: sa
          password: ""
        user_slave:
          driver-class-name: org.h2.Driver
          url: jdbc:h2:file:~/.h2/user;AUTO_SERVER=TRUE;MODE=MySQL
          username: sa
          password: ""
```

### Production Profile (MySQL)

```yaml
spring:
  datasource:
    dynamic:
      primary: user_master
      strict: false
      datasource:
        user_master:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://master-host:3306/appforge?useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
          username: ${DB_USERNAME}
          password: ${DB_PASSWORD}
        user_slave:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://slave-host:3306/appforge?useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
          username: ${DB_USERNAME}
          password: ${DB_PASSWORD}
```

Use `@DS("group_name")` annotation for explicit datasource routing in service methods.

## Flyway Configuration

```yaml
app-forge:
  flyway:
    enabled: true    # Enable Flyway migrations (test/prod only)

spring:
  jpa:
    hibernate:
      ddl-auto: validate   # Flyway manages DDL; Hibernate only validates
```

See [Database Migration](./database-migration.md) for the full Flyway guide.

## Logging

Logging is configured in `log4j2-spring.xml` using `<SpringProfile>` for profile-specific behavior:

- **dev**: Console output with colored formatting
- **non-dev**: File-only output with rotation

## OpenTelemetry

```yaml
management:
  tracing:
    sampling:
      probability: 1.0          # dev: 100%, prod: 0.1 (10%)
  otlp:
    tracing:
      endpoint: http://localhost:4318/v1/traces
    metrics:
      endpoint: http://localhost:4318/v1/metrics
```

Override the OTLP endpoint in production via `OTEL_EXPORTER_OTLP_ENDPOINT` environment variable.

## Actuator Endpoints

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
```

| Endpoint | URL |
|----------|-----|
| Health | `http://localhost:8080/actuator/health` |
| Metrics | `http://localhost:8080/actuator/metrics` |
| Prometheus | `http://localhost:8080/actuator/prometheus` |

## Related Pages

- [Local Development Setup](./local-setup.md) — dev environment details
- [Database Migration](./database-migration.md) — Flyway configuration
- [Production Guide](../deploy/production.md) — production config checklist
```

---
