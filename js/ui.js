(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function setStatus(message, isError) {
    const status = byId("status");
    status.textContent = message || "";
    status.style.color = isError ? "#f87171" : "#94a3b8";
  }

  function renderEquipment(equipment) {
    const list = byId("equipment-list");
    list.innerHTML = "";

    equipment.forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      list.appendChild(li);
    });

    renderEquipmentSelects(equipment);
  }

  function renderEquipmentSelects(equipment) {
    const from = byId("from-equipment");
    const to = byId("to-equipment");

    const options = ['<option value="">-- Select --</option>']
      .concat(equipment.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`))
      .join("");

    from.innerHTML = options;
    to.innerHTML = options;
  }

  function renderFeeders(feeders) {
    const tbody = byId("feeder-tbody");
    tbody.innerHTML = "";

    feeders.forEach((feeder, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(feeder.id)}</td>
        <td>${escapeHtml(feeder.from)}</td>
        <td>${escapeHtml(feeder.to)}</td>
        <td>${escapeHtml(feeder.voltage)}</td>
        <td>${escapeHtml(feeder.current)}</td>
        <td>${escapeHtml(feeder.conductorSize)}</td>
        <td>${escapeHtml(feeder.bonding)}</td>
        <td>${escapeHtml(feeder.voltageDropPct)}</td>
        <td>${escapeHtml(feeder.status)}</td>
        <td>
          <button class="btn" data-edit-index="${index}">Edit</button>
          <button class="btn" data-remove-index="${index}">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    byId("feeder-count").textContent = `${feeders.length} feeder${feeders.length === 1 ? "" : "s"}`;
  }

  function syncProjectName(name) {
    byId("project-name").value = name || "";
  }

  function readFromToInputs() {
    return {
      from: byId("from-equipment").value,
      to: byId("to-equipment").value
    };
  }

  function escapeHtml(text) {
    return String(text || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  window.FeederUI = {
    byId,
    setStatus,
    renderEquipment,
    renderFeeders,
    syncProjectName,
    readFromToInputs
  };
})();
