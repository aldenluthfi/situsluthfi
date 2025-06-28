<picture>
  <source media="(prefers-color-scheme: light)" srcset="/.github/meta/dark.png">
  <source media="(prefers-color-scheme: dark)" srcset="/.github/meta/light.png">
  <img>
</picture>

## 📖 About

A modern, full-stack personal portfolio website featuring a minimalistic design, powerful search capabilities, and comprehensive content management. Built with React, Express.js, and powered by Elasticsearch.

🌐 **Live Website:** [aldenluth.fi](https://aldenluth.fi/)

## ✨ Features

### 🎨 Frontend
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Dark/Light Theme**: Automatic timezone-based theme switching with manual override
- **Color Themes**: 18 different color schemes to choose from
- **Interactive Maps**: SVG-based world map for travel gallery
- **Custom Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Progressive Web App**: Offline capabilities and fast loading

### 🔍 Search Engine
- **Elasticsearch Integration**: Full-text search across all content
- **Smart Suggestions**: Auto-complete with fuzzy matching
- **Multi-content Search**: Search through writings, projects, and more
- **Real-time Results**: Instant search with debounced queries

### 📝 Content Management
- **Notion Integration**: Automatic syncing of blog posts from Notion
- **Markdown Support**: Full markdown rendering with custom components
- **Syntax Highlighting**: Code blocks with multiple language support
- **Math Rendering**: LaTeX support with KaTeX
- **Table of Contents**: Auto-generated with smooth scrolling

### 🚀 Projects Showcase
- **GitHub Integration**: Automatic repository syncing
- **Image Galleries**: Project screenshots with zoom functionality
- **Technology Tags**: Visual representation of tech stacks
- **Live Demos**: Direct links to deployed projects

### 📊 Additional Features
- **CV Generation**: Dynamic resume/CV with filtering
- **Gallery System**: Photo galleries organized by location
- **Contact Forms**: Integrated communication system
- **Analytics Ready**: Easy integration with analytics platforms
- **Timezone Theming**: Automatic theme switching based on my timezone (Asia/Jakarta)

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **MySQL** - Relational database
- **Elasticsearch** - Search engine
- **Notion API** - Content management integration
- **GitHub API** - Repository data fetching

### DevOps & Deployment
- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **Kind** - Local Kubernetes development
- **GitHub Actions** - CI/CD pipeline
- **ESLint** - Code linting
- **Husky** - Git hooks

## 🚀 Quick Start

### 📖 Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Kind (for Kubernetes deployment)
- Git

### ⚙️ Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/aldenluthfi/situsluthfi.git
   cd situsluthfi
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend && npm install && cd ..

   # Install backend dependencies
   cd backend && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment templates
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env

   # Edit the .env files with your configuration
   ```

4. **Start development servers**

   **Option A: Using Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```

   **Option B: Manual setup**
   ```bash
   # Start MySQL and Elasticsearch (using Docker)
   docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=yourpassword mysql:8.0
   docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" elasticsearch:9.0.1

   # Start backend
   cd backend && npm run dev &

   # Start frontend
   cd frontend && npm run dev
   ```

5. **Access the application**

   **Option A: Using Docker Compose (Recommended)**

   - Frontend: http://localhost:8080

   **Option B: Manual setup**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

### 💼 Production Deployment

**Using Kubernetes with Kind:**
```bash
./deploy.sh
```

**Using Docker Compose:**
```bash
docker-compose up -d
```

## 📋 Content Overview

```
situsluthfi/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   └── assets/          # Static assets
│   ├── public/              # Public static files
│   └── package.json
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── db/              # Database configuration
│   │   └── utils/           # Utility functions
│   ├── init.sql             # Database schema
│   └── package.json
├── k8s/                     # Kubernetes manifests
├── .github/                 # GitHub Actions workflows
├── docker-compose.yaml      # Development compose file
├── deploy.sh                # Deployment script
└── README.md
```

## 🔧 Configuration

**Root `.env`:**
```bash
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=your_database_name
```

**Backend `.env`:**
```bash
# Notion Integration
NOTION_API_KEY=your_notion_api_key
NOTION_WRITINGS_DATABASE_ID=your_database_id

# Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database

# Search Engine
ELASTICSEARCH_URL=http://localhost:9200

# GitHub Integration
GITHUB_TOKEN=your_github_token
```

## 📚 API Documentation

The backend API provides comprehensive endpoints for managing content, search functionality, and data synchronization. All endpoints return JSON responses and follow RESTful conventions.

**Base URL:** `https://api.aldenluth.fi/api` (Production) or `http://localhost:3000/api` (Development)

### 🎲 Facts API

#### Get Random Fact

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/facts` | GET | Retrieve a random fact from the database |

| **Parameters** | **Type** | **Required** | **Description** |
|----------------|----------|--------------|-----------------|
| None | - | - | No parameters required |

| **Example Request** |
|---------------------|
| `GET /api/facts` |

| **Example Response** | **Status Code** |
|----------------------|-----------------|
| ```json<br>{<br>  "id": 1,<br>  "text": "Honey never spoils",<br>  "source": "National Geographic"<br>}``` | 200 OK |

| **Error Responses** | **Status Code** | **Description** |
|---------------------|-----------------|-----------------|
| ```json<br>{<br>  "error": "Failed to fetch facts"<br>}``` | 500 | Internal server error |

---

### ✍️ Writings API

#### Get Paginated Writings

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/writings/get_page` | GET | Retrieve paginated list of writings |

| **Parameters** | **Type** | **Required** | **Description** |
|----------------|----------|--------------|-----------------|
| `page` | number | No | Page number (default: 1) |
| `pagesize` | number | No | Items per page (default: 10) |

| **Example Request** |
|---------------------|
| `GET /api/writings/get_page?page=1&pagesize=5` |

| **Example Response** | **Status Code** |
|----------------------|-----------------|
| ```json<br>{<br>  "results": [<br>    {<br>      "id": "abc123",<br>      "title": "My First Blog Post",<br>      "slug": "my-first-blog-post",<br>      "tags": ["technology", "web"],<br>      "lastUpdated": "2024-01-15T10:30:00Z",<br>      "createdAt": "2024-01-10T08:00:00Z"<br>    }<br>  ],<br>  "total": 25,<br>  "page": 1,<br>  "pageSize": 5,<br>  "totalPages": 5<br>}``` | 200 OK |

#### Get Writing by Slug

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/writings/:slug` | GET | Retrieve full writing content by slug |

| **Parameters** | **Type** | **Required** | **Description** |
|----------------|----------|--------------|-----------------|
| `slug` | string | Yes | URL-friendly identifier for the writing |

| **Example Request** |
|---------------------|
| `GET /api/writings/my-first-blog-post` |

| **Example Response** | **Status Code** |
|----------------------|-----------------|
| ```json<br>{<br>  "id": "abc123",<br>  "title": "My First Blog Post",<br>  "slug": "my-first-blog-post",<br>  "tags": ["technology", "web"],<br>  "content": "# My First Blog Post\n\nThis is the content...",<br>  "lastUpdated": "2024-01-15T10:30:00Z",<br>  "createdAt": "2024-01-10T08:00:00Z"<br>}``` | 200 OK |

#### Search Writing Contents

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/writings/search` | GET | Search through writing contents using Elasticsearch |

| **Parameters** | **Type** | **Required** | **Description** |
|----------------|----------|--------------|-----------------|
| `q` | string | Yes | Search query |
| `page` | number | No | Page number (default: 1) |
| `pagesize` | number | No | Items per page (default: 10) |

| **Example Request** |
|---------------------|
| `GET /api/writings/search?q=javascript&page=1&pagesize=5` |

| **Example Response** | **Status Code** |
|----------------------|-----------------|
| ```json<br>{<br>  "results": [<br>    {<br>      "id": "abc123",<br>      "title": "JavaScript Best Practices",<br>      "content": "...",<br>      "highlight": {<br>        "content": ["Learn <mark>JavaScript</mark> fundamentals"],<br>        "title": ["<mark>JavaScript</mark> Best Practices"]<br>      }<br>    }<br>  ],<br>  "total": 8,<br>  "page": 1,<br>  "pageSize": 5,<br>  "totalPages": 2<br>}``` | 200 OK |

#### Sync All Writings

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/writings/sync` | GET | Synchronize all writings from Notion |

| **Example Response** | **Status Code** |
|----------------------|-----------------|
| ```json<br>{<br>  "message": "All writings synced successfully"<br>}``` | 200 OK |

#### Sync Writing by Slug

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/writings/sync/:slug` | GET | Synchronize specific writing content and index to Elasticsearch |

| **Parameters** | **Type** | **Required** | **Description** |
|----------------|----------|--------------|-----------------|
| `slug` | string | Yes | URL-friendly identifier for the writing |

| **Example Response** | **Status Code** |
|----------------------|-----------------|
| ```json<br>{<br>  "message": "Writing content synced successfully"<br>}``` | 200 OK |

---

### 🐙 GitHub API

#### Get User Repositories

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/github/repositories` | GET | Retrieve all user repositories from database |

| **Example Response** | **Status Code** |
|----------------------|-----------------|
| ```json<br>{<br>  "count": 15,<br>  "repositories": [<br>    {<br>      "id": 123456,<br>      "name": "awesome-project",<br>      "description": "An awesome project built with React",<br>      "languages": {"JavaScript": 75, "CSS": 25},<br>      "stargazers_count": 42,<br>      "forks_count": 8,<br>      "topics": ["react", "frontend"],<br>      "created_at": "2024-01-01T00:00:00Z",<br>      "updated_at": "2024-01-15T12:00:00Z",<br>      "license": {"key": "mit", "name": "MIT License"},<br>      "html_url": "https://github.com/user/awesome-project",<br>      "readme": "# Awesome Project\n\nThis is awesome...",<br>      "cover_light_url": "https://raw.githubusercontent.com/.../light.png",<br>      "cover_dark_url": "https://raw.githubusercontent.com/.../dark.png",<br>      "icon_map": {"react": "https://cdn.jsdelivr.net/.../react.svg"}<br>    }<br>  ]<br>}``` | 200 OK |

#### Get Repository by Name

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/github/repositories/:name` | GET | Retrieve specific repository by name |

| **Parameters** | **Type** | **Required** | **Description** |
|----------------|----------|--------------|-----------------|
| `name` | string | Yes | Repository name |

| **Example Request** |
|---------------------|
| `GET /api/github/repositories/awesome-project` |

| **Example Response** | **Status Code** |
|----------------------|-----------------|
| ```json<br>{<br>  "id": 123456,<br>  "name": "awesome-project",<br>  "description": "An awesome project built with React",<br>  "languages": {"JavaScript": 75, "CSS": 25},<br>  "stargazers_count": 42,<br>  "forks_count": 8,<br>  "topics": ["react", "frontend"],<br>  "html_url": "https://github.com/user/awesome-project",<br>  "readme": "# Awesome Project..."<br>}``` | 200 OK |

| **Error Response** | **Status Code** |
|--------------------|-----------------|
| ```json<br>{<br>  "error": "Repository not found"<br>}``` | 404 |

#### Sync Repositories

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/github/repositories/sync` | GET | Synchronize repositories from GitHub API and index to Elasticsearch |

| **Example Response** | **Status Code** |
|----------------------|-----------------|
| ```json<br>{<br>  "message": "Repositories synced successfully"<br>}``` | 200 OK |

---

### 🔍 Search API

#### Universal Search

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/search` | GET | Search across all content types (writings and repositories) |

| **Parameters** | **Type** | **Required** | **Description** |
|----------------|----------|--------------|-----------------|
| `q` | string | Yes | Search query |
| `page` | number | No | Page number (default: 1) |
| `pagesize` | number | No | Items per page (default: 10) |

| **Example Request** |
|---------------------|
| `GET /api/search?q=react&page=1&pagesize=10` |

| **Example Response** | **Status Code** |
|----------------------|-----------------|
| ```json<br>{<br>  "results": [<br>    {<br>      "id": "abc123",<br>      "title": "React Best Practices",<br>      "content": "Learn React...",<br>      "_type": "writing",<br>      "highlight": {<br>        "title": ["<mark>React</mark> Best Practices"]<br>      }<br>    },<br>    {<br>      "id": 123456,<br>      "name": "react-components",<br>      "description": "Reusable React components",<br>      "_type": "repository",<br>      "highlight": {<br>        "name": ["<mark>react</mark>-components"]<br>      }<br>    }<br>  ],<br>  "total": 25,<br>  "page": 1,<br>  "pageSize": 10,<br>  "totalPages": 3,<br>  "breakdown": {<br>    "writings": {"count": 15, "total": 25},<br>    "repositories": {"count": 10, "total": 25}<br>  }<br>}``` | 200 OK |

#### Search Writings

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/search/writings` | GET | Search specifically within writings |

| **Parameters** | **Type** | **Required** | **Description** |
|----------------|----------|--------------|-----------------|
| `q` | string | Yes | Search query |
| `page` | number | No | Page number (default: 1) |
| `pagesize` | number | No | Items per page (default: 10) |

#### Search Repositories

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/search/repositories` | GET | Search specifically within repositories |

| **Parameters** | **Type** | **Required** | **Description** |
|----------------|----------|--------------|-----------------|
| `q` | string | Yes | Search query |
| `page` | number | No | Page number (default: 1) |
| `pagesize` | number | No | Items per page (default: 10) |

---

### 📄 PDF API

#### Generate CV PDF

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/pdf/generate-cv` | POST | Generate PDF from LaTeX content |

| **Request Body** | **Type** | **Required** | **Description** |
|------------------|----------|--------------|-----------------|
| `latexContent` | string | Yes | LaTeX source code |
| `filename` | string | No | Custom filename (default: "cv") |
| `type` | string | No | CV type filter |
| `mode` | string | No | Display mode |
| `theme` | string | No | Color theme |

| **Example Request** |
|---------------------|
| ```json<br>POST /api/pdf/generate-cv<br>Content-Type: application/json<br><br>{<br>  "latexContent": "\\documentclass{article}\\begin{document}Hello World\\end{document}",<br>  "filename": "my-cv",<br>  "type": "full",<br>  "mode": "system",<br>  "theme": "blue"<br>}``` |

| **Example Response** | **Status Code** |
|----------------------|-----------------|
| ```json<br>{<br>  "pdfUrl": "/api/pdf/view/my-cv-a1b2c3.pdf"<br>}``` | 200 OK |

| **Error Responses** | **Status Code** | **Description** |
|---------------------|-----------------|-----------------|
| ```json<br>{<br>  "error": "LaTeX content is required"<br>}``` | 400 | Missing required content |
| ```json<br>{<br>  "error": "LaTeX compilation failed. Please check your content."<br>}``` | 422 | LaTeX compilation error |

#### Serve PDF

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/pdf/view/:filename` | GET | Serve generated PDF file |

| **Parameters** | **Type** | **Required** | **Description** |
|----------------|----------|--------------|-----------------|
| `filename` | string | Yes | PDF filename with extension |

| **Example Request** |
|---------------------|
| `GET /api/pdf/view/my-cv-a1b2c3.pdf` |

| **Response** | **Status Code** | **Content-Type** |
|--------------|-----------------|------------------|
| Binary PDF data | 200 OK | application/pdf |

| **Error Response** | **Status Code** |
|--------------------|-----------------|
| ```json<br>{<br>  "error": "PDF not found"<br>}``` | 404 |

---

### ⚠️ Common Error Responses

| **Status Code** | **Description** | **Example Response** |
|-----------------|-----------------|----------------------|
| 400 | Bad Request | ```json<br>{<br>  "error": "Search query is required"<br>}``` |
| 404 | Not Found | ```json<br>{<br>  "error": "Resource not found"<br>}``` |
| 422 | Unprocessable Entity | ```json<br>{<br>  "error": "LaTeX compilation failed"<br>}``` |
| 500 | Internal Server Error | ```json<br>{<br>  "error": "Internal server error"<br>}``` |

**Frontend `.env`:**
```bash
VITE_EMAIL=your@email.com
VITE_INSTAGRAM=https://instagram.com/yourprofile
VITE_TWITTER=https://twitter.com/yourprofile
VITE_GITHUB=https://github.com/yourprofile
VITE_LINKEDIN=https://linkedin.com/in/yourprofile
```

## 📞 Contact

- **Website**: [aldenluth.fi](https://aldenluth.fi/)
- **Email**: [hi@aldenluth.fi](mailto:hi@aldenluth.fi)
- **LinkedIn**: [linkedin.com/in/aldenluthfi](https://linkedin.com/in/aldenluthfi)
- **GitHub**: [github.com/aldenluthfi](https://github.com/aldenluthfi)


## ⚖️ License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component library inspiration
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Notion](https://notion.so/) for content management
- [Elasticsearch](https://elastic.co/) for powerful search capabilities