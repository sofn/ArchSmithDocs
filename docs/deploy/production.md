# Production Guide

A checklist and guide for deploying AppForge to a production environment.

## Pre-Deployment Checklist

| # | Task | Priority | Notes |
|---|------|----------|-------|
| 1 | Change JWT secret | **Critical** | Generate a new HMAC-SHA512 key |
| 2 | Change RSA private key | **Critical** | Generate a new RSA key pair |
| 3 | Change MySQL password | **Critical** | Use a strong password |
| 4 | Enable captcha | High | Set `app-forge.captcha.enabled: true` |
| 5 | Configure MySQL (master/slave) | High | Set up replication if needed |
| 6 | Configure Redis | High | Use a dedicated Redis instance |
| 7 | Enable Flyway | High | Set `app-forge.flyway.enabled: true` |
| 8 | Set JPA DDL to validate | High | `spring.jpa.hibernate.ddl-auto: validate` |
| 9 | Configure HTTPS | High | Terminate SSL at Nginx or load balancer |
| 10 | Set up database backups | High | Automated daily backups |
| 11 | Adjust OTLP sampling | Medium | Set to 10% for production |
| 12 | Review log levels | Medium | Avoid DEBUG in production |
| 13 | Set memory limits | Medium | JVM flags or Docker resource limits |

## Generate Secrets

### JWT Secret

Generate a secure Base64-encoded key:

```bash
openssl rand -base64 64
```

Set it in your `application-prod.yaml` or as an environment variable:

```yaml
app-forge:
  jwt:
    secret: "YOUR_GENERATED_BASE64_KEY"
```

Or via Docker:

```bash
JWT_SECRET="YOUR_GENERATED_BASE64_KEY" docker compose up -d
```

### RSA Key Pair

Generate a new RSA private key:

```bash
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:1024
openssl pkcs8 -topk8 -inform PEM -outform DER -in private.pem -out private.der -nocrypt
base64 private.der
```

Set the Base64-encoded private key in `app-forge.rsa-private-key`. Share the corresponding public key with the frontend.

## Production Configuration

Create `server-admin/src/main/resources/application-prod.yaml` from the example:

```bash
cp application-prod.yaml.example application-prod.yaml
```

### Key Settings

```yaml
server:
  port: 8080

spring:
  jpa:
    hibernate:
      ddl-auto: validate         # Flyway manages DDL
  datasource:
    dynamic:
      primary: user_master
      datasource:
        user_master:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://master:3306/appforge?useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
          username: ${DB_USERNAME}
          password: ${DB_PASSWORD}
        user_slave:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://slave:3306/appforge?useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
          username: ${DB_USERNAME}
          password: ${DB_PASSWORD}
  data:
    redis:
      host: ${REDIS_HOST:redis}
      port: 6379

app-forge:
  jwt:
    secret: ${JWT_SECRET}
    expire-seconds: 86400        # 24 hours for production
  captcha:
    enabled: true
  flyway:
    enabled: true
  monitor:
    enabled: true
  embedded:
    redis: false                 # Use real Redis
    h2-init: false               # No seed data

management:
  tracing:
    sampling:
      probability: 0.1           # 10% sampling in production
```

## Database Setup

### First Deployment

```bash
# Create database on MySQL master
mysql -h <master-host> -u root -p -e \
  "CREATE DATABASE appforge DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Start application — Flyway creates all tables and seeds data
SPRING_PROFILES_ACTIVE=prod java -jar server-admin.jar
```

### Subsequent Deployments

Flyway automatically detects and runs new migration scripts. Always:

1. Backup the database before deploying
2. Review migration scripts via code review
3. Test migrations in the test environment first

See [Database Migration](../guide/database-migration.md) for the full guide.

## HTTPS Setup

### Option A: Nginx SSL Termination

```nginx
server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;

    ssl_certificate     /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://appforge:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }
}

server {
    listen 80;
    server_name admin.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Option B: Cloud Load Balancer

If using AWS ALB, GCP Load Balancer, or similar, terminate SSL at the load balancer and proxy HTTP to Nginx on port 80.

## Backup Strategy

### Database Backup

```bash
# Daily automated backup
mysqldump -h <master-host> -u root -p appforge | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Application Backup

- Docker volumes for MySQL data: `mysql-data`
- Application logs: `scripts/logs/`
- Configuration: `application-prod.yaml` (keep in a secure vault, not git)

## Monitoring

### Health Check

```bash
curl http://localhost:8080/actuator/health
```

### Prometheus Metrics

Expose to your Prometheus scraper:

