const socket = io();

// Listen for device data from the server
socket.on("deviceData", (data) => {
  updateDeviceCard(data.device_name, data);
});

// function updateDeviceCard(deviceId, data) {
//   let deviceCard = document.getElementById(`device-${deviceId}`);
//   if (!deviceCard) {
//     const container = document.getElementById("device-cards");
//     const card = document.createElement("div");
//     card.className = "col-md-4";
//     card.id = `device-${deviceId}`;
//     card.innerHTML = `
//       <div class="card mb-3">
//         <div class="card-header">
//           <h5>Device: ${data.device_name}</h5>
//         </div>
//         <div class="card-body">
//           <p><strong>Voltage:</strong> ${data.voltage} V</p>
//           <p><strong>Current:</strong> ${data.current} A</p>
//           <p><strong>Active Power :</strong> ${data.power_active} W</p>
//           <p><strong>Energy:</strong> ${data.energy} kWh</p>
//           <p><strong>Frequency:</strong> ${data.frequency} Hz</p>
//           <p><strong>Power Factor:</strong> ${data.cosine_phi} PF</p>
//         </div>
//       </div>
//     `;
//     container.appendChild(card);
//   } else {
//     deviceCard.querySelector(`.card-body`).innerHTML = `
//       <p><strong>Voltage:</strong> ${data.voltage} V</p>
//       <p><strong>Current:</strong> ${data.current} A</p>
//       <p><strong>Active Power:</strong> ${data.power_active} W</p>
//       <p><strong>Energy:</strong> ${data.energy} kWh</p>
//       <p><strong>Frequency:</strong> ${data.frequency} Hz</p>
//       <p><strong>Power Factor:</strong> ${data.cosine_phi} PF</p>
//     `;
//   }
// }

const formatEnergy = (value) =>
  value >= 1000 ? (value / 1000).toFixed(2) + " kWh" : value + " Wh";

function updateDeviceCard(deviceId, data) {
  let deviceCard = document.getElementById(`device-${deviceId}`);
  if (!deviceCard) {
    const container = document.getElementById("device-cards");
    const card = document.createElement("div");
    card.className = "col-md-4";
    card.id = `device-${deviceId}`;
    card.innerHTML = `
      <div class="card mb-3">
        <div class="card-header">
          <h5>Device: ${data.device_name}</h5>
        </div>
        <div class="card-body">
          <p><strong>Voltage:</strong> ${data.voltage} V</p>
          <p><strong>Current:</strong> ${data.current} A</p>
          <p><strong>Active Power:</strong> ${data.power_active} W</p>
          <p><strong>Energy:</strong> ${formatEnergy(data.energy)}</p>
          <p><strong>Frequency:</strong> ${data.frequency} Hz</p>
          <p><strong>Power Factor:</strong> ${data.cosine_phi} PF</p>
        </div>
        <div class="card-footer text-right">
          <button class="btn btn-danger" onclick="togglePower('${deviceId}')">
            <i class="fas fa-power-off"></i> Turned On
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  } else {
    deviceCard.querySelector(`.card-body`).innerHTML = `
      <p><strong>Voltage:</strong> ${data.voltage} V</p>
      <p><strong>Current:</strong> ${data.current} A</p>
      <p><strong>Active Power:</strong> ${data.power_active} W</p>
      <p><strong>Energy:</strong> ${formatEnergy(data.energy)}</p>
      <p><strong>Frequency:</strong> ${data.frequency} Hz</p>
      <p><strong>Power Factor:</strong> ${data.cosine_phi} PF</p>
    `;
  }
}

function togglePower(deviceId) {
  console.log(deviceId);
  const deviceCard = document.getElementById(`device-${deviceId}`);
  const button = deviceCard.querySelector("button");
  const icon = button.querySelector("i");
  if (button.innerText.includes("Turned On")) {
    button.innerHTML = `<i class="fas fa-power-off"></i> Turned Off`;
    button.classList.remove("btn-danger");
    button.classList.add("btn-secondary");
    icon.classList.remove("fa-power-off");
    icon.classList.add("fa-power-off");
    socket.emit("control-device", { deviceId: deviceId, action: "OFF" });
  } else {
    button.innerHTML = `<i class="fas fa-power-off"></i> Turned On`;
    button.classList.remove("btn-secondary");
    button.classList.add("btn-danger");
    icon.classList.remove("fa-power-off");
    icon.classList.add("fa-power-off");
    socket.emit("control-device", { deviceId: deviceId, action: "ON" });
  }
}
