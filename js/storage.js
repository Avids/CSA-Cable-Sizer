(function () {
  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function triggerFileLoad(onData) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.addEventListener("change", (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || "{}"));
          onData(parsed);
        } catch (error) {
          onData(null, error);
        }
      };
      reader.onerror = () => onData(null, new Error("Failed to read selected file."));
      reader.readAsText(file);
    });

    input.click();
  }

  window.FeederStorage = {
    downloadJson,
    triggerFileLoad
  };
})();
