import React, { ChangeEvent } from "react";

interface CSVUploadProps {
  setJsonData: React.Dispatch<React.SetStateAction<any>>;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ setJsonData }) => {
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const csvContent = event.target?.result as string;
      try {
        const jsonData = convertCsvToJson(csvContent);
        setJsonData(jsonData);
      } catch (error) {
        alert(`Error processing CSV file: ${error instanceof Error ? error.message : error}`);
      }
    };

    reader.readAsText(file);
  };

  const convertCsvToJson = (csvContent: string): Record<string, any> => {
    const rows = csvContent.trim().split("\n").map((row) => row.split(","));
    if (rows.length < 2) throw new Error("CSV file is empty or invalid");

    const finalContent: Record<string, any> = {
      "pt-BR": {},
      "pt-PT": {},
      en: {},
      fr: {},
      es: {},
    };

    rows.forEach((row) => {
      if (row.length < 2) return;

      const keys = keyToArray(row[0]);
      const values = row.slice(1);

      ["pt-BR", "pt-PT", "en", "fr", "es"].forEach((lang, index) => {
        if (index < values.length) {
          assignValue(finalContent[lang], keys, values[index]);
        }
      });
    });

    return finalContent;
  };

  const keyToArray = (strKey: string): string[] => {
    return strKey.split(".").map((key) => key.replace(/^"|"$/g, "").trim());
  };

  const assignValue = (obj: any, keys: string[], value: string): void => {
    keys.reduce((acc: any, key: string, index: number) => {
      if (index === keys.length - 1) {
        acc[key] = value;
      } else {
        acc[key] = acc[key] || {};
      }
      return acc[key];
    }, obj);
  };

  return (
    <div>
      <label htmlFor="csvFile">Upload CSV File:</label>
      <input
        type="file"
        id="csvFile"
        accept=".csv"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default CSVUpload;
