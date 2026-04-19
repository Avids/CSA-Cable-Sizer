(function () {
  function attachOpenJobHandler() {
    const openButton = document.getElementById("btn-open-json");
    if (!openButton) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json,application/json";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    openButton.addEventListener("click", () => {
      fileInput.value = "";
      fileInput.click();
    });

    fileInput.addEventListener("change", (event) => {
      const [file] = event.target.files || [];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const payload = JSON.parse(reader.result);
          const controller = window.cableSelectionController;
          if (!controller || typeof controller.loadSavedJob !== "function") {
            throw new Error("Calculator controller is not available yet.");
          }
          controller.loadSavedJob(payload);
          alert("Saved job loaded successfully.");
        } catch (error) {
          alert(`Unable to open saved job: ${error.message}`);
        }
      };

      reader.onerror = () => {
        alert("Unable to read the selected file.");
      };

      reader.readAsText(file);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachOpenJobHandler);
  } else {
    attachOpenJobHandler();
  }
})();
