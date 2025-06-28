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

**Frontend `.env`:**
```bash
VITE_EMAIL=your@email.com
VITE_INSTAGRAM=https://instagram.com/yourprofile
VITE_TWITTER=https://twitter.com/yourprofile
VITE_GITHUB=https://github.com/yourprofile
VITE_LINKEDIN=https://linkedin.com/in/yourprofile
```

## 📚 API Documentation

The backend API provides comprehensive endpoints for managing content, search functionality, and data synchronization. All endpoints return JSON responses and follow RESTful conventions.

**Base URL:** `http://host:3000/api`

### 🎲 Facts API

#### Get Random Fact

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/facts</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Retrieve a random fact from the database</td></tr>
<tr><td><strong>Parameters</strong></td><td>None</td></tr>
<tr><td><strong>Example Request</strong></td><td><code>GET /api/facts</code></td></tr>
<tr><td rowspan="2"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "id": 1,
  "text": "Honey never spoils",
  "source": "National Geographic"
}</code></pre></td></tr>
<tr><td><strong>Status: 500 Internal Server Error</strong><br><pre><code>{
  "error": "Failed to fetch facts"
}</code></pre></td></tr>
</table>

---

### ✍️ Writings API

#### Get Paginated Writings

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/writings/get_page</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Retrieve paginated list of writings</td></tr>
<tr><td rowspan="2"><strong>Parameters</strong></td><td><code>page</code> (number, optional): Page number (default: 1)</td></tr>
<tr><td><code>pagesize</code> (number, optional): Items per page (default: 10)</td></tr>
<tr><td><strong>Example Request</strong></td><td><code>GET /api/writings/get_page?page=1&pagesize=5</code></td></tr>
<tr><td rowspan="2"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "results": [
    {
      "id": "abc123",
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "tags": ["technology", "web"],
      "lastUpdated": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-10T08:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "pageSize": 5,
  "totalPages": 5
}</code></pre></td></tr>
<tr><td><strong>Status: 500 Internal Server Error</strong><br><pre><code>{
  "error": "Failed to retrieve paginated writings"
}</code></pre></td></tr>
</table>

#### Get Writing by Slug

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/writings/:slug</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Retrieve full writing content by slug</td></tr>
<tr><td><strong>Parameters</strong></td><td><code>slug</code> (string, required): URL-friendly identifier for the writing</td></tr>
<tr><td><strong>Example Request</strong></td><td><code>GET /api/writings/my-first-blog-post</code></td></tr>
<tr><td rowspan="2"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "id": "abc123",
  "title": "My First Blog Post",
  "slug": "my-first-blog-post",
  "tags": ["technology", "web"],
  "content": "# My First Blog Post\n\nThis is the content...",
  "lastUpdated": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-10T08:00:00Z"
}</code></pre></td></tr>
<tr><td><strong>Status: 500 Internal Server Error</strong><br><pre><code>{
  "error": "Failed to retrieve writing"
}</code></pre></td></tr>
</table>

#### Search Writing Contents

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/writings/search</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Search through writing contents using Elasticsearch</td></tr>
<tr><td rowspan="3"><strong>Parameters</strong></td><td><code>q</code> (string, required): Search query</td></tr>
<tr><td><code>page</code> (number, optional): Page number (default: 1)</td></tr>
<tr><td><code>pagesize</code> (number, optional): Items per page (default: 10)</td></tr>
<tr><td><strong>Example Request</strong></td><td><code>GET /api/writings/search?q=javascript&page=1&pagesize=5</code></td></tr>
<tr><td rowspan="2"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "results": [
    {
      "id": "abc123",
      "title": "JavaScript Best Practices",
      "content": "...",
      "highlight": {
        "content": ["Learn <mark>JavaScript</mark> fundamentals"],
        "title": ["<mark>JavaScript</mark> Best Practices"]
      }
    }
  ],
  "total": {
    "value": 8,
    "relation": "eq"
  },
  "page": 1,
  "pageSize": 5,
  "totalPages": 2
}</code></pre></td></tr>
<tr><td><strong>Status: 400 Bad Request</strong><br><pre><code>{
  "error": "Missing search query"
}</code></pre></td></tr>
</table>

