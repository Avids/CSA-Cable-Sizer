(function () {
  const appState = {
    projectName: "",
    equipment: [],
    feeders: []
  };

  function normalizeName(value) {
    return String(value || "").trim();
  }

  function setProjectName(name) {
    appState.projectName = normalizeName(name);
  }

  function addEquipment(name) {
    const normalized = normalizeName(name);
    if (!normalized) throw new Error("Equipment name is required.");

    const exists = appState.equipment.some((item) => item.toLowerCase() === normalized.toLowerCase());
    if (exists) throw new Error("Equipment already exists.");

    appState.equipment.push(normalized);
  }

  function removeFeeder(index) {
    appState.feeders.splice(index, 1);
  }

  function addOrUpdateFeeder(feeder) {
    const index = appState.feeders.findIndex((item) => item.id === feeder.id);
    if (index >= 0) {
      appState.feeders[index] = { ...feeder };
    } else {
      appState.feeders.push({ ...feeder });
    }
  }

  function getNextFeederId() {
    const maxNumber = appState.feeders.reduce((max, feeder) => {
      const match = String(feeder.id || "").match(/^F(\d+)$/i);
      if (!match) return max;
      return Math.max(max, Number(match[1]));
    }, 0);

    return `F${String(maxNumber + 1).padStart(3, "0")}`;
  }

  function clearProject() {
    appState.projectName = "";
    appState.equipment = [];
    appState.feeders = [];
  }

  function loadProject(project) {
    if (!project || typeof project !== "object") {
      throw new Error("Invalid project file.");
    }

    appState.projectName = normalizeName(project.projectName);
    appState.equipment = Array.isArray(project.equipment)
      ? project.equipment.map(normalizeName).filter(Boolean)
      : [];
    appState.feeders = Array.isArray(project.feeders)
      ? project.feeders.map((feeder) => ({ ...feeder }))
      : [];
  }

  function getProjectData() {
    return {
      projectName: appState.projectName,
      equipment: [...appState.equipment],
      feeders: appState.feeders.map((feeder) => ({ ...feeder })),
      exportedAt: new Date().toISOString()
    };
  }

  window.FeederState = {
    appState,
    setProjectName,
    addEquipment,
    addOrUpdateFeeder,
    removeFeeder,
    getNextFeederId,
    clearProject,
    loadProject,
    getProjectData
  };
})();
