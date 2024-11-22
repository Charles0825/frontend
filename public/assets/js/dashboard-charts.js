// async function fetchDailyEnergyUsage() {
//   const response = await fetch("http://127.0.0.1:5555/api/daily-energy-usage");
//   const data = await response.json();
//   return data;
// }

// async function fetchMonthlyEnergyUsage() {
//   const response = await fetch(
//     "http://127.0.0.1:5555/api/monthly-energy-usage"
//   );
//   const data = await response.json();
//   return data;
// }

// async function fetchDailyEnergyUsagePerRoom() {
//   const response = await fetch(
//     "http://127.0.0.1:5555/api/daily-energy-usage-per-room"
//   );
//   const data = await response.json();
//   return data;
// }

// async function renderCharts() {
//   //   const dailyEnergyUsage = await fetchDailyEnergyUsage();
//   const monthlyEnergyUsage = await fetchMonthlyEnergyUsage();

//   // Render Daily Energy Usage Chart
//   const dailyChartContext = document
//     .getElementById("dailyenergy")
//     .getContext("2d");
//   const dailyChart = new Chart(dailyChartContext, {
//     type: "line", // or 'bar'
//     data: {
//       labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), // Hour labels
//       datasets: [
//         {
//           label: "Energy Usage (kWh)",
//           data: monthlyEnergyUsage,
//           borderColor: "rgba(75, 192, 192, 1)",
//           backgroundColor: "rgba(75, 192, 192, 0.2)",
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//         },
//       },
//     },
//   });

//   // Render Monthly Energy Usage Chart
//   const monthlyChartContext = document
//     .getElementById("monthlyenergy")
//     .getContext("2d");
//   const monthlyChart = new Chart(monthlyChartContext, {
//     type: "bar",
//     data: {
//       labels: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ], // Month labels
//       datasets: [
//         {
//           label: "Energy Usage (kWh)",
//           data: monthlyEnergyUsage,
//           backgroundColor: "rgba(153, 102, 255, 0.2)",
//           borderColor: "rgba(153, 102, 255, 1)",
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//         },
//       },
//     },
//   });
// }

// async function renderDeviceCharts() {
//   const energyUsageData = await fetchDailyEnergyUsagePerRoom();
//   const deviceChartsContainer = document.getElementById("deviceCharts");
//   //   deviceChartsContainer.innerHTML = ""; // Clear any existing charts

//   Object.keys(energyUsageData).forEach((deviceName) => {
//     const deviceCard = document.createElement("div");
//     deviceCard.className = "col-md-6";
//     deviceCard.innerHTML = `
//         <div class="card">
//           <div class="content">
//             <div class="head">
//               <h5 class="mb-0">${deviceName} Overview</h5>
//               <p class="text-muted">Daily energy usage data</p>
//             </div>
//             <div class="canvas-wrapper">
//               <canvas class="chart" id="${deviceName.replace(
//                 " ",
//                 "_"
//               )}_chart"></canvas>
//             </div>
//           </div>
//         </div>
//       `;

//     deviceChartsContainer.appendChild(deviceCard);

//     const ctx = document
//       .getElementById(`${deviceName.replace(" ", "_")}_chart`)
//       .getContext("2d");
//     new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: [deviceName],
//         datasets: [
//           {
//             label: "Energy Usage (kWh)",
//             data: [energyUsageData[deviceName]],
//             backgroundColor: "rgba(75, 192, 192, 0.6)",
//             borderColor: "rgba(75, 192, 192, 1)",
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true,
//             title: {
//               display: true,
//               text: "Energy Usage (kWh)",
//             },
//           },
//           x: {
//             title: {
//               display: true,
//               text: "Devices",
//             },
//           },
//         },
//       },
//     });
//   });
// }

// // Call both render functions when the page loads
// window.onload = async () => {
//   await renderCharts();
//   await renderDeviceCharts();
// };

