# 멋쟁이사자처럼 CRUD 게시판 실습

HTML, CSS, JavaScript만으로 만든 간단한 게시판 CRUD 예제입니다.

현재 버전은 MySQL에 연결되어 있지 않습니다.  
아기사자들이 CRUD 흐름을 먼저 이해한 뒤, 각자 로컬 컴퓨터에서 MySQL을 연결하는 실습용으로 사용합니다.

## 현재 예제 구조

```txt
lion_database
├── index.html
├── style.css
├── script.js
└── README.md
```

## 현재 동작 방식

현재 게시글 데이터는 `script.js` 안의 배열에만 저장됩니다.

```js
let posts = [
  {
    id: 1,
    title: "첫 번째 게시글입니다",
    author: "운영진",
    content: "CRUD 실습을 위한 예시 게시글입니다.",
    createdAt: "2026-04-28"
  }
];
```

따라서 새로고침하면 데이터가 초기 상태로 돌아갑니다.

이 상태는 의도된 것입니다.  
아직 데이터베이스 연결을 하지 않은 순수 프론트엔드 CRUD 예제입니다.

## 실행 방법

별도 설치 없이 `index.html` 파일을 브라우저로 열면 됩니다.

```txt
index.html 더블 클릭
```

또는 VS Code의 Live Server 확장을 사용해도 됩니다.

## CRUD 기능

현재 예제에서 확인할 수 있는 기능은 다음과 같습니다.

```txt
Create: 게시글 등록
Read: 게시글 목록 조회
Update: 게시글 수정
Delete: 게시글 삭제
```

`script.js`에는 CRUD 역할별 함수가 나누어져 있습니다.

```js
createPost()
readPosts()
updatePost()
deletePost()
```

나중에 MySQL을 연결할 때는 이 함수들의 내부 로직을 수정하면 됩니다.

## 로컬 MySQL 연결 실습 구조

MySQL을 연결할 때 브라우저에서 MySQL에 직접 접속하지 않습니다.

브라우저 JavaScript에 MySQL 아이디와 비밀번호를 넣으면 코드가 사용자에게 그대로 노출되기 때문입니다.

로컬 실습에서는 각자 컴퓨터에서 아래 구조로 실행합니다.

```txt
브라우저
index.html / style.css / script.js
        |
        | fetch()
        v
로컬 백엔드 서버
http://localhost:3000
        |
        | MySQL 접속
        v
로컬 MySQL
```

즉, 각자 컴퓨터에서 프론트엔드, 백엔드 서버, MySQL을 모두 실행합니다.

## MySQL 테이블 예시

MySQL에서 데이터베이스와 테이블을 만들 때는 아래 SQL을 사용할 수 있습니다.

```sql
CREATE DATABASE lion_board;

USE lion_board;

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## CRUD와 SQL 매칭

게시판 CRUD는 SQL과 이렇게 연결됩니다.

```sql
-- Create: 게시글 등록
INSERT INTO posts (title, author, content)
VALUES (?, ?, ?);

-- Read: 게시글 목록 조회
SELECT * FROM posts
ORDER BY id DESC;

-- Update: 게시글 수정
UPDATE posts
SET title = ?, author = ?, content = ?
WHERE id = ?;

-- Delete: 게시글 삭제
DELETE FROM posts
WHERE id = ?;
```

## 백엔드 API 예시

나중에 백엔드 서버를 만들면 프론트엔드는 아래 API로 요청을 보내게 됩니다.

```txt
GET    /posts      게시글 목록 조회
POST   /posts      게시글 등록
PUT    /posts/:id  게시글 수정
DELETE /posts/:id  게시글 삭제
```

## 프론트엔드 수정 방향

현재 `script.js`의 `readPosts()` 함수는 배열을 그대로 반환합니다.

```js
function readPosts() {
  return posts;
}
```

MySQL을 연결한 뒤에는 백엔드 서버에 요청하는 방식으로 바꿀 수 있습니다.

```js
async function readPosts() {
  const response = await fetch("http://localhost:3000/posts");
  const posts = await response.json();
  return posts;
}
```

`createPost()`, `updatePost()`, `deletePost()`도 같은 방식으로 `fetch()` 요청으로 바꾸면 됩니다.

## 실습 순서 추천

1. 현재 게시판에서 CRUD 흐름 확인
2. MySQL 설치 및 실행
3. `lion_board` 데이터베이스 생성
4. `posts` 테이블 생성
5. 로컬 백엔드 서버 생성
6. 백엔드에서 MySQL 연결
7. 프론트엔드 `script.js`의 CRUD 함수들을 `fetch()`로 수정

## 주의사항

프론트엔드 코드에 MySQL 비밀번호를 직접 작성하지 않습니다.

```js
// 이렇게 작성하면 안 됩니다.
const password = "mysql-password";
```

MySQL 접속 정보는 백엔드 서버에서만 사용합니다.

