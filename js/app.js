(function () {
  const { appState, setProjectName, addEquipment, addFeeder, removeFeeder, clearProject, loadProject, getProjectData } = window.FeederState;
  const { byId, setStatus, renderEquipment, renderFeeders, clearFeederInputFields, syncProjectName, readFeederFromInputs } = window.FeederUI;
  const { downloadJson, triggerFileLoad } = window.FeederStorage;
  const { exportPdf, exportExcel } = window.FeederExporters;

  function init() {
    bindEvents();
    renderAll();
  }

  function bindEvents() {
    byId("project-name").addEventListener("input", (event) => {
      setProjectName(event.target.value);
    });

    byId("btn-add-equipment").addEventListener("click", () => {
      try {
        addEquipment(byId("equipment-name").value);
        byId("equipment-name").value = "";
        renderEquipment(appState.equipment);
        setStatus("Equipment added.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });

    byId("btn-add-feeder").addEventListener("click", () => {
      try {
        if (!appState.projectName) {
          throw new Error("Please enter the project name first.");
        }
        if (appState.equipment.length < 2) {
          throw new Error("Add at least two panel/equipment names before adding feeders.");
        }

        const feeder = readFeederFromInputs();
        if (!feeder.from || !feeder.to) {
          throw new Error("From and To are required.");
        }

        addFeeder(feeder);
        renderFeeders(appState.feeders);
        clearFeederInputFields();
        setStatus("Feeder added to project.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });

    byId("feeder-tbody").addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      const index = Number(target.getAttribute("data-remove-index"));
      if (!Number.isInteger(index)) return;

      removeFeeder(index);
      renderFeeders(appState.feeders);
      setStatus("Feeder removed.");
    });

    byId("btn-save-project").addEventListener("click", () => {
      try {
        if (!appState.projectName) throw new Error("Enter a project name before saving.");
        const data = getProjectData();
        downloadJson(`${sanitizeFilename(appState.projectName)}.json`, data);
        setStatus("Project saved as JSON.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });

    byId("btn-load-project").addEventListener("click", () => {
      triggerFileLoad((project, error) => {
        if (error) {
          setStatus(error.message, true);
          return;
        }

        try {
          loadProject(project);
          renderAll();
          setStatus("Project loaded.");
        } catch (loadError) {
          setStatus(loadError.message, true);
        }
      });
    });

    byId("btn-export-pdf").addEventListener("click", () => {
      try {
        ensureExportReady();
        exportPdf(appState.projectName, appState.feeders);
        setStatus("PDF exported.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });

    byId("btn-export-excel").addEventListener("click", () => {
      try {
        ensureExportReady();
        exportExcel(appState.projectName, appState.feeders);
        setStatus("Excel exported.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });

    byId("btn-clear-project").addEventListener("click", () => {
      clearProject();
      renderAll();
      clearFeederInputFields();
      setStatus("Project cleared.");
    });
  }

  function ensureExportReady() {
    if (!appState.projectName) {
      throw new Error("Project name is required to export.");
    }
    if (!appState.feeders.length) {
      throw new Error("Add at least one feeder before exporting.");
    }
  }

  function renderAll() {
    syncProjectName(appState.projectName);
    renderEquipment(appState.equipment);
    renderFeeders(appState.feeders);
  }

  function sanitizeFilename(value) {
    return String(value || "project")
      .trim()
      .replace(/[^a-z0-9-_]+/gi, "_")
      .replace(/^_+|_+$/g, "") || "project";
  }

  document.addEventListener("DOMContentLoaded", init);
})();