#### Sync All Writings

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/writings/sync</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Synchronize all writings from Notion</td></tr>
<tr><td><strong>Parameters</strong></td><td>None</td></tr>
<tr><td rowspan="2"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "message": "All writings synced successfully"
}</code></pre></td></tr>
<tr><td><strong>Status: 500 Internal Server Error</strong><br><pre><code>{
  "error": "Failed to sync all writings"
}</code></pre></td></tr>
</table>

#### Sync Writing by Slug

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/writings/sync/:slug</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Synchronize specific writing content and index to Elasticsearch</td></tr>
<tr><td><strong>Parameters</strong></td><td><code>slug</code> (string, required): URL-friendly identifier for the writing</td></tr>
<tr><td rowspan="2"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "message": "Writing content synced successfully"
}</code></pre></td></tr>
<tr><td><strong>Status: 500 Internal Server Error</strong><br><pre><code>{
  "error": "Failed to sync writing content"
}</code></pre></td></tr>
</table>

---

### 🐙 GitHub API

#### Get User Repositories

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/github/repositories</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Retrieve all user repositories from database</td></tr>
<tr><td><strong>Parameters</strong></td><td>None</td></tr>
<tr><td rowspan="2"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "count": 15,
  "repositories": [
    {
      "id": 123456,
      "name": "awesome-project",
      "description": "An awesome project built with React",
      "languages": {"JavaScript": 75, "CSS": 25},
      "stargazers_count": 42,
      "forks_count": 8,
      "topics": ["react", "frontend"],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T12:00:00Z",
      "license": {"key": "mit", "name": "MIT License", "url": "https://...", "node_id": "...", "spdx_id": "MIT"},
      "html_url": "https://github.com/user/awesome-project",
      "readme": "# Awesome Project\n\nThis is awesome...",
      "cover_light_url": "https://raw.githubusercontent.com/.../light.png",
      "cover_dark_url": "https://raw.githubusercontent.com/.../dark.png",
      "icon_map": {"react": "https://cdn.jsdelivr.net/.../react.svg"}
    }
  ]
}</code></pre></td></tr>
<tr><td><strong>Status: 500 Internal Server Error</strong><br><pre><code>{
  "error": "Failed to fetch repositories"
}</code></pre></td></tr>
</table>

#### Get Repository by Name

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/github/repositories/:name</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Retrieve specific repository by name</td></tr>
<tr><td><strong>Parameters</strong></td><td><code>name</code> (string, required): Repository name</td></tr>
<tr><td><strong>Example Request</strong></td><td><code>GET /api/github/repositories/awesome-project</code></td></tr>
<tr><td rowspan="3"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "id": 123456,
  "name": "awesome-project",
  "description": "An awesome project built with React",
  "languages": {"JavaScript": 75, "CSS": 25},
  "stargazers_count": 42,
  "forks_count": 8,
  "topics": ["react", "frontend"],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-15T12:00:00Z",
  "license": {"key": "mit", "name": "MIT License", "url": "https://...", "node_id": "...", "spdx_id": "MIT"},
  "html_url": "https://github.com/user/awesome-project",
  "readme": "# Awesome Project..."
}</code></pre></td></tr>
<tr><td><strong>Status: 404 Not Found</strong><br><pre><code>{
  "error": "Repository not found"
}</code></pre></td></tr>
<tr><td><strong>Status: 500 Internal Server Error</strong><br><pre><code>{
  "error": "Failed to fetch repository"
}</code></pre></td></tr>
</table>

