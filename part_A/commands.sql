CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes INTEGER DEFAULT 0);

INSERT INTO blogs (author, url, title) values ('Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html', 'First class tests');

INSERT INTO blogs (author, url, title) values ('David Walsh', 'https://davidwalsh.name/', 'David Walsh Blog');