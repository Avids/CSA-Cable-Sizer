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
        <td>${index + 1}</td>
        <td>${escapeHtml(feeder.id)}</td>
        <td>${escapeHtml(feeder.from)}</td>
        <td>${escapeHtml(feeder.to)}</td>
        <td>${escapeHtml(feeder.voltage)}</td>
        <td>${escapeHtml(feeder.current)}</td>
        <td>${escapeHtml(feeder.phases)}</td>
        <td>${escapeHtml(feeder.conductor)}</td>
        <td>${escapeHtml(feeder.length)}</td>
        <td>${escapeHtml(feeder.conduit)}</td>
        <td>${escapeHtml(feeder.notes)}</td>
        <td><button class="btn" data-remove-index="${index}">Delete</button></td>
      `;
      tbody.appendChild(row);
    });

    byId("feeder-count").textContent = `${feeders.length} feeder${feeders.length === 1 ? "" : "s"}`;
  }

  function clearFeederInputFields() {
    ["feeder-id", "voltage", "current", "conductor", "length", "conduit", "feeder-notes"].forEach((id) => {
      byId(id).value = "";
    });
    byId("phases").value = "3Ø";
  }

  function syncProjectName(name) {
    byId("project-name").value = name || "";
  }

  function readFeederFromInputs() {
    return {
      id: byId("feeder-id").value.trim(),
      from: byId("from-equipment").value,
      to: byId("to-equipment").value,
      voltage: byId("voltage").value.trim(),
      current: byId("current").value.trim(),
      phases: byId("phases").value,
      conductor: byId("conductor").value.trim(),
      length: byId("length").value.trim(),
      conduit: byId("conduit").value.trim(),
      notes: byId("feeder-notes").value.trim()
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
    clearFeederInputFields,
    syncProjectName,
    readFeederFromInputs
  };
})();
