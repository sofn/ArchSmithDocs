# Docker Deployment

AppForge provides two Docker Compose deployment modes: **Native Image** (GraalVM) for production and **JVM** for development/testing.

## Deployment Modes

| Mode | Compose File | Advantages | Best For |
|------|-------------|-----------|----------|
| **Native** (default) | `docker-compose.native.yml` | ~100ms startup, ~50MB memory | Production |
| **JVM** | `docker-compose.yml` | Fast build, full debugging | Development/Testing |

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────┐
│  Browser     │────►│  Nginx (:80) │────►│ AppForge  │
│              │     │  Static files│     │  (:8080)  │
│              │     │  /api/* proxy│     │           │
└─────────────┘     └──────────────┘     └─────┬─────┘
                                               │
                                    ┌──────────┴──────────┐
                                    │                     │
                              ┌─────┴─────┐         ┌────┴────┐
                              │MySQL(:3306)│         │Redis(:6379)│
                              └───────────┘         └─────────┘
```

## Quick Start

```bash
cd AppForge/scripts

# Default: Native Image mode
./start.sh

# Or specify mode explicitly
./start.sh native   # GraalVM Native Image
./start.sh jvm      # Standard JVM
```

Or use `docker compose` directly:

```bash
cd AppForge/scripts

# Native mode
docker compose -f docker-compose.native.yml up -d --build

# JVM mode
docker compose -f docker-compose.yml up -d --build
```

## Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_ROOT_PASSWORD` | `123` | MySQL root password |
| `JWT_SECRET` | (built-in dev key) | JWT signing secret |

## Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend (Nginx) | 80 | Admin panel |
| Backend (AppForge) | 8080 | REST API |
| MySQL | 3306 | Database |
| Redis | 6379 | Cache |

## File Structure

```
scripts/
├── docker-compose.yml          # JVM mode
├── docker-compose.native.yml   # Native mode (default)
├── nginx/
│   └── default.conf            # Nginx reverse proxy config
├── start.sh                    # One-click startup script
├── .env.example                # Environment variable template
└── logs/                       # Application logs (created at runtime)
```

## Nginx Configuration

The Nginx service serves the frontend static files and proxies API requests to the backend:

```nginx
server {
    listen 80;
    server_name localhost;

    # Frontend static files
    location / {
        root   /usr/share/nginx/html;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://appforge:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Swagger UI proxy
    location /swagger-ui/ {
        proxy_pass http://appforge:8080/swagger-ui/;
    }

    # OpenAPI docs proxy
    location /v3/api-docs {
        proxy_pass http://appforge:8080/v3/api-docs;
    }
}
```

## Native vs JVM Comparison

| Metric | Native | JVM |
|--------|--------|-----|
| First build time | ~10 minutes | ~2 minutes |
| Docker image size | ~100MB | ~350MB |
| Startup time | ~100ms | ~10s |
| Runtime memory | ~50MB | ~300MB |
| Throughput | Slightly lower | High |
| Debug support | Limited | Full |

## Docker Compose Details

Both compose files define four services:

1. **mysqldb**: MySQL 8 with health check and persistent volume
2. **redis**: Redis 7 Alpine with health check
3. **appforge**: Backend application (depends on mysqldb and redis being healthy)
4. **appforge-admin**: Frontend Nginx container (depends on appforge)

The backend container receives all datasource configuration via environment variables:

```yaml
environment:
  SPRING_PROFILES_ACTIVE: prod
  SPRING_DATA_REDIS_HOST: redis
  DB_USERNAME: root
  DB_PASSWORD: ${DB_ROOT_PASSWORD:-123}
  JWT_SECRET: ${JWT_SECRET:-...}
  SPRING_DATASOURCE_DYNAMIC_DATASOURCE_USER_MASTER_URL: jdbc:mysql://mysqldb:3306/appforge?...
  SPRING_DATASOURCE_DYNAMIC_DATASOURCE_USER_SLAVE_URL: jdbc:mysql://mysqldb:3306/appforge?...
```

## Managing the Deployment

```bash
# View logs
docker compose -f docker-compose.native.yml logs -f appforge

# Restart a service
docker compose -f docker-compose.native.yml restart appforge

# Stop everything
docker compose -f docker-compose.native.yml down

# Stop and remove volumes (reset database)
docker compose -f docker-compose.native.yml down -v

# Rebuild a specific service
docker compose -f docker-compose.native.yml up -d --build appforge
```

## Related Pages

- [Production Guide](./production.md) — production hardening checklist
- [Database Migration](../guide/database-migration.md) — Flyway runs on Docker startup
- [Configuration](../guide/configuration.md) — environment variable mapping
```

---
