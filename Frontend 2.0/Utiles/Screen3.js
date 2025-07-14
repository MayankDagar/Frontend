document.addEventListener("DOMContentLoaded", function() {
  // Simulate user login from localStorage
  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  let currentUser = localStorage.getItem("username") || "guest_user";

  // DOM elements for Screen3
  const questionTitleEl = document.getElementById("questionTitle");
  const questionMetaEl = document.getElementById("questionMeta");
  const questionDescriptionEl = document.getElementById("questionDescription");
  const questionImagesEl = document.getElementById("questionImages");
  const voteCountEl = document.querySelector(".vote-count");
  const upvoteBtn = document.querySelector(".vote-btn.upvote");
  const downvoteBtn = document.querySelector(".vote-btn.downvote");

  const answersListEl = document.getElementById("answersList");
  const answerInputEl = document.getElementById("answerInput");
  const postAnswerBtn = document.querySelector(".answer-box button");
  const userInfoEl = document.getElementById("userInfo");

  let currentQuestion = null; // To store the question being viewed
  let currentVote = 0; // Local vote count for the displayed question

  // --- Utility Functions ---

  // Function to get query parameter (questionId)
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Simulate fetching a single question by ID
  async function fetchQuestionById(id) {
    // In a real app, this would be an API call:
    // const response = await fetch(`/api/questions/${id}`);
    // const data = await response.json();
    // return data;

    // Simulated data for demonstration
    const allQuestions = [
      {
        id: 'q1',
        title: "How to join 2 columns in a data set to make a separate column in SQL",
        description: "<p>I do not know the code for it as I am a beginner...</p><p>I'm looking for a simple SQL query that can combine two existing columns (e.g., `FirstName` and `LastName`) into a new single column (e.g., `FullName`).</p><ul><li>What's the syntax for this?</li><li>Are there any considerations for handling `NULL` values?</li><li>Can this be done directly in a `SELECT` statement or does it require a more complex operation?</li></ul>",
        tags: ["SQL", "Beginner"],
        user: "JohnDoe",
        answers: 5,
        views: 120,
        askedDate: "2023-10-26T10:00:00Z",
        modifiedDate: "2023-10-26T11:30:00Z",
        votes: 15,
        images: [
          { src: "https://via.placeholder.com/200x150?text=SQL+Example1", alt: "SQL Example 1" },
          { src: "https://via.placeholder.com/200x150?text=SQL+Example2", alt: "SQL Example 2" }
        ]
      },
      {
        id: 'q2',
        title: "Understanding JavaScript Closures",
        description: "<p>Can someone explain closures in simple terms with an example?</p><p>I've read several articles, but the concept still feels a bit abstract. I'm looking for a clear, concise explanation with a practical code example that demonstrates their utility.</p>",
        tags: ["JavaScript", "Closures"],
        user: "JaneDoe",
        answers: 2,
        views: 85,
        askedDate: "2023-10-25T14:30:00Z",
        modifiedDate: "2023-10-25T15:00:00Z",
        votes: 8,
        images: []
      },
      {
        id: 'q3',
        title: "Best practices for REST API design",
        description: "<p>What are the current best practices for designing a robust and scalable REST API?</p><p>I'm starting a new project and want to ensure my API design follows modern standards. Topics of interest include:</p><ul><li>Versioning strategies</li><li>Error handling</li><li>Authentication/Authorization</li><li>Pagination and filtering</li><li>Idempotency</li></ul>",
        tags: ["API", "REST", "Backend"],
        user: "JohnDoe",
        answers: 1,
        views: 200,
        askedDate: "2023-10-24T09:00:00Z",
        modifiedDate: "2023-10-24T10:15:00Z",
        votes: 25,
        images: []
      },
      {
        id: 'q4',
        title: "How to center a div in CSS?",
        description: "<p>I'm struggling to horizontally and vertically center a div using CSS. What's the most reliable method?</p><p>I've tried `margin: auto;` and `text-align: center;` but they don't seem to work for both dimensions. Looking for modern CSS solutions like Flexbox or Grid.</p>",
        tags: ["CSS", "Layout", "Frontend"],
        user: "Alice",
        answers: 3,
        views: 300,
        askedDate: "2023-10-23T11:00:00Z",
        modifiedDate: "2023-10-23T12:00:00Z",
        votes: 10,
        images: []
      },
      {
        id: 'q5',
        title: "Difference between '==' and '===' in JavaScript",
        description: "<p>Can someone clarify the difference between loose equality and strict equality operators in JavaScript?</p><p>I often get confused about when to use `==` versus `===`. Are there any scenarios where `==` is preferred?</p>",
        tags: ["JavaScript", "Operators"],
        user: "Bob",
        answers: 4,
        views: 150,
        askedDate: "2023-10-22T16:00:00Z",
        modifiedDate: "2023-10-22T17:00:00Z",
        votes: 12,
        images: []
      }
    ];
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(allQuestions.find(q => q.id === id));
      }, 300); // Simulate network delay
    });
  }

  // Simulate fetching answers for a question
  async function fetchAnswersForQuestion(questionId) {
    // In a real app:
    // const response = await fetch(`/api/questions/${questionId}/answers`);
    // const data = await response.json();
    // return data;

    // Simulated data
    const simulatedAnswers = {
      'q1': [
        { id: 'a1_1', user: "SQLMaster", content: "<p>You can use the `CONCAT()` function or the `||` operator (in PostgreSQL/Oracle) or `+` operator (in SQL Server) to join columns.</p><p>Example for MySQL/PostgreSQL:</p><pre><code>SELECT CONCAT(FirstName, ' ', LastName) AS FullName FROM YourTable;</code></pre><p>For SQL Server:</p><pre><code>SELECT FirstName + ' ' + LastName AS FullName FROM YourTable;</code></pre><p>To handle NULLs, use `COALESCE()` or `ISNULL()`.</p>", timestamp: "2023-10-26T12:00:00Z", likes: 5, dislikes: 1, comments: [] },
        { id: 'a1_2', user: "DataNovice", content: "<p>Thanks! That's very helpful. What if I want to add a comma between last and first name?</p>", timestamp: "2023-10-26T13:00:00Z", likes: 2, dislikes: 0, comments: [{ id: 'c1_2_1', user: "SQLMaster", text: "You can adjust the string literal: `CONCAT(LastName, ', ', FirstName)`", timestamp: "2023-10-26T13:10:00Z" }] }
      ],
      'q2': [
        { id: 'a2_1', user: "CodeGuru", content: "<p>A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In simpler words, a closure gives you access to an outer function’s scope from an inner function.</p><pre><code>function makeAdder(x) {\n  return function(y) {\n    return x + y;\n  };\n}\n\nconst add5 = makeAdder(5);\nconsole.log(add5(2)); // 7 (x is remembered as 5)\n</code></pre>", timestamp: "2023-10-25T16:00:00Z", likes: 10, dislikes: 0, comments: [] }
      ],
      'q3': [], // No answers for q3 yet
      'q4': [
        { id: 'a4_1', user: "CSSPro", content: "<p>The most robust way to center a div both horizontally and vertically is using Flexbox:</p><pre><code>.container {\n  display: flex;\n  justify-content: center; /* Centers horizontally */\n  align-items: center;    /* Centers vertically */\n  height: 100vh;          /* Or a defined height */\n}</code></pre><p>For horizontal centering of a block element, `margin: 0 auto;` still works if it has a defined width.</p>", timestamp: "2023-10-23T13:00:00Z", likes: 7, dislikes: 2, comments: [] }
      ],
      'q5': [
        { id: 'a5_1', user: "JSLearner", content: "<p>`==` (loose equality) compares values after type coercion. `===` (strict equality) compares values without type coercion, meaning both value and type must be the same.</p><pre><code>console.log(5 == '5');   // true\nconsole.log(5 === '5');  // false\nconsole.log(null == undefined); // true\nconsole.log(null === undefined); // false\n</code></pre><p>Generally, `===` is preferred to avoid unexpected type coercion issues.</p>", timestamp: "2023-10-22T18:00:00Z", likes: 12, dislikes: 1, comments: [] }
      ]
    };

    // In a real app, user's vote state would come from the backend
    // For simulation, we'll load it from localStorage
    const allUserAnswerVotes = JSON.parse(localStorage.getItem(`allUserAnswerVotes`) || '{}');
    const currentUserAnswerVotes = allUserAnswerVotes[currentUser] || {};

    const answers = simulatedAnswers[questionId] || [];
    answers.forEach(answer => {
      // Set the user's vote for this specific answer
      answer.userVote = currentUserAnswerVotes[answer.id] || null; // 'like', 'dislike', or null
    });

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(answers);
      }, 300);
    });
  }

  // --- UI Rendering Functions ---

  function renderQuestion(question) {
    if (!question) {
      questionTitleEl.textContent = "Question Not Found";
      questionMetaEl.textContent = "";
      questionDescriptionEl.innerHTML = "<p>The question you are looking for does not exist or has been deleted.</p>";
      questionImagesEl.innerHTML = "";
      voteCountEl.textContent = "N/A"; // Set to N/A
      upvoteBtn.disabled = true; // Disable buttons
      downvoteBtn.disabled = true; // Disable buttons
      answerInputEl.disabled = true;
      postAnswerBtn.disabled = true;
      return;
    }

    currentQuestion = question;
    currentVote = question.votes || 0; // Initialize currentVote from question data

    questionTitleEl.textContent = question.title;
    const askedDate = new Date(question.askedDate).toLocaleString();
    const modifiedDate = new Date(question.modifiedDate).toLocaleString();
    questionMetaEl.innerHTML = `Asked by <strong>${question.user}</strong> on ${askedDate} · Modified on ${modifiedDate} · Viewed ${question.views} times`;
    questionDescriptionEl.innerHTML = question.description; // Use innerHTML for rich text

    questionImagesEl.innerHTML = '';
    if (question.images && question.images.length > 0) {
      question.images.forEach(img => {
        const imgDiv = document.createElement('div');
        imgDiv.innerHTML = `<img src="${img.src}" alt="${img.alt}"><span>${img.alt}</span>`;
        questionImagesEl.appendChild(imgDiv);
      });
    }

    updateVoteDisplay(); // Call to update vote display
  }

  function addAnswerToUI(answer) {
    const div = document.createElement("div");
    div.className = "answer-card";
    div.setAttribute('data-answer-id', answer.id); // Add data attribute for ID

    const likeBtnClass = answer.userVote === 'like' ? 'active' : '';
    const dislikeBtnClass = answer.userVote === 'dislike' ? 'active' : '';

    // Check if current user is the answer owner to show delete button
    const showDeleteAnswerBtn = isLoggedIn && currentUser === answer.user;
    const deleteAnswerBtnHtml = showDeleteAnswerBtn ?
      `<button class="delete-btn" onclick="deleteAnswer(this, '${answer.id}')">Delete</button>` : '';

    div.innerHTML = `
      <div class="answer-meta">
        <span><strong>${answer.user}</strong> • ${new Date(answer.timestamp).toLocaleString()}</span>
        ${deleteAnswerBtnHtml}
      </div>
      <p>${answer.content}</p>
      <div class="answer-actions">
        <div class="like-dislike-btns">
          <button class="like-btn ${likeBtnClass}" onclick="handleAnswerVote(this, '${answer.id}', 'like')">
            <i class="ri ri-thumb-up-fill"></i> <span class="like-count">${answer.likes}</span>
          </button>
          <button class="dislike-btn ${dislikeBtnClass}" onclick="handleAnswerVote(this, '${answer.id}', 'dislike')">
            <i class="ri ri-thumb-down-fill"></i> <span class="dislike-count">${answer.dislikes}</span>
          </button>
        </div>
        <div class="comment-section">
          <textarea placeholder="Add a comment..." rows="2"></textarea>
          <button onclick="submitComment(this, '${answer.id}')">Comment</button>
          <div class="comments"></div>
        </div>
      </div>
    `;

    const commentsDiv = div.querySelector(".comments");
    (answer.comments || []).forEach(comment => { // Ensure comments is an array
      const commentDiv = document.createElement("div");
      commentDiv.className = "comment";
      // Check if current user is the comment owner to show delete button
      const showDeleteCommentBtn = isLoggedIn && currentUser === comment.user;
      const deleteCommentBtnHtml = showDeleteCommentBtn ?
        `<button class="delete-btn" onclick="deleteComment(this, '${answer.id}', '${comment.id}')">Delete</button>` : '';

      commentDiv.innerHTML = `
        <span><strong>${comment.user}</strong>: ${comment.text}</span>
        ${deleteCommentBtnHtml}
      `;
      commentsDiv.appendChild(commentDiv);
    });

    answersListEl.prepend(div); // Add new answers to the top
  }

  // updateVoteDisplay function
  function updateVoteDisplay() {
    if (voteCountEl) {
      voteCountEl.innerText = currentVote;
    }
  }

  function setupAuthForAnswerSection() {
    if (!isLoggedIn) {
      if (answerInputEl) {
        answerInputEl.disabled = true;
        answerInputEl.placeholder = "You must login to post an answer.";
      }
      if (postAnswerBtn) {
        postAnswerBtn.innerText = "Login to Answer";
        postAnswerBtn.onclick = () => window.location.href = "Autentication.html"; // Redirect to login
      }
    } else {
      if (answerInputEl) {
        answerInputEl.disabled = false;
        answerInputEl.placeholder = "Type your answer here...";
      }
      if (postAnswerBtn) {
        postAnswerBtn.innerText = "Post Your Answer";
        postAnswerBtn.onclick = submitAnswer; // Re-assign correct function
      }
    }
  }

  function setupUserInfoDisplay() {
    if (isLoggedIn) {
      userInfoEl.innerHTML = `Welcome, <strong>${currentUser}</strong>! <button id="logoutBtn">Logout</button>`;
      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        window.location.reload(); // Reload to update UI
      });
    } else {
      userInfoEl.innerHTML = `<button id="loginBtn">Login</button>`;
      document.getElementById("loginBtn").addEventListener("click", () => {
        window.location.href = "Autentication.html";
      });
    }
  }

  // --- Event Handlers ---

  // Question Upvote/Downvote event listeners and updateQuestionVoteBackend function
  if (upvoteBtn) {
    upvoteBtn.addEventListener("click", async () => {
      if (!isLoggedIn) {
        alert("Please login to vote.");
        return;
      }
      currentVote++; // Simple increment
      await updateQuestionVoteBackend();
    });
  }

  if (downvoteBtn) {
    downvoteBtn.addEventListener("click", async () => {
      if (!isLoggedIn) {
        alert("Please login to vote.");
        return;
      }
      // Prevent currentVote from going negative
      if (currentVote > 0) {
        currentVote--; // Simple decrement
      }
      await updateQuestionVoteBackend();
    });
  }

  async function updateQuestionVoteBackend() {
    if (!currentQuestion) return;
    // In a real app, send vote to backend
    // await fetch(`/api/questions/${currentQuestion.id}/votes`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ votes: currentVote })
    // });
    console.log(`Simulated question vote update for ${currentQuestion.id}: ${currentVote}`);
    updateVoteDisplay();
  }


  // Submit Answer
  window.submitAnswer = async function() {
    if (!isLoggedIn) {
      alert("You must login to post an answer.");
      return;
    }
    if (!currentQuestion) {
      alert("Cannot post answer: No question loaded.");
      return;
    }

    const answerText = answerInputEl.value.trim();
    if (!answerText) {
      alert("Answer can't be empty");
      return;
    }

    const answerData = {
      id: 'a' + Date.now(), // Unique ID for the new answer
      user: currentUser,
      content: answerText,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      comments: []
    };

    // Simulate API call to post answer
    // const res = await fetch(`/api/questions/${currentQuestion.id}/answers`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(answerData)
    // });

    // if (res.ok) {
    //   answerInputEl.value = "";
    //   addAnswerToUI(answerData);
    //   alert("Answer posted successfully!");
    // } else {
    //   alert("Failed to post answer");
    // }
    console.log("Simulated answer post:", answerData);
    answerInputEl.value = "";
    addAnswerToUI(answerData);
    alert("Answer posted successfully!");
  };

  // Submit Comment
  window.submitComment = async function(btn, answerId) {
    if (!isLoggedIn) {
      alert("Please login to comment.");
      return;
    }

    const card = btn.closest(".answer-card");
    const textarea = card.querySelector("textarea");
    const comment = textarea.value.trim();

    if (!comment) {
      alert("Comment cannot be empty.");
      return;
    }

    const commentObj = {
      id: 'c' + Date.now(), // Unique ID for the new comment
      user: currentUser,
      text: comment,
      timestamp: new Date().toISOString()
    };

    // Simulate API call to save comment
    // await fetch("https://your-api.com/api/comments", { // Adjust endpoint as needed
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     answerId: answerId,
    //     ...commentObj
    //   })
    // });
    console.log("Simulated comment post:", commentObj);

    // Append to UI
    const commentsDiv = card.querySelector(".comments");
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";
    commentDiv.innerHTML = `
      <span><strong>${commentObj.user}</strong>: ${commentObj.text}</span>
      <button class="delete-btn" onclick="deleteComment(this, '${answerId}', '${commentObj.id}')">Delete</button>
    `;
    commentsDiv.appendChild(commentDiv);

    textarea.value = "";
  };

  // Handle Answer Like/Dislike - REFINED FOR ONE VOTE PER USER
  window.handleAnswerVote = async function(button, answerId, voteType) {
    if (!isLoggedIn) {
      alert("Please login to like/dislike answers.");
      return;
    }

    const answerCard = button.closest('.answer-card');
    const likeBtn = answerCard.querySelector('.like-btn');
    const dislikeBtn = answerCard.querySelector('.dislike-btn');
    const likeCountSpan = answerCard.querySelector('.like-count');
    const dislikeCountSpan = answerCard.querySelector('.dislike-count');

    let currentLikes = parseInt(likeCountSpan.textContent);
    let currentDislikes = parseInt(dislikeCountSpan.textContent);

    // Load all user votes from localStorage (simulating a database)
    const allUserAnswerVotes = JSON.parse(localStorage.getItem(`allUserAnswerVotes`) || '{}');
    // Get current user's votes for all answers
    let currentUserAnswerVotes = allUserAnswerVotes[currentUser] || {};
    // Get current user's vote for this specific answer
    let userPreviousVote = currentUserAnswerVotes[answerId] || null; // 'like', 'dislike', or null

    let newVoteState = userPreviousVote; // Initialize with current state

    if (voteType === 'like') {
      if (userPreviousVote === 'like') {
        // User clicked 'like' again, so un-like
        currentLikes--;
        newVoteState = null;
      } else {
        // User liked (or changed from dislike to like)
        currentLikes++;
        if (userPreviousVote === 'dislike') {
          // Undo previous dislike only if it exists
          if (currentDislikes > 0) { // Ensure count doesn't go negative
            currentDislikes--;
          }
        }
        newVoteState = 'like';
      }
    } else if (voteType === 'dislike') {
      if (userPreviousVote === 'dislike') {
        // User clicked 'dislike' again, so un-dislike
        currentDislikes--;
        newVoteState = null;
      } else {
        // User disliked (or changed from like to dislike)
        currentDislikes++;
        if (userPreviousVote === 'like') {
          // Undo previous like only if it exists
          if (currentLikes > 0) { // Ensure count doesn't go negative
            currentLikes--;
          }
        }
        newVoteState = 'dislike';
      }
    }

    // Update counts in UI
    likeCountSpan.textContent = currentLikes;
    dislikeCountSpan.textContent = currentDislikes;

    // Update button active states
    likeBtn.classList.toggle('active', newVoteState === 'like');
    dislikeBtn.classList.toggle('active', newVoteState === 'dislike');

    // Save the new vote state for the current user and answer
    currentUserAnswerVotes[answerId] = newVoteState;
    allUserAnswerVotes[currentUser] = currentUserAnswerVotes;
    localStorage.setItem(`allUserAnswerVotes`, JSON.stringify(allUserAnswerVotes));

    // Simulate sending vote to backend
    // In a real app, you'd send: answerId, userId, newVoteState
    // await fetch(`/api/answers/${answerId}/vote`, {
    //   method: "POST", // Or PUT
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ voteType: newVoteState, userId: currentUser })
    // });
    console.log(`Simulated vote for answer ${answerId} by ${currentUser}: ${newVoteState}`);
  };

  // --- Delete Functionality ---

  window.deleteAnswer = async function(button, answerId) {
    if (!isLoggedIn || !confirm("Are you sure you want to delete this answer?")) {
      return;
    }

    const answerCard = button.closest('.answer-card');
    const answerUser = answerCard.querySelector('.answer-meta span strong').textContent; // Corrected selector

    if (answerUser !== currentUser) {
      alert("You can only delete your own answers.");
      return;
    }

    // Simulate API call to delete answer
    // const res = await fetch(`/api/questions/${currentQuestion.id}/answers/${answerId}`, {
    //   method: "DELETE",
    //   headers: { "Content-Type": "application/json" }
    // });

    // if (res.ok) {
    //   answerCard.remove(); // Remove from UI
    //   alert("Answer deleted successfully!");
    // } else {
    //   alert("Failed to delete answer.");
    // }
    console.log(`Simulated deletion of answer ${answerId}`);
    answerCard.remove(); // Remove from UI
    alert("Answer deleted successfully!");

    // Optional: Clean up associated votes from localStorage if needed
    const allUserAnswerVotes = JSON.parse(localStorage.getItem(`allUserAnswerVotes`) || '{}');
    for (const user in allUserAnswerVotes) {
      if (allUserAnswerVotes[user][answerId]) {
        delete allUserAnswerVotes[user][answerId];
      }
    }
    localStorage.setItem(`allUserAnswerVotes`, JSON.stringify(allUserAnswerVotes));
  };

  window.deleteComment = async function(button, answerId, commentId) {
    if (!isLoggedIn || !confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    const commentDiv = button.closest('.comment');
    const commentUser = commentDiv.querySelector('strong').textContent;

    if (commentUser !== currentUser) {
      alert("You can only delete your own comments.");
      return;
    }

    // Simulate API call to delete comment
    // const res = await fetch(`/api/questions/${currentQuestion.id}/answers/${answerId}/comments/${commentId}`, {
    //   method: "DELETE",
    //   headers: { "Content-Type": "application/json" }
    // });

    // if (res.ok) {
    //   commentDiv.remove(); // Remove from UI
    //   alert("Comment deleted successfully!");
    // } else {
    //   alert("Failed to delete comment.");
    // }
    console.log(`Simulated deletion of comment ${commentId} from answer ${answerId}`);
    commentDiv.remove(); // Remove from UI
    alert("Comment deleted successfully!");
  };


  // --- Initialization ---

  async function initializePage() {
    setupUserInfoDisplay();
    setupAuthForAnswerSection();

    const questionId = getQueryParam('id');
    if (questionId) {
      const question = await fetchQuestionById(questionId);
      renderQuestion(question);
      if (question) {
        // Clear answers list before adding new ones
        answersListEl.innerHTML = '';
        const answers = await fetchAnswersForQuestion(question.id);
        answers.forEach(addAnswerToUI);
      }
    } else {
      renderQuestion(null); // Indicate no question found
    }
  }

  initializePage();
});
