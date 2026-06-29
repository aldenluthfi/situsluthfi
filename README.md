<picture>
  <source media="(prefers-color-scheme: light)" srcset="/.github/meta/dark.png">
  <source media="(prefers-color-scheme: dark)" srcset="/.github/meta/light.png">
  <img>
</picture>

<pre>
[ ABOUT ]

A modern, full-stack personal portfolio website featuring a minimalistic
design, powerful search capabilities, and comprehensive content
management. Built with React, Express.js, and powered by Elasticsearch.

Live Website  --> <a href="https://aldenluth.fi/">aldenluth.fi</a>

[ FEATURES ]

Frontend:
  - Responsive Design: mobile-first approach with tablet and desktop
    optimizations
  - Dark/Light Theme: automatic timezone-based theme switching with
    manual override
  - Color Themes: 18 different color schemes to choose from
  - Interactive Maps: SVG-based world map for travel gallery
  - Custom Animations: smooth transitions and micro-interactions
  - Accessibility: full keyboard navigation and screen reader support
  - Progressive Web App: offline capabilities and fast loading

Search Engine:
  - Elasticsearch Integration: full-text search across all content
  - Smart Suggestions: auto-complete with fuzzy matching
  - Multi-content Search: search through writings, projects, and more
  - Real-time Results: instant search with debounced queries

Content Management:
  - Notion Integration: automatic syncing of blog posts from Notion
  - Markdown Support: full markdown rendering with custom components
  - Syntax Highlighting: code blocks with multiple language support
  - Math Rendering: LaTeX support with KaTeX
  - Table of Contents: auto-generated with smooth scrolling

Projects Showcase:
  - GitHub Integration: automatic repository syncing
  - Image Galleries: project screenshots with zoom functionality
  - Technology Tags: visual representation of tech stacks
  - Live Demos: direct links to deployed projects

Additional Features:
  - CV Generation: dynamic resume/CV with filtering
  - Gallery System: photo galleries organized by location
  - Contact Forms: integrated communication system
  - Analytics Ready: easy integration with analytics platforms
  - Timezone Theming: automatic theme switching based on my timezone
    (Asia/Jakarta)

[ TECH STACK ]

Frontend:
  React 19         --> UI library with latest features
  TypeScript       --> Type-safe development
  Vite             --> Fast build tool and dev server
  Tailwind CSS     --> Utility-first styling
  Framer Motion    --> Smooth animations
  Radix UI         --> Accessible component primitives
  React Router     --> Client-side routing

Backend:
  Node.js          --> JavaScript runtime
  Express.js       --> Web application framework
  TypeScript       --> Type-safe server development
  MySQL            --> Relational database
  Elasticsearch    --> Search engine
  Notion API       --> Content management integration
  GitHub API       --> Repository data fetching

DevOps & Deployment:
  Docker           --> Containerization
  Kubernetes       --> Container orchestration
  Kind             --> Local Kubernetes development
  GitHub Actions   --> CI/CD pipeline
  ESLint           --> Code linting
  Husky            --> Git hooks

[ QUICK START ]

Prerequisites:
  - Node.js 18+ and npm
  - Docker and Docker Compose
  - Kind (for Kubernetes deployment)
  - Git

Development setup:

  1. Clone the repository

       git clone https://github.com/aldenluthfi/situsluthfi.git
       cd situsluthfi

  2. Install dependencies

       # Install root dependencies
       npm install

       # Install frontend dependencies
       cd frontend && npm install && cd ..

       # Install backend dependencies
       cd backend && npm install && cd ..

  3. Set up environment variables

       # Copy environment templates
       cp .env.example .env
       cp frontend/.env.example frontend/.env
       cp backend/.env.example backend/.env

       # Edit the .env files with your configuration

  4. Start development servers

       Option A: Using Docker Compose (Recommended)

           docker-compose up -d

       Option B: Manual setup

           # Start MySQL and Elasticsearch (using Docker)
           docker run -d --name mysql -p 3306:3306 \
               -e MYSQL_ROOT_PASSWORD=yourpassword mysql:8.0
           docker run -d --name elasticsearch -p 9200:9200 \
               -e "discovery.type=single-node" elasticsearch:9.0.1

           # Start backend
           cd backend && npm run dev &

           # Start frontend
           cd frontend && npm run dev

  5. Access the application

       Option A: Using Docker Compose (Recommended)
           Frontend: http://localhost:8080

       Option B: Manual setup
           Frontend: http://localhost:5173
           Backend:  http://localhost:3000

