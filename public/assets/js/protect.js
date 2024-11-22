// Get the token from localStorage
const token = localStorage.getItem("token");

// Check if the token exists
if (token) {
  // Make a request to a protected route
  async function checkProtectedRoute() {
    try {
      const response = await fetch("/protected-route", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token here
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else if (response.status === 401) {
        // Handle 401 Unauthorized
        console.warn("Unauthorized access. Redirecting to login...");
        logout(); // Redirect to login page
      } else {
        const data = await response.json();
        console.error(data.message.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  }

  // Call the function to check the protected route
  checkProtectedRoute();
} else {
  window.location.href = "/"; // Redirect to login page if no token
}

// Logout function
function logout() {
  localStorage.removeItem("token"); // Clear token from localStorage
  localStorage.removeItem("username"); // Clear other user-related data
  window.location.href = "/"; // Redirect to login page
}