#### Sync Repositories

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/github/repositories/sync</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Synchronize repositories from GitHub API and index to Elasticsearch</td></tr>
<tr><td><strong>Parameters</strong></td><td>None</td></tr>
<tr><td rowspan="2"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "message": "Repositories synced successfully"
}</code></pre></td></tr>
<tr><td><strong>Status: 500 Internal Server Error</strong><br><pre><code>{
  "error": "Failed to sync repositories"
}</code></pre></td></tr>
</table>

---

### 🔍 Search API

#### Universal Search

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/search</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Search across all content types (writings and repositories)</td></tr>
<tr><td rowspan="3"><strong>Parameters</strong></td><td><code>q</code> (string, required): Search query</td></tr>
<tr><td><code>page</code> (number, optional): Page number (default: 1)</td></tr>
<tr><td><code>pagesize</code> (number, optional): Items per page (default: 10)</td></tr>
<tr><td><strong>Example Request</strong></td><td><code>GET /api/search?q=react&page=1&pagesize=10</code></td></tr>
<tr><td rowspan="3"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "results": [
    {
      "id": "abc123",
      "title": "React Best Practices",
      "content": "Learn React...",
      "_type": "writing",
      "highlight": {
        "title": ["<mark>React</mark> Best Practices"]
      }
    },
    {
      "id": 123456,
      "name": "react-components",
      "description": "Reusable React components",
      "_type": "repository",
      "highlight": {
        "name": ["<mark>react</mark>-components"]
      }
    }
  ],
  "total": {
    "value": 25,
    "relation": "eq"
  },
  "page": 1,
  "pageSize": 10,
  "totalPages": 3,
  "breakdown": {
    "writings": {"count": 15, "total": 25},
    "repositories": {"count": 10, "total": 25}
  }
}</code></pre></td></tr>
<tr><td><strong>Status: 400 Bad Request</strong><br><pre><code>{
  "error": "Search query is required"
}</code></pre></td></tr>
<tr><td><strong>Status: 500 Internal Server Error</strong><br><pre><code>{
  "error": "Failed to perform search"
}</code></pre></td></tr>
</table>

#### Search Writings

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/search/writings</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Search specifically within writings</td></tr>
<tr><td rowspan="3"><strong>Parameters</strong></td><td><code>q</code> (string, required): Search query</td></tr>
<tr><td><code>page</code> (number, optional): Page number (default: 1)</td></tr>
<tr><td><code>pagesize</code> (number, optional): Items per page (default: 10)</td></tr>
<tr><td><strong>Example Request</strong></td><td><code>GET /api/search/writings?q=javascript&page=1&pagesize=5</code></td></tr>
<tr><td rowspan="3"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "results": [
    {
      "id": "abc123",
      "title": "JavaScript Best Practices",
      "content": "...",
      "highlight": {
        "content": ["Learn <mark>JavaScript</mark> fundamentals"]
      }
    }
  ],
  "total": {
    "value": 8,
    "relation": "eq"
  },
  "page": 1,
  "pageSize": 5,
  "totalPages": 2
}</code></pre></td></tr>
<tr><td><strong>Status: 400 Bad Request</strong><br><pre><code>{
  "error": "Search query is required"
}</code></pre></td></tr>
<tr><td><strong>Status: 500 Internal Server Error</strong><br><pre><code>{
  "error": "Failed to search writings"
}</code></pre></td></tr>
</table>

#### Search Repositories

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/search/repositories</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Search specifically within repositories</td></tr>
<tr><td rowspan="3"><strong>Parameters</strong></td><td><code>q</code> (string, required): Search query</td></tr>
<tr><td><code>page</code> (number, optional): Page number (default: 1)</td></tr>
<tr><td><code>pagesize</code> (number, optional): Items per page (default: 10)</td></tr>
<tr><td><strong>Example Request</strong></td><td><code>GET /api/search/repositories?q=react&page=1&pagesize=5</code></td></tr>
<tr><td rowspan="3"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "results": [
    {
      "id": 123456,
      "name": "react-components",
      "description": "Reusable React components",
      "highlight": {
        "name": ["<mark>react</mark>-components"]
      }
    }
  ],
  "total": {
    "value": 5,
    "relation": "eq"
  },
  "page": 1,
  "pageSize": 5,
  "totalPages": 1
}</code></pre></td></tr>
<tr><td><strong>Status: 400 Bad Request</strong><br><pre><code>{
  "error": "Search query is required"
}</code></pre></td></tr>
<tr><td><strong>Status: 500 Internal Server Error</strong><br><pre><code>{
  "error": "Failed to search repositories"
}</code></pre></td></tr>
</table>

