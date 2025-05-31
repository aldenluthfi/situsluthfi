CREATE TABLE IF NOT EXISTS writings (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(1024) NOT NULL,
  slug VARCHAR(1024) NOT NULL,
  tags JSON,
  created_at DATETIME,
  last_updated DATETIME
);

CREATE TABLE IF NOT EXISTS facts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    source TEXT
);

CREATE TABLE IF NOT EXISTS writing_content (
    id VARCHAR(255) PRIMARY KEY,
    content MEDIUMTEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS repositories (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    languages JSON,
    stargazers_count INT DEFAULT 0,
    forks_count INT DEFAULT 0,
    topics JSON,
    created_at DATETIME,
    updated_at DATETIME,
    license JSON,
    html_url VARCHAR(255),
    readme MEDIUMTEXT,
    cover_light_url VARCHAR(500),
    cover_dark_url VARCHAR(500)
);
