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
//   const dailyEnergyUsage = await fetchDailyEnergyUsage();
//   const monthlyEnergyUsage = await fetchMonthlyEnergyUsage();

//   // Render Daily Energy Usage Chart
//   const dailyChartContext = document
//     .getElementById("trafficflow")
//     .getContext("2d");
//   const dailyChart = new Chart(dailyChartContext, {
//     type: "line", // or 'bar'
//     data: {
//       labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), // Hour labels
//       datasets: [
//         {
//           label: "Energy Usage (kWh)",
//           data: dailyEnergyUsage,
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
//   const monthlyChartContext = document.getElementById("sales").getContext("2d");
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
//   deviceChartsContainer.innerHTML = ""; // Clear any existing charts

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

// var trafficchart = document.getElementById("trafficflow");
// var saleschart = document.getElementById("sales");

// // new
// // Generate random data for daily kWh usage
// function getRandomData(days) {
//   let data = [];
//   for (let i = 0; i < days; i++) {
//     data.push(Math.floor(Math.random() * 100) + 50); // Random value between 50 and 150 kWh
//   }
//   return data;
// }

// var myChart1 = new Chart(trafficchart, {
//   type: "line",
//   data: {
//     labels: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`), // Labels for 31 days
//     datasets: [
//       {
//         data: getRandomData(31), // Random data for each day
//         backgroundColor: "rgba(48, 164, 255, 0.2)",
//         borderColor: "rgba(48, 164, 255, 0.8)",
//         fill: true,
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     animation: {
//       duration: 2000,
//       easing: "easeOutQuart",
//     },
//     plugins: {
//       legend: {
//         display: false,
//         position: "right",
//       },
//       title: {
//         display: true,
//         text: "Daily kWh Usage",
//         position: "left",
//       },
//     },
//   },
// });

// // new
// var myChart2 = new Chart(saleschart, {
//   type: "bar",
//   data: {
//     labels: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     datasets: [
//       {
//         label: "kWh Usage",
//         data: [
//           "300",
//           "320",
//           "450",
//           "600",
//           "500",
//           "480",
//           "550",
//           "620",
//           "500",
//           "700",
//           "800",
//           "900",
//         ], // kWh usage data for each month
//         backgroundColor: "rgba(76, 175, 80, 0.5)",
//         borderColor: "#6da252",
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     animation: {
//       duration: 2000,
//       easing: "easeOutQuart",
//     },
//     plugins: {
//       legend: {
//         display: false,
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: "Monthly kWh Usage",
//         position: "left",
//       },
//     },
//   },
// });

// // Chart for Room 1
// var room1Chart = new Chart(document.getElementById("room1Chart"), {
//   type: "line",
//   data: {
//     labels: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
//     datasets: [
//       {
//         label: "Room 1",
//         data: getRandomData(31), // Random data for Room 1
//         backgroundColor: "rgba(255, 99, 132, 0.2)",
//         borderColor: "rgba(255, 99, 132, 0.8)",
//         fill: true,
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     animation: {
//       duration: 2000,
//       easing: "easeOutQuart",
//     },
//     plugins: {
//       legend: {
//         display: false,
//         position: "right",
//       },
//       title: {
//         display: true,
//         text: "Daily kWh Usage - Room 1",
//         position: "left",
//       },
//     },
//   },
// });

// // Chart for Room 2
// var room2Chart = new Chart(document.getElementById("room2Chart"), {
//   type: "line",
//   data: {
//     labels: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
//     datasets: [
//       {
//         label: "Room 2",
//         data: getRandomData(31), // Random data for Room 2
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         borderColor: "rgba(54, 162, 235, 0.8)",
//         fill: true,
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     animation: {
//       duration: 2000,
//       easing: "easeOutQuart",
//     },
//     plugins: {
//       legend: {
//         display: false,
//         position: "right",
//       },
//       title: {
//         display: true,
//         text: "Daily kWh Usage - Room 2",
//         position: "left",
//       },
//     },
//   },
// });

// // Chart for Room 3
// var room3Chart = new Chart(document.getElementById("room3Chart"), {
//   type: "line",
//   data: {
//     labels: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
//     datasets: [
//       {
//         label: "Room 3",
//         data: getRandomData(31), // Random data for Room 3
//         backgroundColor: "rgba(255, 206, 86, 0.2)",
//         borderColor: "rgba(255, 206, 86, 0.8)",
//         fill: true,
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     animation: {
//       duration: 2000,
//       easing: "easeOutQuart",
//     },
//     plugins: {
//       legend: {
//         display: false,
//         position: "right",
//       },
//       title: {
//         display: true,
//         text: "Daily kWh Usage - Room 3",
//         position: "left",
//       },
//     },
//   },
// });

// // Chart for Room 4
// var room4Chart = new Chart(document.getElementById("room4Chart"), {
//   type: "line",
//   data: {
//     labels: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
//     datasets: [
//       {
//         label: "Room 4",
//         data: getRandomData(31), // Random data for Room 4
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         borderColor: "rgba(75, 192, 192, 0.8)",
//         fill: true,
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     animation: {
//       duration: 2000,
//       easing: "easeOutQuart",
//     },
//     plugins: {
//       legend: {
//         display: false,
//         position: "right",
//       },
//       title: {
//         display: true,
//         text: "Daily kWh Usage - Room 4",
//         position: "left",
//       },
//     },
//   },
// });
