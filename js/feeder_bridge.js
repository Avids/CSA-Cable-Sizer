(function () {
  const CONTEXT_KEY = "csaFeederEditorContext";
  const RESULT_KEY = "csaFeederDraftResult";

  function initBridge() {
    const context = readContext();
    if (!context) return;

    applyContextToPage(context);
    attachReturnButtons(context);
  }

  function readContext() {
    try {
      const raw = localStorage.getItem(CONTEXT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function applyContextToPage(context) {
    const controller = window.cableSelectionController;
    if (!controller) return;

    const project = document.getElementById("project_name");
    if (project && context.projectName) {
      project.value = context.projectName;
      project.dispatchEvent(new Event("change", { bubbles: true }));
    }

    setSelectOptions("system_from", context.equipment || []);
    setSelectOptions("system_to", context.equipment || []);

    if (context.form) {
      controller.loadSavedJob({ form: context.form });
    }

    setSelectValue("system_from", context.from || "");
    setSelectValue("system_to", context.to || "");

    const notes = document.getElementById("calculation_notes");
    if (notes && !notes.value) {
      notes.value = `Feeder ${context.feederId || ""}`.trim();
      notes.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function setSelectOptions(id, values) {
    const element = document.getElementById(id);
    if (!element || element.tagName !== "SELECT") return;

    const options = ['<option value="">— Select —</option>']
      .concat(values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`))
      .join("");
    element.innerHTML = options;
  }

  function setSelectValue(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.value = value;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function attachReturnButtons(context) {
    const backButton = document.getElementById("btn-back-feeder-list");
    const saveButton = document.getElementById("btn-save-feeder-list");

    if (backButton) {
      backButton.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }

    if (saveButton) {
      saveButton.textContent = context.mode === "edit" ? "Save Feeder Changes" : "Add Feeder to List";
      saveButton.addEventListener("click", () => {
        const controller = window.cableSelectionController;
        if (!controller || typeof controller.validate !== "function") {
          alert("Calculator controller is unavailable.");
          return;
        }

        if (!controller.validate()) return;

        controller.calculate();
        controller.displayResults();

        const feeder = mapControllerToFeeder(context, controller);
        localStorage.setItem(RESULT_KEY, JSON.stringify({ mode: context.mode, feeder }));
        window.location.href = "index.html";
      });
    }
  }

  function mapControllerToFeeder(context, controller) {
    const form = controller.form;
    const results = controller.results;
    const bondingText = results.bonding.applicable
      ? `${results.bonding.wireSize} (${results.bonding.wireMaterial})`
      : results.bonding.reason;

    return {
      id: context.feederId,
      from: form.system.from,
      to: form.system.to,
      voltage: form.circuit.voltage_v,
      current: form.circuit.current_a,
      circuitConfiguration: results.circuit_configuration || mapCircuitConfiguration(form.circuit.type),
      conductorSize: results.recommended_size_display,
      bonding: bondingText,
      length: `${form.circuit.run_length_m} ${form.circuit.run_length_unit || "m"}`,
      installMethod: formatInstallMethod(form.installation.type),
      insulation: `${form.conductors.insulation_rating_c}°C`,
      voltageDropPct: Number(results.voltage_drop_pct).toFixed(2),
      status: results.status,
      calcForm: JSON.parse(JSON.stringify(form)),
      calcResults: JSON.parse(JSON.stringify(results))
    };
  }


  function formatInstallMethod(type) {
    if (type === "raceway") return "Raceway";
    if (type === "free_air") return "Free Air";
    return "Cable";
  }

  function mapCircuitConfiguration(type) {
    if (type === "single_phase_2w") return "1Φ/2W";
    if (type === "three_phase_3w") return "3Φ/3W";
    return "3Φ/4W";
  }

  function escapeHtml(text) {
    return String(text || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initBridge, 0);
  });
})();