Production deployment:

    Using Kubernetes with Kind:
        ./deploy.sh

    Using Docker Compose:
        docker-compose up -d

[ PROJECT STRUCTURE ]

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

[ CONFIGURATION ]

Root .env:

    MYSQL_USER=your_mysql_user
    MYSQL_PASSWORD=your_mysql_password
    MYSQL_ROOT_PASSWORD=your_root_password
    MYSQL_DATABASE=your_database_name

Backend .env:

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

Frontend .env:

    VITE_EMAIL=your@email.com
    VITE_INSTAGRAM=https://instagram.com/yourprofile
    VITE_TWITTER=https://twitter.com/yourprofile
    VITE_GITHUB=https://github.com/yourprofile
    VITE_LINKEDIN=https://linkedin.com/in/yourprofile

[ API DOCUMENTATION ]

The backend API provides comprehensive endpoints for managing content,
search functionality, and data synchronization. All endpoints return
JSON responses and follow RESTful conventions.

Base URL  --> http://host:3000/api

══════════════════════════════════════════════════════════════════════
 FACTS API
══════════════════════════════════════════════════════════════════════

  ▸ Get Random Fact

    Endpoint     --> GET /facts
    Description  --> Retrieve a random fact from the database
    Parameters   --> None
    Example      --> GET /api/facts

    Response (200 OK):
        {
          "id": 1,
          "text": "Honey never spoils",
          "source": "National Geographic"
        }

    Response (500 Internal Server Error):
        {
          "error": "Failed to fetch facts"
        }

══════════════════════════════════════════════════════════════════════
 WRITINGS API
