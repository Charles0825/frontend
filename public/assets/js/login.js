// document
//   .getElementById("loginForm")
//   .addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;

//     // Send login request
//     const response = await fetch("http://localhost:3000/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       localStorage.setItem("token", data.token);
//       window.location.href = "/dashboard";
//     } else {
//       document.getElementById("message").textContent = data.error;
//     }
//   });

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // Save the token and username in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      window.location.href = "/dashboard";
    } else {
      document.getElementById("message").textContent = "Invalid credentials";
      // const error = await response.json();
      // console.error("Login failed:", error.error);
    }
  });
