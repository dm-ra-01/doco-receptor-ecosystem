---
sidebar_position: 7
---

# API Reference

The Allocator provides a REST API built with **FastAPI**. It is used to trigger matching runs and check service health.

- [API Implementation Source](https://github.com/dm-ra-01/match-backend/blob/main/allocator/api.py)

## Base URL
The API is typically deployed as a microservice. In a standard local development environment, it is accessible at:
`http://localhost:8000`

## Authentication
Requests to the mutation endpoints (`POST`) require an API key passed in the header:
`X-API-KEY: <your_api_key>`

## Endpoints

### 1. Health Check
`GET /health`
Returns the current status and version of the service.

**Response**:
```json
{
  "status": "ok",
  "version": "2.3.0",
  "timestamp": "2024-02-05T10:45:00.000Z"
}
```

### 2. Solve Specific Run
`POST /runs/{run_id}/solve`
Triggers the solver for a specific run ID present in the `allocator_py_runs` table. This is an **asynchronous** operation; it returns immediately and processes the match in a background task.

**Parameters**:
- `run_id` (Path, Required): The UUID of the run record.

**Response (202 Accepted)**:
```json
{
  "message": "Allocation run started in the background",
  "run_id": "uuid-string",
  "status": "processing"
}
```

### 3. Process All Pending
`POST /runs/process-pending`
Scans the database for any run records that have not been completed (`completed_at IS NULL`) and triggers sequential processing for them in the background.

**Response (202 Accepted)**:
```json
[
  {
    "message": "Batch processing started",
    "run_id": "all",
    "status": "processing"
  }
]
```

## Interactive Documentation
When running the service locally, full interactive Swagger documentation is available at `/docs`.
