$(document).ready(function () {
  "use strict";
  const url = window.env.URL; // Your API endpoint
  let table; // Declare a variable for the DataTable instance

  function initializeDataTable() {
    showLoadingModal("Loading Data Please Wait...");
    table = $("#dataTables-example").DataTable({
      responsive: true,
      pageLength: 20,
      lengthChange: false,
      searching: true,
      ordering: true,
      order: [[1, "asc"]], // Set default ordering on the second column (index 1)
      columnDefs: [
        { orderable: false, targets: 0 }, // Disable ordering on the first column (index 0)
        { visible: false, targets: 2 }, // Hide the 'id' column (index 2)
      ],
      ajax: {
        url: `${url}/api/sensors`, // Your API endpoint
        dataSrc: function (json) {
          hideLoadingModal();
          return json.data; // Assuming your API returns an object with a data array
        },
      },
      columns: [
        {
          data: null,
          render: function () {
            return '<input type="checkbox" class="rowCheckbox" />'; // Checkbox for row selection
          },
        },
        { data: "timestamp" }, // The id column, hidden via columnDefs
        { data: "id" }, // The id column, hidden via columnDefs
        { data: "deviceName" },
        { data: "voltage" },
        { data: "current" },
        { data: "activePower" },
        { data: "energy" },
        { data: "frequency" },
        { data: "powerFactor" },
      ],
    });
  }

  initializeDataTable();
  // Prepend the Delete Selected button
  $("#dataTables-example_wrapper div:first div:first").prepend(`
    <button id="deleteSelected" class="btn btn-sm btn-outline-danger" style="display: none;">
      <i class="fas fa-trash"></i> Delete Selected
    </button>
  `);

  // Utility function to update the Delete button visibility
  function toggleDeleteButton() {
    var anyChecked =
      $("#dataTables-example tbody input.rowCheckbox:checked").length > 0;
    $("#deleteSelected").toggle(anyChecked); // Show/hide delete button
  }

  // Handle row checkbox changes
  $("#dataTables-example tbody").on("change", "input.rowCheckbox", function () {
    toggleDeleteButton();

    // Check if all checkboxes are checked
    var allChecked =
      $("#dataTables-example tbody input.rowCheckbox").length ===
      $("#dataTables-example tbody input.rowCheckbox:checked").length;
    $("#selectAll").prop("checked", allChecked);
  });

  // Handle "Select All" checkbox in the header
  $("#selectAll").on("change", function () {
    var checked = this.checked; // Get the checked status
    $("#dataTables-example tbody input.rowCheckbox")
      .prop("checked", checked)
      .trigger("change"); // Check/uncheck all checkboxes
  });

  // // Confirm deletion function
  // function confirmDeletion(selectedRows, successCallback) {
  //   if (confirm("Are you sure you want to delete the selected data?")) {
  //     // Send the DELETE request with selected rows
  //     $.ajax({
  //       url: `${url}/api/sensors`, // Your delete API endpoint
  //       type: "DELETE",
  //       contentType: "application/json",
  //       data: JSON.stringify(selectedRows), // Send the data in JSON format
  //       success: function (response) {
  //         successCallback(response);
  //       },
  //       error: function (error) {
  //         console.error("Delete failed:", error);
  //         alert("Failed to delete selected data.");
  //       },
  //     });
  //   }
  // }

  function confirmDeletion(selectedRows, successCallback) {
    // Show the Bootstrap confirmation modal
    $("#deleteConfirmationModal").modal("show");

    // Handle the delete button click
    $("#confirmDeleteButton2")
      .off("click")
      .on("click", function () {
        // Send the DELETE request with selected rows
        $.ajax({
          url: `${url}/api/sensors`, // Your delete API endpoint
          type: "DELETE",
          contentType: "application/json",
          data: JSON.stringify(selectedRows), // Send the data in JSON format
          success: function (response) {
            successCallback(response);
            // Close the modal after successful deletion
            $("#deleteConfirmationModal").modal("hide");
          },
          error: function (error) {
            console.error("Delete failed:", error);
            // alert("Failed to delete selected data.");
            // Close the modal if an error occurs
            $("#deleteConfirmationModal").modal("hide");
          },
        });
      });
  }

  // Handle the delete selected button click event
  $("#deleteSelected").on("click", function () {
    var selectedRows = [];

    // Collect data for selected rows
    $("#dataTables-example tbody input.rowCheckbox:checked").each(function () {
      var row = table.row($(this).closest("tr"));
      var rowData = row.data();
      selectedRows.push({
        id: rowData.id, // Include the 'id'
        device_name: rowData.deviceName, // Map 'deviceName'
        time: rowData.timestamp, // Include timestamp for reference if needed
      });
    });

    // If there are no selected rows, return
    if (selectedRows.length === 0) return;

    // Confirm deletion before proceeding
    confirmDeletion(selectedRows, function (response) {
      console.log("Delete success:", response);
      // Remove the selected rows from the table
      $("#dataTables-example tbody input.rowCheckbox:checked").each(
        function () {
          var row = table.row($(this).closest("tr")); // Get the DataTable row
          row.remove(); // Remove the row
        }
      );
      table.draw(); // Redraw the table
      $("#deleteSelected").hide(); // Hide the delete button
    });
  });

  // Ensure select all checkbox is unchecked when the table is reloaded
  table.on("draw", function () {
    $("#selectAll").prop("checked", false); // Uncheck "Select All" on reload/filter
  });

  // Initialize datepicker
  $(".datepicker-here").datepicker({
    autoClose: true,
    multipleDatesSeparator: "-",
  });

  $("#filterButton").click(function () {
    const deviceName = $("#deviceDropdown").val(); // Get selected device name
    const dateRange = $("#dateRangePicker").val(); // Get date range input
    const selectedTimeframe = $("#timeframeDropdown").val(); // Get selected timeframe
    let singleDate = null;
    let startDate = null;
    let endDate = null;

    console.log("Filtering data for Device Name:", deviceName);
    console.log("Date Range:", dateRange);
    console.log("Selected Time Frame:", selectedTimeframe);

    if (dateRange) {
      const dates = dateRange.split("-").map((date) => new Date(date.trim())); // Split and parse dates

      // If a single date is provided
      if (dates.length === 1) {
        singleDate = dates[0];
        singleDate.setDate(singleDate.getDate() + 1); // Add 1 day
        singleDate = singleDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
        console.log(singleDate);
      }
      // If a range of dates is provided
      else if (dates.length === 2) {
        startDate = dates[0];
        endDate = dates[1];

        startDate = startDate.toISOString(); // Format start date to ISO string
        endDate = endDate.toISOString(); // Format end date to ISO string
      }
    }

    // Prepare the query parameters for the API call with the specified order
    const queryParams = {
      period: selectedTimeframe || "",
      deviceName: deviceName || "",
      startDate: startDate || "",
      endDate: endDate || "",
      singleDate: singleDate || "",
    };

    showLoadingModal("Processing your request...");

    // Fetch data from the backend
    fetch(`${url}/api/sensors?${new URLSearchParams(queryParams).toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        table.clear();
        for (const row of data.data) {
          table.row.add({
            timestamp: row.timestamp,
            id: row.id,
            deviceName: row.deviceName,
            voltage: row.voltage,
            current: row.current,
            activePower: row.activePower,
            energy: row.energy,
            frequency: row.frequency,
            powerFactor: row.powerFactor,
          });
        }

        // Draw the updated table
        hideLoadingModal();
        table.draw();
      })
      .catch((error) => {
        console.error("Error:", error.message || "An error occurred");
      });

    // Clear existing filters in DataTable
    table.search("").columns().search("").draw();
  });

  // // Define the function to check filter criteria
  // function checkFilterCriteria() {
  //   const deviceName = $("#deviceDropdown").val();
  //   const dateRange = $("#dateRangePicker").val();
  //   const selectedTimeframe = $("#timeframeDropdown").val();
  //   return deviceName !== "" || dateRange !== "" || selectedTimeframe !== "";
  // }

  // // Define the function to toggle action buttons
  // function toggleActionButtons(isEnabled) {
  //   $("#deleteButton").prop("disabled", !isEnabled);
  //   $("#exportButton").prop("disabled", !isEnabled);
  //   $("#deleteSelected").prop("disabled", !isEnabled);
  //   $("#actionDropdownButton").prop("disabled", !isEnabled);
  // }

  // // Event listeners to check filtering criteria on input changes
  // $("#deviceDropdown, #dateRangePicker, #timeframeDropdown").change(
  //   function () {
  //     toggleActionButtons(checkFilterCriteria());
  //   }
  // );
  // Event listener for the export button in the dropdown
  // Event listener for the export button in the dropdown
  $("#exportButton").click(function () {
    console.log("Exporting data...");

    // Gather data to export from the filtered rows
    var dataToExport = [];
    table.rows({ filter: "applied" }).every(function () {
      var rowData = this.data();
      // Push only the necessary fields to the export array
      dataToExport.push([
        `"${rowData.timestamp}"`, // Wrap in quotes
        `"${rowData.deviceName}"`, // Wrap in quotes
        `"${rowData.voltage}"`, // Wrap in quotes
        `"${rowData.current}"`, // Wrap in quotes
        `"${rowData.activePower}"`, // Wrap in quotes
        `"${rowData.energy}"`, // Wrap in quotes
        `"${rowData.frequency}"`, // Wrap in quotes
        `"${rowData.powerFactor}"`, // Wrap in quotes
      ]);
    });

    // Convert data to CSV format
    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "Timestamp,Device Name,Voltage,Current,Active Power,Energy,Frequency,Power Factor\n"; // CSV Header

    // Add rows to CSV content
    dataToExport.forEach(function (rowArray) {
      let row = rowArray.join(","); // Convert row array to CSV format
      csvContent += row + "\n";
    });

    // Create a link to download the CSV file
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exported_data.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up

    console.log("Data exported successfully.");
  });

  // Click event for the delete button to delete filtered data in the table
  // $("#deleteButton").click(function () {
  //   // Gather all filtered rows to delete
  //   const rowsToDelete = [];

  //   // Get the currently visible rows after filtering
  //   table.rows({ filter: "applied" }).every(function () {
  //     const rowData = this.data(); // Get data from the current row
  //     if (rowData) {
  //       rowsToDelete.push({
  //         id: rowData.id, // Use the correct field for ID
  //         device_name: rowData.deviceName, // Use the correct field for device name
  //       });
  //     }
  //   });

  //   // If there are rows to delete, send a delete request
  //   if (rowsToDelete.length > 0) {
  //     // Send DELETE request to the backend
  //     fetch(`${url}/api/sensors`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(rowsToDelete),
  //     })
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error(`HTTP error! status: ${response.status}`);
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         console.log("Delete Response:", data);
  //         // Remove filtered rows from the DataTable
  //         for (const row of rowsToDelete) {
  //           // Remove the row from the DataTable
  //           table.rows((idx, data) => data.id === row["0_id"]).remove();
  //         }
  //         table.draw(); // Redraw the DataTable
  //         alert("Selected data deleted successfully.");
  //       })
  //       .catch((error) => {
  //         console.error("Error deleting data:", error.message);
  //         alert("Failed to delete data. Please try again.");
  //       });
  //   } else {
  //     alert("No rows to delete.");
  //   }
  // });
  $("#deleteButton").click(function () {
    // Gather all filtered rows to delete
    const rowsToDelete = [];

    // Get the currently visible rows after filtering
    table.rows({ filter: "applied" }).every(function () {
      const rowData = this.data(); // Get data from the current row
      if (rowData) {
        rowsToDelete.push({
          id: rowData.id, // Use the correct field for ID
          device_name: rowData.deviceName, // Use the correct field for device name
        });
      }
    });

    // If there are rows to delete, show the confirmation modal
    if (rowsToDelete.length > 0) {
      // Open the confirmation modal
      $("#confirmationModal").modal("show");

      // If the user confirms the deletion
      $("#confirmDeleteButton").click(function () {
        // Send DELETE request to the backend
        fetch(`${url}/api/sensors`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rowsToDelete),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Delete Response:", data);
            // Remove filtered rows from the DataTable
            for (const row of rowsToDelete) {
              // Remove the row from the DataTable
              table.rows((idx, data) => data.id === row.id).remove();
            }
            table.draw(); // Redraw the DataTable
            // alert("Selected data deleted successfully.");
          })
          .catch((error) => {
            console.error("Error deleting data:", error.message);
            // alert("Failed to delete data. Please try again.");
          })
          .finally(() => {
            // Close the modal after the operation
            $("#confirmationModal").modal("hide");
          });
      });

      // If the user cancels, just close the modal
      $("#confirmationModal").on("hidden.bs.modal", function () {
        // Optionally reset or clear any selections if needed
      });
    } else {
      alert("No rows to delete.");
    }
  });

  // Function to show the loading modal with jQuery
  function showLoadingModal(message = "Loading, please wait...") {
    // Set the loading message
    $("#loadingModalText").text(message);
    // Show the modal
    $("#loadingModal").modal("show");
  }

  // Function to hide the loading modal with jQuery
  function hideLoadingModal() {
    // Hide the modal
    $("#loadingModal").modal("hide");
  }

  function loadDevices() {
    // Check if the devices are already stored in localStorage
    const cachedDevices = localStorage.getItem("deviceNames");

    if (cachedDevices) {
      // If the devices are cached, use them
      const deviceNames = JSON.parse(cachedDevices);
      populateDropdown(deviceNames);
    } else {
      // If no cached devices, fetch from the server
      $.ajax({
        url: `${url}/api/devices`, // The endpoint to fetch device names
        type: "GET", // HTTP method
        dataType: "json", // Expect JSON response
        success: function (deviceNames) {
          // Cache the device names in localStorage
          localStorage.setItem("deviceNames", JSON.stringify(deviceNames));

          // Populate the dropdown with device names
          populateDropdown(deviceNames);
        },
        error: function () {
          // Handle error
          $("#deviceDropdown").html(
            '<option value="">Failed to load devices</option>'
          );
        },
      });
    }
  }

  // Function to populate the dropdown with device names
  function populateDropdown(deviceNames) {
    // Clear any existing options except the default one
    $("#deviceDropdown").html('<option value="">Select Device</option>');

    // Populate the dropdown with device names
    deviceNames.forEach(function (deviceName) {
      $("#deviceDropdown").append(
        $("<option>", {
          value: deviceName, // Set the value of the option
          text: deviceName, // Set the text of the option
        })
      );
    });
  }

  loadDevices();
});
