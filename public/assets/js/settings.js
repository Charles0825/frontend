function getUsername() {
  return localStorage.getItem("username");
}

document
  .getElementById("changeForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const newUsername = event.target.username.value; // Get the new username
    const newPassword = event.target.newPassword.value; // Get the new password
    const confirmNewPassword = event.target.confirmNewPassword.value; // Confirm new password

    // Validate that the new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      notificationAlert("alert-light", "Passwords do not match!");
      return;
    }

    try {
      // Retrieve the current user's username
      const currentUsername = getUsername();

      // Send a single request to change username and/or password
      const response = await fetch("http://localhost:5555/api/user/change", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: currentUsername,
          newUsername: newUsername || null,
          newPasswordHash: newPassword || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        notificationAlert("alert-dark", "Error changing user details");
        throw new Error(data.error || "Error changing user details");
      }

      if (newUsername) {
        localStorage.setItem("username", newUsername);
      }

      notificationAlert("alert-success", "User details changed successfully!");

      // Clear the input fields
      event.target.username.value = "";
      event.target.newPassword.value = "";
      event.target.confirmNewPassword.value = "";
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });

function notificationAlert(type, message) {
  const successAlert = document.getElementById("successAlert");
  successAlert.classList.add(type);
  successAlert.style.display = "block";
  successAlert.textContent = message;

  setTimeout(() => {
    successAlert.style.display = "none";
    successAlert.classList.remove(type);
  }, 5000);
}
