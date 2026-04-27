# Project Overview: WFM-System

WFM-System is a Workforce Management system designed to handle various administrative tasks like attendance tracking, commission calculation, treasury management, and lead processing. It is built using **Django 3.2** with a focus on **Django REST Framework (DRF)** for API delivery.

## Architecture and Technologies

- **Backend:** Python / Django 3.2
- **API:** Django REST Framework (DRF) with SimpleJWT for authentication.
- **Database:** PostgreSQL (primary) / SQLite3 (development fallback).
- **Frontend:** Integrated Django templates (found in `backend/templates/`) and static files.
- **Key Integrations:**
  - **Fingerprint Attendance:** Uses `pyzk` for interacting with ZK biometric devices.
  - **Messaging:** Support for WhatsApp and Telegram notifications.
  - **Data Handling:** `django-import-export` for Excel/CSV data management.
  - **Background Tasks:** Celery (based on `requirements.txt`).

## Key Modules

- **`users`**: Custom user model, biometric fingerprint ID mapping, and a granular page-based permission system (`MainPage`, `SubPage`, `Group`).
- **`commission`**: Logic for calculating and managing user commissions.
- **`treasury`**: Financial management, advances, and outcomes.
- **`core`**: Base models and filters used across the project.
- **`utils`**: Helper functions for model signals, parsers, and external integrations (e.g., Telegram).

## Development Conventions

- **Signals for Audit:** The project uses Django signals (found in `users/models.py`) to automatically track updates to critical models in an `UpdateHistory` table.
- **Custom Authentication:** Supports multiple authentication methods including JWT, custom Header, Cookie, and Body based authentication.
- **Granular Permissions:** Access is managed through `Group` instances linked to `MainPage` and `SubPage` objects.

## Building and Running

### Prerequisites
- Python 3.7+
- PostgreSQL (configured in `project/settings.py`)

### Manual Setup
1.  **Install dependencies:**
    ```bash
    pip install -r backend/requirements.txt
    ```
2.  **Run Migrations:**
    ```bash
    python backend/manage.py migrate
    ```
3.  **Run Development Server:**
    ```bash
    python backend/manage.py runserver
    ```

### Docker
The project includes a root `Dockerfile` that sets up the Django application using `python:3.7-alpine`.

```bash
docker build -t wfm-system .
docker run -p 8000:8000 wfm-system
```

## Directory Structure Highlights
- `backend/`: Primary Django application.
  - `project/`: Core configuration and settings.
  - `users/`, `commission/`, `treasury/`: Domain-specific apps.
  - `templates/`: HTML templates for the web interface.
- `nginx-reports/`: Directory for storing generated reports (e.g., `report.html`).
