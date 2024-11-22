// (function () {
//   "use strict";

//   $("#dataTables-example").DataTable({
//     responsive: true,
//     pageLength: 20,
//     lengthChange: false,
//     searching: true,
//     ordering: true,
//     order: [[1, "asc"]], // Set default ordering on the second column (index 1)
//     columnDefs: [
//       { orderable: false, targets: 0 }, // Disable ordering on the first column (index 0)
//     ],
//   });
// })();

// (function () {
//   "use strict";

//   var table = $("#dataTables-example").DataTable({
//     responsive: true,
//     pageLength: 20,
//     lengthChange: false,
//     searching: true,
//     ordering: true,
//     order: [[1, "asc"]], // Set default ordering on the second column (index 1)
//     columnDefs: [
//       { orderable: false, targets: 0 }, // Disable ordering on the first column (index 0)
//     ],
//   });

//   // Prepend the Delete Selected button and the dropdown filter
//   $("#dataTables-example_wrapper div:first div:first").prepend(`
//     <button
//       id="deleteSelected"
//       class="btn btn-sm btn-outline-danger"
//       style="display: none;"
//     >
//       <i class="fas fa-trash"></i>
//       Delete Selected
//     </button>
// `);

//   // Handle row checkbox changes
//   $("#dataTables-example tbody").on("change", "input.rowCheckbox", function () {
//     // Check if any checkboxes are checked
//     var anyChecked =
//       $("#dataTables-example tbody input.rowCheckbox:checked").length > 0;
//     $("#deleteSelected").toggle(anyChecked); // Show/hide delete button

//     // If all checkboxes are checked, check the selectAll checkbox
//     var allChecked =
//       $("#dataTables-example tbody input.rowCheckbox").length ===
//       $("#dataTables-example tbody input.rowCheckbox:checked").length;
//     $("#selectAll").prop("checked", allChecked);
//   });

//   // Handle "Select All" checkbox in the header
//   $("#selectAll").on("change", function () {
//     var checked = this.checked; // Get the checked status
//     $("#dataTables-example tbody input.rowCheckbox")
//       .prop("checked", checked)
//       .trigger("change"); // Check/uncheck all checkboxes
//   });

//   // Handle the delete selected button click event
//   $("#deleteSelected").on("click", function () {
//     // Loop through all rows and remove checked ones
//     $("#dataTables-example tbody input.rowCheckbox:checked").each(function () {
//       var row = table.row($(this).closest("tr")); // Get the DataTable row
//       row.remove(); // Remove the row
//     });
//     table.draw(); // Redraw the table
//     $(this).hide(); // Hide the delete button
//   });
// })();

// (function () {
//   "use strict";

//   // Initialize the DataTable
//   var table = $("#dataTables-example").DataTable({
//     responsive: true,
//     pageLength: 20,
//     lengthChange: false,
//     searching: true,
//     ordering: true,
//     order: [[1, "asc"]], // Set default ordering on the second column (index 1)
//     columnDefs: [
//       { orderable: false, targets: 0 }, // Disable ordering on the first column (index 0)
//       { visible: false, targets: 2 }, // Hide the 'id' column (index 2)
//     ],
//     ajax: {
//       url: "http://127.0.0.1:5555/api/sensors", // Your API endpoint
//       dataSrc: function (json) {
//         return json.data; // Assuming your API returns an object with a data array
//       },
//     },
//     columns: [
//       {
//         data: null,
//         render: function () {
//           return '<input type="checkbox" class="rowCheckbox" />';
//         },
//       },
//       {
//         data: "timestamp",
//         render: function (data) {
//           const date = new Date(data); // Convert timestamp to Date object
//           return date.toLocaleString(); // Format date and time according to locale
//         },
//       },
//       { data: "id" }, // The id column, hidden via columnDefs
//       { data: "deviceName" },
//       { data: "voltage" },
//       { data: "current" },
//       { data: "activePower" },
//       { data: "energy" },
//       { data: "frequency" },
//       { data: "powerFactor" },
//     ],
//   });

//   // Prepend the Delete Selected button
//   $("#dataTables-example_wrapper div:first div:first").prepend(`
//     <button id="deleteSelected" class="btn btn-sm btn-outline-danger" style="display: none;">
//       <i class="fas fa-trash"></i> Delete Selected
//     </button>
//   `);

//   // Utility function to update the Delete button visibility
//   function toggleDeleteButton() {
//     var anyChecked =
//       $("#dataTables-example tbody input.rowCheckbox:checked").length > 0;
//     $("#deleteSelected").toggle(anyChecked); // Show/hide delete button
//   }

//   // Handle row checkbox changes
//   $("#dataTables-example tbody").on("change", "input.rowCheckbox", function () {
//     toggleDeleteButton();

//     // Check if all checkboxes are checked
//     var allChecked =
//       $("#dataTables-example tbody input.rowCheckbox").length ===
//       $("#dataTables-example tbody input.rowCheckbox:checked").length;
//     $("#selectAll").prop("checked", allChecked);
//   });

//   // Handle "Select All" checkbox in the header
//   $("#selectAll").on("change", function () {
//     var checked = this.checked; // Get the checked status
//     $("#dataTables-example tbody input.rowCheckbox")
//       .prop("checked", checked)
//       .trigger("change"); // Check/uncheck all checkboxes
//   });

//   // Confirm deletion function
//   function confirmDeletion(selectedRows, successCallback) {
//     if (confirm("Are you sure you want to delete the selected data?")) {
//       // Send the DELETE request with selected rows
//       $.ajax({
//         url: "http://127.0.0.1:5555/api/sensors", // Your delete API endpoint
//         type: "DELETE",
//         contentType: "application/json",
//         data: JSON.stringify(selectedRows), // Send the data in JSON format
//         success: function (response) {
//           successCallback(response);
//         },
//         error: function (error) {
//           console.error("Delete failed:", error);
//           alert("Failed to delete selected data.");
//         },
//       });
//     }
//   }

//   // Handle the delete selected button click event
//   $("#deleteSelected").on("click", function () {
//     var selectedRows = [];

//     // Collect data for selected rows (e.g., timestamp and deviceName)
//     $("#dataTables-example tbody input.rowCheckbox:checked").each(function () {
//       var row = table.row($(this).closest("tr"));
//       var rowData = row.data();
//       // Convert 'timestamp' to 'time' and 'deviceName' to '1_device_name'
//       selectedRows.push({
//         "0_id": rowData.id, // Include the 'id'
//         "1_device_name": rowData.deviceName, // Properly map 'deviceName' to '1_device_name' if that's how it's named in the database
//         time: rowData.timestamp, // Include timestamp for reference if needed
//       });
//     });

//     // If there are no selected rows, return
//     if (selectedRows.length === 0) return;

//     // Confirm deletion before proceeding
//     confirmDeletion(selectedRows, function (response) {
//       console.log("Delete success:", response);
//       // Remove the selected rows from the table
//       $("#dataTables-example tbody input.rowCheckbox:checked").each(
//         function () {
//           var row = table.row($(this).closest("tr")); // Get the DataTable row
//           row.remove(); // Remove the row
//         }
//       );
//       table.draw(); // Redraw the table
//       $("#deleteSelected").hide(); // Hide the delete button
//     });
//   });

//   // Ensure select all checkbox is unchecked when the table is reloaded
//   table.on("draw", function () {
//     $("#selectAll").prop("checked", false); // Uncheck "Select All" on reload/filter
//   });
// })();