// const url = window.env.URL;
// // Utility function to get cached data if it exists and is valid
// function getCachedData(key) {
//   const cached = localStorage.getItem(key);
//   const expiration = localStorage.getItem(`${key}Expiration`);
//   if (cached && expiration && Date.now() < expiration) {
//     return JSON.parse(cached);
//   }
//   return null;
// }

// // Utility function to set cache with expiration time (e.g., 1 hour)
// function setCache(key, data, hoursToExpire = 1) {
//   localStorage.setItem(key, JSON.stringify(data));
//   const expirationTime = Date.now() + hoursToExpire * 60 * 60 * 1000; // Cache duration in hours
//   localStorage.setItem(`${key}Expiration`, expirationTime);
// }

// // Fetch daily energy usage with caching and retry logic
// async function fetchDailyEnergyUsage(retryCount = 3) {
//   const cacheKey = "dailyEnergyUsage";
//   const cachedData = getCachedData(cacheKey);

//   if (cachedData) {
//     return cachedData;
//   }

//   for (let attempt = 1; attempt <= retryCount; attempt++) {
//     try {
//       const response = await fetch(`${url}/api/daily-energy-usage`);

//       // Check if the response is ok (status in the range 200-299)
//       if (!response.ok) {
//         throw new Error(
//           `Error fetching daily energy usage: ${response.statusText}`
//         );
//       }

//       const data = await response.json();
//       setCache(cacheKey, data); // Cache the data
//       return data;
//     } catch (error) {
//       console.error(`Attempt ${attempt} failed: ${error.message}`);

//       // If the maximum number of attempts has been reached, return null
//       if (attempt === retryCount) {
//         return null; // Or handle the error as you prefer
//       }
//     }
//   }
// }

// // Fetch monthly energy usage with caching and retry logic
// async function fetchMonthlyEnergyUsage(retryCount = 3) {
//   const cacheKey = "monthlyEnergyUsage";
//   const cachedData = getCachedData(cacheKey);

//   if (cachedData) {
//     return cachedData;
//   }

//   for (let attempt = 1; attempt <= retryCount; attempt++) {
//     try {
//       const response = await fetch(`${url}/api/monthly-energy-usage`);

//       if (!response.ok) {
//         throw new Error(
//           `Error fetching monthly energy usage: ${response.statusText}`
//         );
//       }

//       const data = await response.json();
//       setCache(cacheKey, data); // Cache the data
//       return data;
//     } catch (error) {
//       console.error(`Attempt ${attempt} failed: ${error.message}`);

//       // If the maximum number of attempts has been reached, return null
//       if (attempt === retryCount) {
//         return null; // Or handle the error as you prefer
//       }
//     }
//   }
// }

// // Fetch daily energy usage per room with caching and retry logic
// async function fetchDailyEnergyUsagePerRoom(retryCount = 3) {
//   const cacheKey = "dailyEnergyUsagePerRoom";
//   const cachedData = getCachedData(cacheKey);

//   if (cachedData) {
//     return cachedData;
//   }

