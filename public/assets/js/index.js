// $(document).ready(function () {
//   // Fetch consumption summary on page load
//   $.ajax({
//     url: "http://127.0.0.1:5555/api/consumption-summary",
//     method: "GET",
//     success: function (data) {
//       // Populate the HTML elements with the response data
//       $("#todays-consumption").text(data.todaysConsumption);
//       $("#yesterdays-consumption").text(data.yesterdaysConsumption);
//       $("#this-months-consumption").text(data.thisMonthsConsumption);
//       $("#running-devices-count").text(data.runningDevicesCount);
//     },
//     error: function (xhr) {
//       console.error("Error fetching consumption summary:", xhr);
//       alert("Failed to retrieve consumption summary.");
//     },
//   });
// });

// $(document).ready(function () {
//   // Define a function to update the DOM with the data
//   function updateDOM(data) {
//     $("#todays-consumption").text(data.todaysConsumption);
//     $("#yesterdays-consumption").text(data.yesterdaysConsumption);
//     $("#this-months-consumption").text(data.thisMonthsConsumption);
//     $("#running-devices-count").text(data.runningDevicesCount);
//   }

//   // Check if data is cached in localStorage
//   const cachedData = localStorage.getItem("consumptionSummary");

//   if (cachedData) {
//     // Parse the cached data and update the DOM
//     updateDOM(JSON.parse(cachedData));
//   }

//   // Fetch consumption summary from API
//   $.ajax({
//     url: "http://127.0.0.1:5555/api/consumption-summary",
//     method: "GET",
//     success: function (data) {
//       // Update the DOM with fresh data
//       updateDOM(data);

//       // Cache the data in localStorage
//       localStorage.setItem("consumptionSummary", JSON.stringify(data));

//       // Optionally, you can set an expiration for the cache (e.g., 24 hours)
//       const expiration = Date.now() + 24 * 60 * 60 * 1000;
//       localStorage.setItem("consumptionSummaryExpiration", expiration);
//     },
//     error: function (xhr) {
//       console.error("Error fetching consumption summary:", xhr);
//     },
//   });
// });

// $(document).ready(function () {
//   const url = window.env.URL;
//   // Define a function to update the DOM with the data
//   function updateDOM(data) {
//     try {
//       $("#todays-consumption").text(data.todaysConsumption);
//       $("#yesterdays-consumption").text(data.yesterdaysConsumption);
//       $("#this-months-consumption").text(data.thisMonthsConsumption);
//       $("#running-devices-count").text(data.runningDevicesCount);
//     } catch (error) {
//       console.error("Error updating DOM:", error);
//     }
//   }

//   // Check if data is cached in localStorage
//   try {
//     const cachedData = localStorage.getItem("consumptionSummary");

//     if (cachedData) {
//       // Parse the cached data and update the DOM
//       updateDOM(JSON.parse(cachedData));
//     }
//   } catch (error) {
//     console.error("Error retrieving or parsing cached data:", error);
//   }

//   // Fetch consumption summary from API
//   $.ajax({
//     url: `${url}/api/consumption-summary`,
//     method: "GET",
//     success: function (data) {
//       try {
//         // Update the DOM with fresh data
//         updateDOM(data);

//         // Cache the data in localStorage
//         localStorage.setItem("consumptionSummary", JSON.stringify(data));

//         // Optionally, you can set an expiration for the cache (e.g., 24 hours)
//         const expiration = Date.now() + 24 * 60 * 60 * 1000;
//         localStorage.setItem("consumptionSummaryExpiration", expiration);
//       } catch (error) {
//         console.error("Error processing fetched data:", error);
//       }
//     },
//     error: function (xhr) {
//       console.error("Error fetching consumption summary:", xhr);
//     },
//   });
// });
