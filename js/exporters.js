(function () {
  function toRows(feeders) {
    return feeders.map((feeder) => ({
      "Feeder ID": feeder.id,
      From: feeder.from,
      To: feeder.to,
      Voltage: feeder.voltage,
      Current: feeder.current,
      "Circuit Configuration": feeder.circuitConfiguration || "",
      "Conductor Size": feeder.conductorSize,
      "Bonding Conductor": feeder.bonding,
      Length: feeder.length,
      "Install Method": feeder.installMethod,
      Insulation: feeder.insulation,
      "Voltage Drop %": feeder.voltageDropPct,
      Status: feeder.status
    }));
  }

  function exportPdf(projectName, feeders) {
    const rows = toRows(feeders);
    const doc = new window.jspdf.jsPDF({ orientation: "landscape" });

    doc.setFontSize(14);
    doc.text(`Feeder List - ${projectName || "Untitled Project"}`, 14, 14);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 20);

    doc.autoTable({
      startY: 24,
      head: [["Feeder ID", "From", "To", "V", "A", "Circuit Config", "Conductor Size", "Bonding", "Length", "Install", "Insul.", "VD %", "Status"]],
      body: rows.map((r) => [
        pdfSafeText(r["Feeder ID"]),
        pdfSafeText(r.From),
        pdfSafeText(r.To),
        pdfSafeText(r.Voltage),
        pdfSafeText(r.Current),
        pdfSafeText(r["Circuit Configuration"]),
        pdfSafeText(r["Conductor Size"]),
        pdfSafeText(r["Bonding Conductor"]),
        pdfSafeText(r.Length),
        pdfSafeText(r["Install Method"]),
        pdfSafeText(r.Insulation),
        pdfSafeText(r["Voltage Drop %"]),
        pdfSafeText(r.Status)
      ]),
      styles: { fontSize: 8 }
    });

    doc.save(`${safeName(projectName || "feeder_list")}.pdf`);
  }

  function exportExcel(projectName, feeders) {
    const rows = toRows(feeders);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feeders");
    XLSX.writeFile(workbook, `${safeName(projectName || "feeder_list")}.xlsx`);
  }

  function safeName(value) {
    return String(value || "project")
      .trim()
      .replace(/[^a-z0-9-_]+/gi, "_")
      .replace(/^_+|_+$/g, "");
  }

  function pdfSafeText(value) {
    return String(value ?? "").replaceAll("Φ", "ph");
  }

  window.FeederExporters = {
    exportPdf,
    exportExcel
  };
})();