//   for (let attempt = 1; attempt <= retryCount; attempt++) {
//     try {
//       const response = await fetch(
//         `http://localhost:5555/api/daily-energy-usage-per-room`
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Error fetching daily energy usage per room: ${response.statusText}`
//         );
//       }

//       const data = await response.json();
//       setCache(cacheKey, data); // Cache the data
//       return data;
//     } catch (error) {
//       console.error(`Attempt ${attempt} failed: ${error.message}`);

//       // If the maximum number of attempts has been reached, return null
//       if (attempt === retryCount) {
//         return null; // Or handle the error as you prefer
//       }
//     }
//   }
// }

// // Render the charts
// async function renderCharts() {
//   const dailyEnergyUsage = await fetchDailyEnergyUsage(); // Should return an array of 31 elements
//   const monthlyEnergyUsage = await fetchMonthlyEnergyUsage(); // This remains unchanged

//   // Render Daily Energy Usage Chart for the last 31 days
//   const dailyChartContext = document
//     .getElementById("dailyenergy")
//     .getContext("2d");

//   // Create labels for the last 31 days
//   const labels = Array.from({ length: 31 }, (_, i) => {
//     const date = new Date();
//     date.setDate(date.getDate() - (30 - i)); // Adjust for the last 31 days
//     return date.toLocaleDateString("en-US"); // Format the date as needed
//   });

//   new Chart(dailyChartContext, {
//     type: "line",
//     data: {
//       labels: labels, // Set labels for the last 31 days
//       datasets: [
//         {
//           label: "Energy Usage (kWh)",
//           data: dailyEnergyUsage, // Array with 31 daily values
//           borderColor: "rgba(75, 192, 192, 1)",
//           backgroundColor: "rgba(75, 192, 192, 0.2)",
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//         },
//       },
//     },
//   });

//   // Render Monthly Energy Usage Chart
//   const monthlyChartContext = document
//     .getElementById("monthlyenergy")
//     .getContext("2d");
//   new Chart(monthlyChartContext, {
//     type: "bar",
//     data: {
//       labels: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ],
//       datasets: [
//         {
//           label: "Energy Usage (kWh)",
//           data: monthlyEnergyUsage,
//           backgroundColor: "rgba(153, 102, 255, 0.2)",
//           borderColor: "rgba(153, 102, 255, 1)",
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//         },
//       },
//     },
//   });
// }

// async function renderDeviceCharts() {
//   const energyUsageData = await fetchDailyEnergyUsagePerRoom();
//   const deviceChartsContainer = document.getElementById("deviceCharts");
//   // Create an array for the last 31 days
//   const labels = [];
//   const today = new Date();

//   // Generate labels for the last 31 days
//   for (let i = 30; i >= 0; i--) {
//     const date = new Date(today);
//     date.setDate(today.getDate() - i);
//     labels.push(date.toLocaleDateString("en-US")); // Use 'en-US' or customize as needed
//   }

//   Object.keys(energyUsageData).forEach((deviceName) => {
//     const deviceCard = document.createElement("div");
//     deviceCard.className = "col-md-6";
//     deviceCard.innerHTML = `
//       <div class="card">
//         <div class="content">
//           <div class="head">
//             <h5 class="mb-0">${deviceName} Overview</h5>
//             <p class="text-muted">Daily energy usage data</p>
//           </div>
//           <div class="canvas-wrapper">
//             <canvas class="chart" id="${deviceName.replace(
//               " ",
//               "_"
//             )}_chart"></canvas>
//           </div>
//         </div>
//       </div>
//     `;

//     deviceChartsContainer.appendChild(deviceCard);

//     const ctx = document
//       .getElementById(`${deviceName.replace(" ", "_")}_chart`)
//       .getContext("2d");

//     // Ensure energyUsageData[deviceName] is an array of daily usage values for the last 31 days.
//     const dailyUsage = energyUsageData[deviceName]; // Should be an array of 31 elements.

//     if (dailyUsage && dailyUsage.length === 31) {
//       new Chart(ctx, {
//         type: "bar",
//         data: {
//           labels: labels, // Set the x-axis labels to the last 31 days
//           datasets: [
//             {
//               label: "Energy Usage (kWh)",
//               data: dailyUsage, // Use the daily usage data for the last 31 days
//               backgroundColor: "rgba(75, 192, 192, 0.6)",
//               borderColor: "rgba(75, 192, 192, 1)",
//               borderWidth: 1,
//             },
//           ],
//         },
//         options: {
//           scales: {
//             y: {
//               beginAtZero: true,
//               title: {
//                 display: true,
//                 text: "Energy Usage (kWh)",
//               },
//             },
//             x: {
//               title: {
//                 display: true,
//                 text: "Days",
//               },
//             },
//           },
//         },
//       });
//     } else {
//       console.error(`Missing or invalid data for device: ${deviceName}`);
//     }
//   });
// }

// // Call both render functions when the page loads
// window.onload = async () => {
//   await renderCharts();
//   await renderDeviceCharts();
// };

const url = window.env.URL;

