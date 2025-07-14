document.addEventListener("DOMContentLoaded", function() {
  // Simulate user login from localStorage
  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  let currentUser = localStorage.getItem("username") || "guest_user";

  // DOM elements
  const askBtn = document.querySelector(".ask-btn");
  const modal = document.getElementById("askModal");
  const loginModal = document.getElementById("loginModal");
  const goToLoginBtn = document.getElementById("goToLoginBtn");
  const submitBtn = document.querySelector(".submit-btn");
  const questionList = document.getElementById("questionList");

  // Search bar elements
  const searchInput = document.querySelector(".search-box input");
  const searchIcon = document.querySelector(".search-icon");

  // New DOM elements for home page auth section
  const loginButtonHome = document.getElementById("loginButtonHome");
  const userAvatarHome = document.getElementById("userAvatarHome");
  const dropdownMenuHome = document.getElementById("dropdownMenuHome");
  const dropdownUsernameHome = document.getElementById("dropdownUsernameHome");
  const logoutButtonHome = document.getElementById("logoutButtonHome");

  // New DOM element for modal breadcrumb (still hidden as per last request)
  const modalBreadcrumbItem = document.getElementById("modalBreadcrumbItem");

  // Initialize Quill editor outside of submit handler
  let quill;
  if (document.getElementById("editor")) {
    quill = new Quill('#editor', {
      theme: 'snow',
      placeholder: 'Enter your question description...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });
  } else {
    console.warn("Quill editor element #editor not found. Skipping initialization.");
  }


  // Sample data array - new questions will be pushed here
  let questions = [
    {
      id: 'q1', // Unique ID
      title: "How to join 2 columns in a data set to make a separate column in SQL",
      description: "I do not know the code for it as I am a beginner...",
      tags: ["SQL", "Beginner"],
      user: "JohnDoe",
      answers: 5
    },
    {
      id: 'q2', // Unique ID
      title: "Understanding JavaScript Closures",
      description: "Can someone explain closures in simple terms with an example?",
      tags: ["JavaScript", "Closures"],
      user: "JaneDoe",
      answers: 2
    },
    {
      id: 'q3', // Unique ID
      title: "Best practices for REST API design",
      description: "What are the current best practices for designing a robust and scalable REST API?",
      tags: ["API", "REST", "Backend"],
      user: "JohnDoe", // This question also belongs to JohnDoe
      answers: 1
    },
    {
      id: 'q4',
      title: "How to center a div in CSS?",
      description: "I'm struggling to horizontally and vertically center a div using CSS. What's the most reliable method?",
      tags: ["CSS", "Layout", "Frontend"],
      user: "Alice",
      answers: 3
    },
    {
      id: 'q5',
      title: "Difference between '==' and '===' in JavaScript",
      description: "Can someone clarify the difference between loose equality and strict equality operators in JavaScript?",
      tags: ["JavaScript", "Operators"],
      user: "Bob",
      answers: 4
    }
  ];

  // Function to update the breadcrumb for the modal (remains hidden)
  function updateModalBreadcrumb(isVisible) {
    if (modalBreadcrumbItem) {
      modalBreadcrumbItem.style.display = "none";
      modalBreadcrumbItem.textContent = "";
    }
  }

  // Define openModal and closeModal functions
  window.openModal = function() {
    if (isLoggedIn) {
      if (modal) modal.style.display = "flex";
    } else {
      if (loginModal) loginModal.style.display = "flex";
    }
  };

  window.closeModal = function() {
    if (modal) modal.style.display = "none";
  };

  // Ask button click handler
  askBtn.addEventListener("click", () => {
    if (isLoggedIn) {
      if (modal) modal.style.display = "flex";
    } else {
      if (loginModal) loginModal.style.display = "flex";
    }
  });

  // Close login modal function
  function closeLoginModal() {
    if (loginModal) loginModal.style.display = "none";
  }
  window.closeLoginModal = closeLoginModal;

  // Redirect to login page
  goToLoginBtn.addEventListener("click", () => {
    window.location.href = "./Autentication.html";
  });

  // Submit question functionality
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = quill ? quill.root.innerHTML.trim() : document.getElementById("editor").innerText.trim();
    const tagsInput = document.getElementById("tags").value.trim();
    const tags = tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag !== '');

    if (!title || !description || tags.length === 0) {
      alert("Please fill in all fields (Title, Description, and at least one Tag).");
      return;
    }

    const newQuestion = {
      id: 'q' + Date.now(), // Generate a simple unique ID for demonstration
      title,
      description,
      tags,
      user: currentUser,
      answers: 0,
    };

    // Add to UI (locally for immediate display)
    questions.unshift(newQuestion);
    renderQuestions(); // Re-render the list to include the new question

    // Send to backend API (simulated)
    try {
      // In a real application, you would send this data to your server
      // const response = await fetch("https://your-api.com/api/questions", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(newQuestion),
      // });

      // if (response.ok) {
      //   const serverData = await response.json();
      //   // If server returns the actual ID, update the question in the array
      //   newQuestion.id = serverData.id;
      //   console.log("Question submitted successfully to server!");
      // } else {
      //   console.error("Failed to submit question to server.");
      //   alert("Failed to submit question. Please try again.");
      //   questions.shift(); // Remove if server submission failed
      //   renderQuestions();
      // }
      console.log("Simulated successful submission of question:", newQuestion);
      alert("Question submitted successfully!");

    } catch (error) {
      console.error("Error submitting question:", error);
      alert("An error occurred while submitting the question.");
      questions.shift();
      renderQuestions();
    }

    // Reset form and close modal
    document.getElementById("title").value = "";
    if (quill) quill.setContents([]);
    document.getElementById("tags").value = "";
    if (modal) modal.style.display = "none";
  });

  // NEW: Function to handle question deletion
  async function deleteQuestion(questionIdToDelete) {
    if (!isLoggedIn) {
      alert("You must be logged in to delete questions.");
      return;
    }

    const questionToDelete = questions.find(q => q.id === questionIdToDelete);

    if (!questionToDelete) {
      console.error("Question not found for deletion:", questionIdToDelete);
      return;
    }

    // Check if the current user is the owner of the question
    if (questionToDelete.user !== currentUser) {
      alert("You can only delete your own questions.");
      return;
    }

    // Confirmation dialog
    const confirmDelete = confirm(`Are you sure you want to delete the question: "${questionToDelete.title}"?`);
    if (!confirmDelete) {
      return; // User cancelled deletion
    }

    // Simulate backend deletion
    try {
      // In a real application, you would send a DELETE request to your server
      // const response = await fetch(`https://your-api.com/api/questions/${questionIdToDelete}`, {
      //   method: "DELETE",
      //   headers: {
      //     "Authorization": `Bearer ${yourAuthToken}` // Include auth token
      //   }
      // });

      // if (response.ok) {
      //   console.log(`Question ${questionIdToDelete} deleted successfully from server.`);
      //   // Remove from local array only after successful server deletion
      //   questions = questions.filter(q => q.id !== questionIdToDelete);
      //   renderQuestions(); // Re-render the list
      //   alert("Question deleted successfully!");
      // } else {
      //   console.error("Failed to delete question from server.");
      //   alert("Failed to delete question. Please try again.");
      // }
      console.log(`Simulated successful deletion of question ${questionIdToDelete}.`);
      // Remove from local array for simulation
      questions = questions.filter(q => q.id !== questionIdToDelete);
      renderQuestions(); // Re-render the list
      alert("Question deleted successfully!");

    } catch (error) {
      console.error("Error during deletion:", error);
      alert("An error occurred while deleting the question.");
    }
  }
  // Make deleteQuestion globally accessible for event listeners
  window.deleteQuestion = deleteQuestion;


  // Function to render questions on the page
  // Now accepts an optional 'filteredQuestions' array
  function renderQuestions(questionsToRender = questions) { // Default to all questions
    if (!questionList) {
      console.error("questionList element not found!");
      return;
    }
    questionList.innerHTML = ""; // Clear existing content before re-rendering

    if (questionsToRender.length === 0) {
      questionList.innerHTML = '<p style="text-align: center; color: #777; font-size: 1.2rem; margin-top: 50px;">No questions found matching your criteria.</p>';
      return;
    }

    questionsToRender.forEach((q) => {
      const card = document.createElement("div");
      card.className = "question-card";

      // Create an anchor tag to wrap the question content
      const questionLink = document.createElement("a");
      questionLink.href = `Screen3.html?id=${q.id}`; // Link to Screen3.html with question ID
      questionLink.style.textDecoration = 'none'; // Remove underline
      questionLink.style.color = 'inherit'; // Inherit text color
      questionLink.style.display = 'flex'; // Make the link a flex container
      questionLink.style.width = '100%'; // Take full width of the card
      questionLink.style.justifyContent = 'space-between'; // Maintain layout

      // Build the inner HTML for the link content
      let linkInnerHtml = `
        <div class="question-content">
          <h2>${q.title}</h2>
          <p>${q.description}</p>
          <div class="tags">${q.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
          <p class="user-name">By ${q.user}</p>
        </div>
        <div class="answers">${q.answers}<br/>ans</div>
      `;

      // Add delete button ONLY if the question belongs to the current user
      // The delete button needs to be outside the clickable link area
      let deleteButtonHtml = '';
      if (isLoggedIn && q.user === currentUser) {
        // The delete button should not be part of the link
        // We'll add it as a separate element within the card
        deleteButtonHtml = `<button class="delete-btn" onclick="event.stopPropagation(); deleteQuestion('${q.id}');">Delete</button>`;
        // event.stopPropagation() is crucial here to prevent the link from being clicked when the button is clicked
      }

      questionLink.innerHTML = linkInnerHtml;
      card.appendChild(questionLink);

      // Append the delete button separately if it exists
      if (deleteButtonHtml) {
        const deleteBtnContainer = document.createElement('div');
        deleteBtnContainer.innerHTML = deleteButtonHtml;
        // Append the button directly to the card, or to a specific container within the card
        // For simplicity, let's append it to the card and adjust CSS
        card.appendChild(deleteBtnContainer.firstChild); // Append the button element
      }

      questionList.appendChild(card);
    });
  }

  // NEW: Search functionality
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let filteredQuestions = [];

    if (searchTerm === "") {
      filteredQuestions = questions; // If search term is empty, show all questions
    } else {
      filteredQuestions = questions.filter(q =>
        q.title.toLowerCase().includes(searchTerm) ||
        q.description.toLowerCase().includes(searchTerm) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        q.user.toLowerCase().includes(searchTerm)
      );
    }
    renderQuestions(filteredQuestions); // Render the filtered list
  }

  // Event listener for search input (live search)
  searchInput.addEventListener("input", performSearch);

  // Event listener for search icon click
  searchIcon.addEventListener("click", performSearch);


  // Function to check login status and update UI
  function checkLoginStatusAndDisplayUI() {
    isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    currentUser = localStorage.getItem("username") || "guest_user";

    if (isLoggedIn) {
      if (loginButtonHome) loginButtonHome.style.display = "none";
      if (userAvatarHome) {
        userAvatarHome.style.display = "block";
        userAvatarHome.src = `https://placehold.co/40x40/3f51b5/ffffff?text=${currentUser.charAt(0).toUpperCase()}`;
        userAvatarHome.alt = `User avatar for ${currentUser}`;
      }
      if (dropdownUsernameHome) dropdownUsernameHome.textContent = currentUser;
    } else {
      if (loginButtonHome) loginButtonHome.style.display = "block";
      if (userAvatarHome) userAvatarHome.style.display = "none";
      if (dropdownMenuHome) dropdownMenuHome.classList.remove("show");
    }
    renderQuestions(); // Re-render questions to show/hide delete buttons based on login status
  }

  // Event listener for user avatar to toggle dropdown
  if (userAvatarHome) {
    userAvatarHome.addEventListener("click", function () {
      if (dropdownMenuHome) dropdownMenuHome.classList.toggle("show");
    });
  }

  // Event listener for logout button
  if (logoutButtonHome) {
    logoutButtonHome.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      checkLoginStatusAndDisplayUI(); // Update UI after logout
      if (dropdownMenuHome) dropdownMenuHome.classList.remove("show");
    });
  }

  // Close dropdown when clicking outside
  window.addEventListener("click", function (e) {
    if (dropdownMenuHome && !e.target.matches(".user-avatar") && !e.target.closest(".dropdown-menu")) {
      if (dropdownMenuHome.classList.contains("show")) {
        dropdownMenuHome.classList.remove("show");
      }
    }
  });

  // Initial render and UI check on page load
  checkLoginStatusAndDisplayUI();
  updateModalBreadcrumb(false); // Ensure it's hidden on initial load
});
