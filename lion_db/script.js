// 1. Supabase 라이브러리 불러오기 및 연결 세팅
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://hhtmeyptxswrwqvsuabo.supabase.co';
// ✨ 아래 빈칸에 아까 복사한 sb_publishable_... 키를 꼭 넣어주세요!
const supabaseKey = 'sb_publishable_8SD4rHvAVL2Zlhdl8KNUyg_jo6V6q14';
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. DOM 요소 선택 (인증 관련)
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const loginBtn = document.querySelector("#login-btn");
const signupBtn = document.querySelector("#signup-btn");
const logoutBtn = document.querySelector("#logout-btn");
const userInfo = document.querySelector("#user-info");

// 3. DOM 요소 선택 (게시판 관련)
const postForm = document.querySelector("#post-form");
const postIdInput = document.querySelector("#post-id");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const contentInput = document.querySelector("#content");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-button");
const postList = document.querySelector("#post-list");
const postCount = document.querySelector("#post-count");
const formTitle = document.querySelector("#form-title");

let posts = [];
let currentUser = null;

// ==========================================
// [인증 (Auth) 기능 구현]
// ==========================================

// 현재 로그인 상태 확인
async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  updateAuthState(session?.user || null);
}

// 화면 UI 업데이트 (로그인 여부에 따라)
function updateAuthState(user) {
  currentUser = user;
  if (user) {
    userInfo.textContent = `반갑습니다, ${user.email}님!`;
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    emailInput.style.display = "none";
    passwordInput.style.display = "none";
  } else {
    userInfo.textContent = "로그인 후 이용해주세요.";
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    emailInput.style.display = "inline-block";
    passwordInput.style.display = "inline-block";
    emailInput.value = "";
    passwordInput.value = "";
  }
}

// 회원가입
signupBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("이메일과 비밀번호를 입력해주세요.");

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert("회원가입 실패: " + error.message);
  } else {
    alert("회원가입 성공! 이제 로그인해주세요.");
  }
});

// 로그인
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("이메일과 비밀번호를 입력해주세요.");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert("로그인 실패: " + error.message);
  } else {
    alert("로그인 성공!");
    updateAuthState(data.user);
  }
});

// 로그아웃
logoutBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    alert("로그아웃 되었습니다.");
    updateAuthState(null);
  }
});


// ==========================================
// [게시판 CRUD 기능 구현]
// ==========================================

// Create: 게시글 작성
async function createPost(title, author, content) {
  const { data, error } = await supabase
    .from('posts')
    .insert([{ title, author, content }]);
  
  if (error) alert("작성 실패: " + error.message);
}

// Read: 게시글 불러오기
async function readPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false }); // 최신글이 위로 오게 정렬
  
  if (error) {
    console.error("조회 실패: ", error);
    return [];
  }
  return data;
}

// Update: 게시글 수정
async function updatePost(id, title, author, content) {
  const { error } = await supabase
    .from('posts')
    .update({ title, author, content })
    .eq('id', id);

  if (error) alert("수정 실패: " + error.message);
}

// Delete: 게시글 삭제
async function deletePost(id) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) alert("삭제 실패: " + error.message);
}

// 화면에 게시글 그리기
async function renderPosts() {
  const currentPosts = await readPosts();
  posts = currentPosts;
  postCount.textContent = `${currentPosts.length}개`;

  // HTML 안내 문구 변경
  document.querySelector(".board-head p").textContent = "데이터가 Supabase DB와 실시간으로 연동됩니다!";

  if (currentPosts.length === 0) {
    postList.innerHTML = `
      <tr>
        <td class="empty" colspan="5">등록된 게시글이 없습니다.</td>
      </tr>
    `;
    return;
  }

  postList.innerHTML = currentPosts
    .map((post, index) => {
      // 날짜 깔끔하게 포맷팅
      const dateObj = new Date(post.created_at);
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

      return `
        <tr>
          <td>${currentPosts.length - index}</td>
          <td>
            <div class="post-title">${post.title}</div>
            <small>${post.content}</small>
          </td>
          <td>${post.author}</td>
          <td>${dateStr}</td>
          <td>
            <button class="small-button" onclick="window.startEdit(${post.id})">수정</button>
            <button class="small-button danger" onclick="window.removePost(${post.id})">삭제</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

// 수정 버튼 클릭 시 폼에 데이터 채우기 (HTML에서 onclick으로 접근할 수 있도록 window 객체에 할당)
window.startEdit = function(id) {
  const post = posts.find((item) => item.id === id);
  if (!post) return;

  postIdInput.value = post.id;
  titleInput.value = post.title;
  authorInput.value = post.author;
  contentInput.value = post.content;
  formTitle.textContent = "게시글 수정";
  submitButton.textContent = "수정";
  cancelButton.hidden = false;
};

// 삭제 로직 실행
window.removePost = async function(id) {
  const isConfirmed = confirm("게시글을 삭제할까요?");
  if (!isConfirmed) return;

  await deletePost(id);
  resetForm();
  renderPosts();
};

function resetForm() {
  postForm.reset();
  postIdInput.value = "";
  formTitle.textContent = "게시글 작성";
  submitButton.textContent = "등록";
  cancelButton.hidden = true;
}

// 폼 제출 (작성 및 수정) 이벤트
postForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser) {
    alert("게시글을 작성/수정하려면 먼저 로그인해주세요!");
    return;
  }

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const content = contentInput.value.trim();
  const editingId = Number(postIdInput.value);

  if (!title || !author || !content) {
    alert("제목, 작성자, 내용을 모두 입력해주세요.");
    return;
  }

  if (editingId) {
    await updatePost(editingId, title, author, content);
  } else {
    await createPost(title, author, content);
  }

  resetForm();
  renderPosts();
});

cancelButton.addEventListener("click", resetForm);

// 초기 실행
checkSession();
renderPosts();