// Utility function to get cached data if it exists and is valid
function getCachedData(key) {
  const cached = localStorage.getItem(key);
  const expiration = localStorage.getItem(`${key}Expiration`);
  if (cached && expiration && Date.now() < expiration) {
    return JSON.parse(cached);
  }
  return null;
}

function setCache(key, data, minutesToExpire = 1) {
  localStorage.setItem(key, JSON.stringify(data));
  const expirationTime = Date.now() + minutesToExpire * 60 * 1000; // Cache duration in minutes
  localStorage.setItem(`${key}Expiration`, expirationTime);
}

// Fetch energy usage summary with caching and retry logic
async function fetchEnergyUsageSummary(retryCount = 3) {
  const cacheKey = "energyUsageSummary";
  const cachedData = getCachedData(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      const response = await fetch(`${url}/api/energy-usage-summary`);

      if (!response.ok) {
        throw new Error(
          `Error fetching energy usage summary: ${response.statusText}`
        );
      }

      const data = await response.json();
      setCache(cacheKey, data); // Cache the data
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt === retryCount) {
        return null; // Or handle the error as you prefer
      }
    }
  }
}

// Render the charts
async function renderCharts() {
  const energyUsageSummary = await fetchEnergyUsageSummary();

  if (!energyUsageSummary) {
    console.error("Failed to load energy usage summary.");
    return;
  }

  const {
    dailyEnergyUsage,
    monthlyEnergyUsage,
    dailyEnergyUsagePerRoom,
    consumptionSummary,
  } = energyUsageSummary;

  // Update DOM for the consumption summary
  document.getElementById("todays-consumption").textContent =
    consumptionSummary.todaysConsumption;
  document.getElementById("yesterdays-consumption").textContent =
    consumptionSummary.yesterdaysConsumption;
  document.getElementById("this-months-consumption").textContent =
    consumptionSummary.thisMonthsConsumption;
  document.getElementById("running-devices-count").textContent =
    consumptionSummary.runningDevicesCount;

  // Render Daily Energy Usage Chart
  const dailyChartContext = document
    .getElementById("dailyenergy")
    .getContext("2d");
  const labels = Array.from({ length: 31 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i)); // Adjust for the last 31 days
    return date.toLocaleDateString("en-US");
  });

  new Chart(dailyChartContext, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Energy Usage (kWh)",
          data: dailyEnergyUsage,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  // Render Monthly Energy Usage Chart
  const monthlyChartContext = document
    .getElementById("monthlyenergy")
    .getContext("2d");
  new Chart(monthlyChartContext, {
    type: "bar",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Energy Usage (kWh)",
          data: monthlyEnergyUsage,
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: { y: { beginAtZero: true } },
    },
  });

  // Render Device-specific Charts
  const deviceChartsContainer = document.getElementById("deviceCharts");
  Object.keys(dailyEnergyUsagePerRoom).forEach((deviceName) => {
    const deviceCard = document.createElement("div");
    deviceCard.className = "col-md-6";
    deviceCard.innerHTML = `
      <div class="card">
        <div class="content">
          <div class="head">
            <h5 class="mb-0">${deviceName} Overview</h5>
            <p class="text-muted">Daily energy usage data</p>
          </div>
          <div class="canvas-wrapper">
            <canvas class="chart" id="${deviceName.replace(
              " ",
              "_"
            )}_chart"></canvas>
          </div>
        </div>
      </div>
    `;
    deviceChartsContainer.appendChild(deviceCard);

    const ctx = document
      .getElementById(`${deviceName.replace(" ", "_")}_chart`)
      .getContext("2d");
    const dailyUsage = dailyEnergyUsagePerRoom[deviceName];

    if (dailyUsage && dailyUsage.length === 31) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Energy Usage (kWh)",
              data: dailyUsage,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Energy Usage (kWh)" },
            },
            x: { title: { display: true, text: "Days" } },
          },
        },
      });
    }
  });
}

// Call the render function when the page loads
window.onload = async () => {
  await renderCharts();
};
