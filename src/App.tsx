import React, { useState } from "react";
import CSVUpload from "./components/CSVUpload";

const App: React.FC = () => {
  const [jsonData, setJsonData] = useState<any | null>(null);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>CSV to JSON Converter</h1>
      <CSVUpload setJsonData={setJsonData} />
      {jsonData && (
        <>
          <h2>Generated JSON</h2>
          <textarea
            rows={20}
            cols={80}
            value={JSON.stringify(jsonData, null, 2)}
            readOnly
          ></textarea>
          <br />
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "content.json";
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download JSON
          </button>
        </>
      )}
    </div>
  );
};

export default App;
