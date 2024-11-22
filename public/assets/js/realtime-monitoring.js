const socket = io();

// Listen for device data from the server
socket.on("deviceData", (data) => {
  updateDeviceCard(data.device_name, data);
});

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
          <p><strong>Active Power :</strong> ${data.power_active} W</p>
          <p><strong>Energy:</strong> ${data.energy} kWh</p>
          <p><strong>Frequency:</strong> ${data.frequency} Hz</p>
          <p><strong>Power Factor:</strong> ${data.cosine_phi} PF</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  } else {
    deviceCard.querySelector(`.card-body`).innerHTML = `
      <p><strong>Voltage:</strong> ${data.voltage} V</p>
      <p><strong>Current:</strong> ${data.current} A</p>
      <p><strong>Active Power:</strong> ${data.power_active} W</p>
      <p><strong>Energy:</strong> ${data.energy} kWh</p>
      <p><strong>Frequency:</strong> ${data.frequency} Hz</p>
      <p><strong>Power Factor:</strong> ${data.cosine_phi} PF</p>
    `;
  }
}
