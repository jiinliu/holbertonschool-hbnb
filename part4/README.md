# HBnB API - Part 4

A Flask-based REST API for an AirBnB clone (HBnB) with JWT authentication, MySQL database, and Swagger documentation.

## Architecture

- **Flask** web framework with **Flask-RESTX** for API documentation
- **SQLAlchemy** ORM with MySQL database
- **JWT authentication** for secure endpoints
- **Repository pattern** for data persistence
- **Facade pattern** for business logic

## API Endpoints

The API provides RESTful endpoints under `/api/v1/`:
- `/users` - User management
- `/places` - Property listings
- `/reviews` - Review management
- `/amenities` - Amenity management
- `/auth` - Authentication
- `/protected` - Protected routes requiring JWT

## Local Development Setup

### Prerequisites

- Python 3.x
- Docker (for MySQL database)

### 1. Database Setup with Docker

**Option A: Using Docker Run**
```bash
# Start MySQL container
docker run --name hbnb-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=hbnb_evo_2_db \
  -e MYSQL_USER=hbnb_evo_2 \
  -e MYSQL_PASSWORD=hbnb_evo_2_pwd \
  -p 3306:3306 \
  -d mysql:8.0

# Wait for MySQL to start (about 10-15 seconds)
docker logs -f hbnb-mysql

# Create database tables
cat tables.sql | docker exec -i hbnb-mysql mysql -u root -prootpass
```

**Option B: Using Docker Compose (Recommended)**
```bash
# From project root directory
docker-compose up -d

# Create database tables
cat part4/tables.sql | docker exec -i hbnb-mysql mysql -u root -prootpass
```

### 2. Python Environment Setup

```bash
# Navigate to part4 directory
cd part4

# Install dependencies
pip install -r requirements.txt
```

### 3. Start the Application

```bash
# Start the Flask development server
python run_v4.py
```

The application will be available at:
- **Web Interface**: http://127.0.0.1:5001
- **API Documentation (Swagger)**: http://127.0.0.1:5001/swagger
- **API Base URL**: http://127.0.0.1:5001/api/v1/

### 4. Default Admin User

The system automatically creates a default admin user:
- **Email**: `admin@hbnb.io`
- **Password**: `admin1234`

## Docker Management

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything including data
docker-compose down -v

# View logs
docker-compose logs mysql

# Check running services
docker-compose ps
```

### Using Docker Run Commands

```bash
# Start MySQL container
docker start hbnb-mysql

# Stop MySQL container
docker stop hbnb-mysql

# View MySQL logs
docker logs hbnb-mysql

# Connect to MySQL
docker exec -it hbnb-mysql mysql -u hbnb_evo_2 -phbnb_evo_2_pwd hbnb_evo_2_db
```

## Database Management

### Verify Tables
```bash
docker exec -it hbnb-mysql mysql -u hbnb_evo_2 -phbnb_evo_2_pwd hbnb_evo_2_db -e "SHOW TABLES;"
```

### Reset Database
```bash
# Drop and recreate database
docker exec -it hbnb-mysql mysql -u root -prootpass -e "
DROP DATABASE IF EXISTS hbnb_evo_2_db;
CREATE DATABASE hbnb_evo_2_db;
GRANT ALL PRIVILEGES ON hbnb_evo_2_db.* TO 'hbnb_evo_2'@'%';
FLUSH PRIVILEGES;
"

# Recreate tables
cat tables.sql | docker exec -i hbnb-mysql mysql -u root -prootpass
```

## API Testing

### Example API Calls

```bash
# Get all users
curl http://localhost:5000/api/v1/users

# Get all places
curl http://localhost:5000/api/v1/places

# Search places
curl -X POST "http://localhost:5000/api/v1/places/search" \
  -H "Content-Type: application/json" \
  -d '{"name": "cozy", "price": "250", "amenities": ["wi-fi", "toilet"]}'

# Login (get JWT token)
curl -X POST "http://localhost:5000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@hbnb.io", "password": "admin1234"}'
```

## Troubleshooting

### Common Issues

1. **MySQL Connection Error**: Ensure Docker container is running
   ```bash
   docker ps | grep hbnb-mysql
   ```

2. **Tables Don't Exist**: Run the SQL file to create tables
   ```bash
   cat tables.sql | docker exec -i hbnb-mysql mysql -u root -prootpass
   ```

3. **Port 3306 Already in Use**: Stop other MySQL services or change port mapping

4. **Permission Denied**: Ensure Docker is running and you have permissions

### Quick Reset

If you encounter issues, you can quickly reset everything:

```bash
# Stop and remove everything
docker-compose down -v
# or
docker stop hbnb-mysql && docker rm hbnb-mysql

# Start fresh
docker-compose up -d
# or use the docker run command above

# Recreate tables
cat tables.sql | docker exec -i hbnb-mysql mysql -u root -prootpass

# Start the app
python run_v4.py
```

## Development Workflow

1. **Start development environment**:
   ```bash
   docker-compose up -d
   cd part4
   python run_v4.py
   ```

2. **Make changes to code** - Flask will auto-reload in debug mode

3. **Test API endpoints** using Swagger UI at http://localhost:5000/swagger

4. **Stop development environment**:
   ```bash
   # Stop Flask app with Ctrl+C
   docker-compose stop
   ```