# FISPCA_WEB
## PCBA Traceability System

A web application designed to track and manage PCBA (Printed Circuit Board Assembly) production data in real-time. It enables users to query internal and customer serial numbers, track the production status across multiple stations, and retrieve logs from various manufacturing tables. This system is crucial for ensuring traceability and quality control within the SMT (Surface Mount Technology) production process.

## Features

- **Real-time Traceability**: Query PCBA data using internal serial numbers or customer IDs.
- **Production Status**: Displays current and next production stations with detailed logs.
- **Multiple Logs**: Retrieves and unifies logs from SMT, PCA, API, and other manufacturing steps.
- **Interactive Frontend**: User-friendly interface built with HTML, CSS, JavaScript, and Bootstrap.
- **Backend Processing**: Node.js server interacting with SQL Server using Express.js and `mssql` for database queries.

## Technologies Used

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Bootstrap for responsive design
  - AJAX for real-time server communication

- **Backend**:
  - Node.js with Express.js
  - SQL Server for data storage
  - `mssql` for database interactions

- **Database Management**:
  - SQL Server (SSMS)
  - MySQL for other data-driven needs

- **Version Control**:
  - Git and GitHub for source code management and collaboration

- **Other Tools**:
  - Winston for logging
  - Morgan for HTTP request logging

## Installation

To set up the application on your local machine, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pcba-traceability-system.git
