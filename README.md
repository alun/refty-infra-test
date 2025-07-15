# Refty Node Versions Service

A Node.js/TypeScript service to automate updating Docker image versions in YAML files within a repository, and push those changes to a remote GitHub repository. Designed for CI/CD and DevOps automation.

## Features

- Scans all YAML files in the repository for Docker image tags
- Updates image tags to a specified version via HTTP API
- Commits and pushes changes to a new branch in a remote GitHub repository
- Logs all actions to console and file

## Requirements

- Node.js 20+
- Access to a GitHub repository (with a personal access token)

## Environment Variables

Create a `.env` file in the `app/` directory with the following variables:

```ini
# .env example
GITHUB_TOKEN=githubToken:ghp_xxxxxxxxxxxxxxxxxxxxx
REPO_OWNER=owner
GIT_USER_EMAIL=test@mail.com
FORK_REMOTE_NAME=origin
WORK_BRANCH=update-version
REPO_NAME=refty-infra-test
```

## Installation & Usage

### 1. Install dependencies

```bash
cd app
npm install
```

### 2. Build the project

```bash
npm run build
```

### 3. Start the server

```bash
npm run serve
```

The server will start on the port: 3000.

### 4. API Usage

Send a POST request to `/update-version` with JSON body:

```json
{
  "image": "your-docker-image",
  "version": "new-version"
}
```

## Running with Docker

### 1. Build the Docker image

```bash
docker build -t refty-node-versions-service .
```

### 2. Run the container

```bash
docker run -p 3000:3000 --env-file .env refty-node-service
```

- The `--env-file` flag loads environment variables from your `.env` file.

## Logs

- Console output and `app/logs/app.log` file.
