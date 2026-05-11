// 1. Supabase 라이브러리 불러오기 (html 파일에 type="module" 필수!)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2. 내 프로젝트 연결 열쇠 세팅
const supabaseUrl = 'https://hhtmeyptxswrwqvsuabo.supabase.co';
const supabaseKey = '방금_복사한_sb_publishable_로_시작하는_긴_키를_여기에_붙여넣으세요';

// 3. Supabase 연결 완료! 이제 이 supabase 변수로 모든 걸 할 수 있습니다.
export const supabase = createClient(supabaseUrl, supabaseKey);


const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

app.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000')
})

// 게시글 CRUD API
app.get('/posts', (req, res) => {
  db.query('SELECT * FROM posts ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error('게시글 목록 조회 실패:', err.message)
      return res.status(500).json({ message: '게시글 목록 조회 실패' })
    }

    res.json(results)
  })
})

app.get('/posts', (req, res) => {
  db.query('SELECT * FROM posts ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error('게시글 목록 조회 실패:', err.message)
      return res.status(500).json({ message: '게시글 목록 조회 실패' })
    }

    res.json(results)
  })
})

app.post('/posts', (req, res) => {
  const { title, author, content } = req.body

  db.query(
    'INSERT INTO posts (title, author, content) VALUES (?, ?, ?)',
    [title, author, content],
    (err) => {
      if (err) {
        console.error('게시글 등록 실패:', err.message)
        return res.status(500).json({ message: '게시글 등록 실패' })
      }

      res.send('게시글 등록 완료')
    },
  )
})
