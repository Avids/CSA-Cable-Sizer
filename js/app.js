(function () {
  const {
    appState,
    setProjectName,
    addEquipment,
    addOrUpdateFeeder,
    removeFeeder,
    getNextFeederId,
    clearProject,
    loadProject,
    getProjectData
  } = window.FeederState;
  const { byId, setStatus, renderEquipment, renderFeeders, syncProjectName, readFromToInputs } = window.FeederUI;
  const { downloadJson, triggerFileLoad } = window.FeederStorage;
  const { exportPdf, exportExcel } = window.FeederExporters;

  const CONTEXT_KEY = "csaFeederEditorContext";
  const RESULT_KEY = "csaFeederDraftResult";

  function init() {
    bindEvents();
    consumeReturnedFeeder();
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

    byId("btn-open-sizer").addEventListener("click", () => {
      try {
        if (!appState.projectName) throw new Error("Please enter the project name first.");
        if (appState.equipment.length < 2) throw new Error("Add at least two panel/equipment names before adding feeders.");

        const endpoint = readFromToInputs();
        if (!endpoint.from || !endpoint.to) throw new Error("From and To are required.");

        const context = {
          mode: "new",
          projectName: appState.projectName,
          equipment: [...appState.equipment],
          feederId: getNextFeederId(),
          from: endpoint.from,
          to: endpoint.to
        };

        localStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
        window.location.href = "cable-sizing.html";
      } catch (error) {
        setStatus(error.message, true);
      }
    });

    byId("feeder-tbody").addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;

      const removeIndex = Number(target.getAttribute("data-remove-index"));
      if (Number.isInteger(removeIndex)) {
        removeFeeder(removeIndex);
        renderFeeders(appState.feeders);
        setStatus("Feeder removed.");
        return;
      }

      const editIndex = Number(target.getAttribute("data-edit-index"));
      if (Number.isInteger(editIndex)) {
        openEditMode(editIndex);
      }
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
      localStorage.removeItem(CONTEXT_KEY);
      localStorage.removeItem(RESULT_KEY);
      setStatus("Project cleared.");
    });
  }

  function openEditMode(index) {
    const feeder = appState.feeders[index];
    if (!feeder) {
      setStatus("Unable to find feeder for editing.", true);
      return;
    }

    const context = {
      mode: "edit",
      projectName: appState.projectName,
      equipment: [...appState.equipment],
      feederId: feeder.id,
      from: feeder.from,
      to: feeder.to,
      form: feeder.calcForm || null
    };

    localStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
    window.location.href = "cable-sizing.html";
  }

  function consumeReturnedFeeder() {
    const raw = localStorage.getItem(RESULT_KEY);
    if (!raw) return;

    localStorage.removeItem(RESULT_KEY);

    try {
      const payload = JSON.parse(raw);
      if (!payload || !payload.feeder) return;
      addOrUpdateFeeder(payload.feeder);
      setStatus(payload.mode === "edit" ? "Feeder updated from cable sizing page." : "Feeder added from cable sizing page.");
    } catch (error) {
      setStatus("Returned feeder data is invalid.", true);
    }
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