---

### 📄 PDF API

#### Generate CV PDF

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/pdf/generate-cv</code></td></tr>
<tr><td><strong>Method</strong></td><td>POST</td></tr>
<tr><td><strong>Description</strong></td><td>Generate PDF from LaTeX content</td></tr>
<tr><td rowspan="5"><strong>Request Body</strong></td><td><code>latexContent</code> (string, required): LaTeX source code</td></tr>
<tr><td><code>filename</code> (string, optional): Custom filename (default: "cv")</td></tr>
<tr><td><code>type</code> (string, optional): CV type filter</td></tr>
<tr><td><code>mode</code> (string, optional): Display mode</td></tr>
<tr><td><code>theme</code> (string, optional): Color theme</td></tr>
<tr><td><strong>Example Request</strong></td><td><pre><code>POST /api/pdf/generate-cv
Content-Type: application/json

{
    "latexContent": "\\documentclass{article} [...]",
    "filename": "my-cv",
    "type": "full",
    "mode": "system",
    "theme": "blue"
}</code></pre></td></tr>
<tr><td rowspan="3"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>{
  "pdfUrl": "/api/pdf/view/my-cv-a1b2c3.pdf"
}</code></pre></td></tr>
<tr><td><strong>Status: 400 Bad Request</strong><br><pre><code>{
  "error": "LaTeX content is required"
}</code></pre></td></tr>
<tr><td><strong>Status: 422 Unprocessable Entity</strong><br><pre><code>{
  "error": "LaTeX compilation failed. Please check your content."
}</code></pre></td></tr>
</table>

#### Serve PDF

<table>
<tr><td><strong>Endpoint</strong></td><td><code>/pdf/view/:filename</code></td></tr>
<tr><td><strong>Method</strong></td><td>GET</td></tr>
<tr><td><strong>Description</strong></td><td>Serve generated PDF file</td></tr>
<tr><td><strong>Parameters</strong></td><td><code>filename</code> (string, required): PDF filename with extension</td></tr>
<tr><td><strong>Headers</strong></td><td><code>Content-Type: application/pdf</code><br><code>Content-Disposition: inline; filename="original-filename.pdf"</code><br><code>Content-Length: [buffer-length]</code></td></tr>
<tr><td><strong>Example Request</strong></td><td><code>GET /api/pdf/view/my-cv-a1b2c3.pdf</code></td></tr>
<tr><td rowspan="2"><strong>Example Responses</strong></td><td><strong>Status: 200 OK</strong><br><pre><code>Content-Type: application/pdf
Content-Disposition: inline; filename="my-cv.pdf"
Content-Length: 50432

[Binary PDF data]</code></pre></td></tr>
<tr><td><strong>Status: 404 Not Found</strong><br><pre><code>{
  "error": "PDF not found"
}</code></pre></td></tr>
</table>

## 📞 Contact

Feel free to reach out if you:

- Have questions about the project or implementation
- Want to collaborate on similar web development projects
- Need help with the technologies used in this portfolio
- Are interested in discussing potential opportunities

You can contact me via **Email**, [hi@aldenluth.fi](mailto:hi@aldenluth.fi)

## ⚖️ License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component library inspiration
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Notion](https://notion.so/) for content management
- [Elasticsearch](https://elastic.co/) for powerful search capabilities