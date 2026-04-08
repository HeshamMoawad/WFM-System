
# GEMINI.md

## Project Overview

This project is a Django-based Work Force Management (WFM) system. It provides a backend API for managing users, commissions, and treasury functions. The system uses a PostgreSQL database and JWT for authentication.

**Key Technologies:**

*   **Backend:** Django, Django Rest Framework
*   **Database:** PostgreSQL
*   **Authentication:** JSON Web Tokens (JWT)
*   **API:** RESTful API

**Project Structure:**

The project is divided into three main Django apps:

*   `users`: Manages user accounts, profiles, projects, departments, and groups.
*   `commission`: Handles commission-related data and calculations.
*   `treasury`: Manages financial data and transactions.

## Building and Running

**1. Prerequisites:**

*   Python 3.x
*   PostgreSQL

**2. Installation:**

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Create and activate a virtual environment
python -m venv env
source env/bin/activate  # On Windows, use `env\Scripts\activate`

# Install dependencies
pip install -r requirements.txt
```

**3. Database Setup:**

*   Make sure you have a PostgreSQL database created for this project.
*   Update the database settings in `project/settings.py` with your database credentials.

**4. Running the application:**

```bash
# Apply database migrations
python manage.py migrate

# Run the development server
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000`.

**5. Running Tests:**

To run the project's tests, use the following command:

```bash
python manage.py test
```

## Development Conventions

*   **Coding Style:** The project follows the PEP 8 style guide for Python code.
*   **API Design:** The project uses Django Rest Framework to build a RESTful API.
*   **Authentication:** Authentication is handled using JSON Web Tokens (JWT).
*   **Migrations:** Database migrations are managed by Django's built-in migration system.
*   **Testing:** The project includes a suite of tests to ensure code quality and correctness.
