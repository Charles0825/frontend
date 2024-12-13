const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");

const mqtt = require("mqtt");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const app = express();
const PORT = process.env.SERVER_PORT || 4040;
const BACKEND_API_URL = process.env.BACKEND_URL;
const JWT_SECRET = process.env.JWT;

const server = http.createServer(app); // Create HTTP server
const io = new Server(server); // Initialize Socket.io with the server

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// MQTT client setup
const mqttClient = mqtt.connect("mqtt://raspi:1883"); // Replace with your MQTT broker URL

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("sensor/+/data"); // Subscribe to all device data topics
});

mqttClient.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    io.emit("deviceData", data); // Emit data to all connected clients via Socket.io
  } catch (error) {
    console.error("Failed to parse MQTT message:", error);
  }
});

// // Socket.io connection handling
// io.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("New Socket.io client connected:", socket.id);

  // Handle client control commands
  socket.on("control-device", (data) => {
    try {
      const { deviceId, action } = data;
      if (deviceId && action) {
        const mqttTopic = `relay/${deviceId.toLowerCase()}`; // Construct the control topic
        const mqttMessage = action; // Create the control message

        mqttClient.publish(mqttTopic, mqttMessage, (err) => {
          if (err) {
            console.error("Failed to publish MQTT message:", err);
            socket.emit(
              "error",
              "Failed to send control command to the device"
            );
          } else {
            console.log(`Published MQTT message to ${mqttTopic}:`, mqttMessage);
            socket.emit("success", `Device ${deviceId} ${action}`);
          }
        });
      } else {
        socket.emit("error", "Invalid control command");
      }
    } catch (error) {
      console.error("Error handling control-device event:", error);
      socket.emit("error", "Failed to process control command");
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket.io client disconnected:", socket.id);
  });
});

// Helper function to hash passwords using SHA-256
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function getUserFromDB(username) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/user/${username}`);
    if (!response.ok) {
      throw new Error(`User not found: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw new Error("Error fetching user data");
  }
}

async function authenticateUser(username, password) {
  const user = await getUserFromDB(username);
  if (!user) return false;

  const passwordHash = hashPassword(password);
  return user.passwordHash === passwordHash;
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const isAuthenticated = await authenticateUser(username, password);
    if (!isAuthenticated) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, username });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/user", verifyToken, (req, res) => {
  res.json({ username: req.user.username });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // console.error("Token verification error:", err);
      return res.status(401).json({ error: "Failed to authenticate token" });
    }

    req.user = decoded;
    next();
  });
}

app.get("/protected-route", verifyToken, (req, res) => {
  res.json({
    message: `Hello, ${req.user.username}! This is a protected route.`,
  });
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/realtime-monitoring", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "realtime-monitoring.html"));
});

app.get("/historical-data", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "historical-data.html"));
});

app.get("/settings", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "settings.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
