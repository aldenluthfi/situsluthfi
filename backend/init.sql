CREATE TABLE IF NOT EXISTS writings (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(1024) NOT NULL,
  tags JSON,
  created_at DATETIME,
  last_updated DATETIME,
  last_synced DATETIME
);

CREATE TABLE IF NOT EXISTS facts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    source TEXT
);

CREATE TABLE IF NOT EXISTS writing_content (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(1024) NOT NULL,
    content TEXT NOT NULL,
    last_synced DATETIME
)
