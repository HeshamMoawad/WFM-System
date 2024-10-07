# WFM System

The WFM System is a powerful and user-friendly workforce management tool designed to simplify employee attendance, permission requests, salary calculations, and more. It integrates seamlessly with ZK fingerprint machines, providing end-to-end payroll management in one platform.

## Features

- **ZK Fingerprint Machine Integration**: The system connects with ZK fingerprint machines to log attendance.
  
- **Customizable Attendance**: Administrators can adjust arrival and departure times for users and automatically calculate deductions based on attendance.
  
- **Permit Management**: The system replaces the traditional paper-based permission process by allowing users to submit requests through the platform.
  
- **Role-Based Access Control**: Different users have varying roles and permissions, ensuring secure access to sensitive information.
  
- **End-to-End Salary Calculation**: Handles complete payroll, including base salary, deductions, and bonuses.

- **Dark Mode**: A sleek, modern dark mode interface for comfortable use in low-light environments.
  
- **Responsive Design**: The platform is fully responsive and works seamlessly across devices, including PCs, laptops, tablets, and mobile phones.

- **Data Export**: All tables, including attendance and salary data, can be exported directly from the Django admin panel for further analysis or record-keeping.

- **Modern UI/UX**: The system features a clean, intuitive design that enhances the user experience.

## System Architecture

The system is built using Django for the backend and integrates with react as frontend to ensure fast, reliable, and secure operations.

### Key Components
1. **Attendance Management**: Logs user attendance from ZK machines, adjusts based on manual inputs, and calculates work duration.
   
2. **Permit Requests**: Users can submit leave or permission requests which can be approved or rejected by administrators.

3. **Salary Calculation**: The system automatically computes salaries based on work attendance, lateness, bonuses, and other factors.

4. **Role Management**: Administrators can assign different roles with varying permissions to control what each user can see and modify.

5. **User Dashboard**: Displays attendance records, pending requests, salary breakdowns, and other personalized details for each user.

## How to Run

### Prerequisites
- Python 3.x
- Django Framework
- Nodejs , React (if you want to enhance a frontend)
- ZK fingerprint machine integration libraries (optional)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wfm-system.git
   cd wfm-system
    ```

2. Install dependencies:
    ```bash  
    pip install -r requirements.txt
    ```

3. Run migrations:
    ```bash  
    python manage.py migrate
    ```

4. Create a superuser for the Django admin:
    ```bash  
    python manage.py createsuperuser
    ```

5. Start the server:
    ```bash  
    python manage.py runserver
    ```

6. Access the system at:
    ```bash  
    http://localhost:8000
    ```
