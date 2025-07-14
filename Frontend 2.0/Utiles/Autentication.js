/*===== LOGIN SHOW and HIDDEN =====*/
const signUp = document.getElementById("sign-up"),
  signIn = document.getElementById("sign-in"),
  loginIn = document.getElementById("login-in"),
  loginUp = document.getElementById("login-up");

signUp.addEventListener("click", () => {
  // Remove classes first if they exist
  loginIn.classList.remove("block");
  loginUp.classList.remove("none");

  // Add classes
  loginIn.classList.toggle("none");
  loginUp.classList.toggle("block");
});

signIn.addEventListener("click", () => {
  // Remove classes first if they exist
  loginIn.classList.remove("none");
  loginUp.classList.remove("block");

  // Add classes
  loginIn.classList.toggle("block");
  loginUp.classList.toggle("none");
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-submit");

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get form input values
    const username = document
      .querySelector("#login-in input[placeholder='Username']")
      .value.trim();
    const password = document
      .querySelector("#login-in input[placeholder='Password']")
      .value.trim();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    // Simulate API call for login
    // In a real application, you would make an actual fetch request here.
    // For this example, we'll simulate success.
    const simulatedLoginSuccess = true; // Change to false to simulate failure
    const simulatedData = { message: "Login successful!", token: "fake-token-123" };

    if (simulatedLoginSuccess) {
      alert("Login successful!");
      console.log("Response:", simulatedData);
      // Store login status and username in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      window.location.href = "./Home.html"; // Redirect to home page
    } else {
      alert("Login failed. Invalid credentials."); // Simulated error message
    }

    // Original commented out fetch block (for reference, if you connect to a backend)
    // try {
    //   const response = await fetch("http://localhost:8000/api/v1/auth/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ username, password }),
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     alert("Login successful!");
    //     console.log("Response:", data);
    //     localStorage.setItem("isLoggedIn", "true");
    //     localStorage.setItem("username", username);
    //     window.location.href = "./Home.html";
    //   } else {
    //     alert(data.message || "Login failed.");
    //   }
    // } catch (error) {
    //   console.error("Error during login:", error);
    //   alert("An error occurred during login.");
    // }
  });

  const signupBtn = document.getElementById("signup-submit");

  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get values from Sign Up form
    const username = document
      .querySelector("#login-up input[placeholder='Username']")
      .value.trim();
    const email = document
      .querySelector("#login-up input[placeholder='Email']")
      .value.trim();
    const password = document
      .querySelector("#login-up input[placeholder='Password']")
      .value.trim();

    if (!username || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    // Simulate API call for registration
    // In a real application, you would make an actual fetch request here.
    // For this example, we'll simulate success and then log them in.
    const simulatedRegistrationSuccess = true; // Change to false to simulate failure
    const simulatedRegistrationData = { message: "Registration successful!", user: { username, email } };

    if (simulatedRegistrationSuccess) {
      alert("Registration successful!");
      console.log("Registered user:", simulatedRegistrationData);
      // Automatically log in the user after successful registration
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      window.location.href = "./Home.html"; // Redirect to home page
    } else {
      alert("Registration failed. User might already exist."); // Simulated error message
    }

    // Original commented out fetch block (for reference, if you connect to a backend)
    // try {
    //   const response = await fetch(
    //     "http://localhost:8000/api/v1/auth/register",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ username, email, password }),
    //     }
    //   );
    //   const data = await response.json();
    //   if (response.ok) {
    //     alert("Registration successful!");
    //     console.log("Registered user:", data);
    //     localStorage.setItem("isLoggedIn", "true");
    //     localStorage.setItem("username", username);
    //     window.location.href = "./Home.html";
    //   } else {
    //     alert(data.message || "Registration failed.");
    //   }
    // } catch (error) {
    //   console.error("Error during registration:", error);
    //   alert("An error occurred during registration.");
    // }
  });
});

// The duplicate DOMContentLoaded block below is from the original context and is not needed.
// It contains logic for a separate "Logged.js" which is not directly used by Autentication.js for its primary function.
// It's best to keep authentication logic separate from dashboard display logic.
// For the purpose of this request, we only need the localStorage updates and redirects.