══════════════════════════════════════════════════════════════════════

  ▸ Get Paginated Writings

    Endpoint     --> GET /writings/get_page
    Description  --> Retrieve paginated list of writings
    Parameters   --> page     (number, optional): Page number (default: 1)
                     pagesize (number, optional): Items per page (default: 10)
    Example      --> GET /api/writings/get_page?page=1&amp;pagesize=5

    Response (200 OK):
        {
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
        }

    Response (500 Internal Server Error):
        {
          "error": "Failed to retrieve paginated writings"
        }

  ▸ Get Writing by Slug

    Endpoint     --> GET /writings/:slug
    Description  --> Retrieve full writing content by slug
    Parameters   --> slug (string, required): URL-friendly identifier
                     for the writing
    Example      --> GET /api/writings/my-first-blog-post

    Response (200 OK):
        {
          "id": "abc123",
          "title": "My First Blog Post",
          "slug": "my-first-blog-post",
          "tags": ["technology", "web"],
          "content": "# My First Blog Post\n\nThis is the content...",
          "lastUpdated": "2024-01-15T10:30:00Z",
          "createdAt": "2024-01-10T08:00:00Z"
        }

    Response (500 Internal Server Error):
        {
          "error": "Failed to retrieve writing"
        }

  ▸ Search Writing Contents

    Endpoint     --> GET /writings/search
    Description  --> Search through writing contents using Elasticsearch
    Parameters   --> q        (string, required): Search query
                     page     (number, optional): Page number (default: 1)
                     pagesize (number, optional): Items per page (default: 10)
    Example      --> GET /api/writings/search?q=javascript&amp;page=1&amp;pagesize=5

    Response (200 OK):
        {
          "results": [
            {
              "id": "abc123",
              "title": "JavaScript Best Practices",
              "content": "...",
              "highlight": {
                "content": ["Learn &lt;mark&gt;JavaScript&lt;/mark&gt; fundamentals"],
                "title": ["&lt;mark&gt;JavaScript&lt;/mark&gt; Best Practices"]
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
        }

    Response (400 Bad Request):
        {
          "error": "Missing search query"
        }

  ▸ Sync All Writings

    Endpoint     --> GET /writings/sync
    Description  --> Synchronize all writings from Notion
    Parameters   --> None

    Response (200 OK):
        {
          "message": "All writings synced successfully"
        }

    Response (500 Internal Server Error):
        {
          "error": "Failed to sync all writings"
        }

  ▸ Sync Writing by Slug

    Endpoint     --> GET /writings/sync/:slug
    Description  --> Synchronize specific writing content and index to
                     Elasticsearch
    Parameters   --> slug (string, required): URL-friendly identifier
                     for the writing

    Response (200 OK):
        {
          "message": "Writing content synced successfully"
        }

    Response (500 Internal Server Error):
        {
          "error": "Failed to sync writing content"
        }

══════════════════════════════════════════════════════════════════════
 GITHUB API
══════════════════════════════════════════════════════════════════════

  ▸ Get User Repositories

    Endpoint     --> GET /github/repositories
    Description  --> Retrieve all user repositories from database
    Parameters   --> None

    Response (200 OK):
        {
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
        }

    Response (500 Internal Server Error):
        {
          "error": "Failed to fetch repositories"
        }

  ▸ Get Repository by Name

    Endpoint     --> GET /github/repositories/:name
    Description  --> Retrieve specific repository by name
    Parameters   --> name (string, required): Repository name
    Example      --> GET /api/github/repositories/awesome-project

    Response (200 OK):
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
          "readme": "# Awesome Project..."
        }

    Response (404 Not Found):
        {
          "error": "Repository not found"
        }

    Response (500 Internal Server Error):
        {
          "error": "Failed to fetch repository"
        }

  ▸ Sync Repositories

    Endpoint     --> GET /github/repositories/sync
    Description  --> Synchronize repositories from GitHub API and index
                     to Elasticsearch
    Parameters   --> None

    Response (200 OK):
        {
          "message": "Repositories synced successfully"
        }

    Response (500 Internal Server Error):
        {
          "error": "Failed to sync repositories"
        }

══════════════════════════════════════════════════════════════════════
 SEARCH API
══════════════════════════════════════════════════════════════════════

  ▸ Universal Search

    Endpoint     --> GET /search
    Description  --> Search across all content types (writings and
                     repositories)
    Parameters   --> q        (string, required): Search query
                     page     (number, optional): Page number (default: 1)
                     pagesize (number, optional): Items per page (default: 10)
    Example      --> GET /api/search?q=react&amp;page=1&amp;pagesize=10

    Response (200 OK):
        {
          "results": [
            {
              "id": "abc123",
              "title": "React Best Practices",
              "content": "Learn React...",
              "_type": "writing",
              "highlight": {
                "title": ["&lt;mark&gt;React&lt;/mark&gt; Best Practices"]
              }
            },
            {
              "id": 123456,
              "name": "react-components",
              "description": "Reusable React components",
              "_type": "repository",
              "highlight": {
                "name": ["&lt;mark&gt;react&lt;/mark&gt;-components"]
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
        }

    Response (400 Bad Request):
        {
          "error": "Search query is required"
        }

    Response (500 Internal Server Error):
        {
          "error": "Failed to perform search"
        }

  ▸ Search Writings

    Endpoint     --> GET /search/writings
    Description  --> Search specifically within writings
    Parameters   --> q        (string, required): Search query
                     page     (number, optional): Page number (default: 1)
                     pagesize (number, optional): Items per page (default: 10)
    Example      --> GET /api/search/writings?q=javascript&amp;page=1&amp;pagesize=5

    Response (200 OK):
        {
          "results": [
            {
              "id": "abc123",
              "title": "JavaScript Best Practices",
              "content": "...",
              "highlight": {
                "content": ["Learn &lt;mark&gt;JavaScript&lt;/mark&gt; fundamentals"]
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
        }

    Response (400 Bad Request):
        {
          "error": "Search query is required"
        }

    Response (500 Internal Server Error):
        {
          "error": "Failed to search writings"
        }

  ▸ Search Repositories

    Endpoint     --> GET /search/repositories
    Description  --> Search specifically within repositories
    Parameters   --> q        (string, required): Search query
                     page     (number, optional): Page number (default: 1)
                     pagesize (number, optional): Items per page (default: 10)
    Example      --> GET /api/search/repositories?q=react&amp;page=1&amp;pagesize=5

    Response (200 OK):
        {
          "results": [
            {
              "id": 123456,
              "name": "react-components",
              "description": "Reusable React components",
              "highlight": {
                "name": ["&lt;mark&gt;react&lt;/mark&gt;-components"]
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
        }

    Response (400 Bad Request):
        {
          "error": "Search query is required"
        }

    Response (500 Internal Server Error):
        {
          "error": "Failed to search repositories"
        }

══════════════════════════════════════════════════════════════════════
 PDF API
══════════════════════════════════════════════════════════════════════

  ▸ Generate CV PDF

    Endpoint     --> POST /pdf/generate-cv
    Description  --> Generate PDF from LaTeX content
    Request Body --> latexContent (string, required): LaTeX source code
                     filename (string, optional): Custom filename
                       (default: "cv")
                     type  (string, optional): CV type filter
                     mode  (string, optional): Display mode
                     theme (string, optional): Color theme

    Example Request:
        POST /api/pdf/generate-cv
        Content-Type: application/json

        {
            "latexContent": "\\documentclass{article} [...]",
            "filename": "my-cv",
            "type": "full",
            "mode": "system",
            "theme": "blue"
        }

    Response (200 OK):
        {
          "pdfUrl": "/api/pdf/view/my-cv-a1b2c3.pdf"
        }

    Response (400 Bad Request):
        {
          "error": "LaTeX content is required"
        }

    Response (422 Unprocessable Entity):
        {
          "error": "LaTeX compilation failed. Please check your content."
        }

  ▸ Serve PDF

    Endpoint     --> GET /pdf/view/:filename
    Description  --> Serve generated PDF file
    Parameters   --> filename (string, required): PDF filename with
                     extension
    Headers      --> Content-Type: application/pdf
                     Content-Disposition: inline; filename="original-filename.pdf"
                     Content-Length: [buffer-length]
    Example      --> GET /api/pdf/view/my-cv-a1b2c3.pdf

    Response (200 OK):
        Content-Type: application/pdf
        Content-Disposition: inline; filename="my-cv.pdf"
        Content-Length: 50432

        [Binary PDF data]

    Response (404 Not Found):
        {
          "error": "PDF not found"
        }

[ CONTACT ]

Feel free to reach out if you:
- Have questions about the project or implementation
- Want to collaborate on similar web development projects
- Need help with the technologies used in this portfolio
- Are interested in discussing potential opportunities

You can contact me via Email, <a href="mailto:hi@aldenluth.fi">hi@aldenluth.fi</a>

[ LICENSE ]

This repository is licensed under the <a href="LICENSE">GNU General Public License v3.0</a>.

With this license, you are allowed to:
- Use, copy, modify, and distribute the software
- Create derivative works and commercial applications
- Include the software in larger projects
- Access and study the source code

However, you must:
- Keep the same GPL v3.0 license for any derivative works
- Provide source code for any distributed modifications
- Include copyright and license notices
- Document any changes made to the original code

[ ACKNOWLEDGMENTS ]

<a href="https://ui.shadcn.com/">shadcn/ui</a>        --> for the component library inspiration
<a href="https://tailwindcss.com/">Tailwind CSS</a>     --> for the utility-first CSS framework
<a href="https://notion.so/">Notion</a>           --> for content management
<a href="https://elastic.co/">Elasticsearch</a>    --> for powerful search capabilities
</pre>
