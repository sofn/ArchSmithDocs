# Quick Start

Get AppForge running locally in under 5 minutes.

## Prerequisites

| Tool | Version | Check Command |
|------|---------|---------------|
| Java | 21+ | `java -version` |
| Node.js | 20+ | `node -v` |
| pnpm | 9+ | `pnpm -v` |
| Git | any | `git --version` |
| Docker | (optional) | `docker -v` |

::: tip
Make sure `JAVA_HOME` points to a JDK 21 installation. You can verify with:
```bash
echo $JAVA_HOME
java -version
```
:::

## Option 1: Manual Setup

### 1. Clone the Repositories

```bash
# Backend
git clone https://github.com/sofn/AppForge.git

# Frontend
git clone https://github.com/sofn/AppForgeAdmin.git
```

### 2. Start the Backend

```bash
cd AppForge
./gradlew server-admin:bootRun
```

The dev profile activates automatically, using:
- **H2** file-based database (no MySQL needed)
- **Embedded Redis** (no Redis installation needed)
- **Hibernate DDL auto** for schema creation
- Pre-loaded seed data (admin user, roles, menus, etc.)

Wait for the startup log:

