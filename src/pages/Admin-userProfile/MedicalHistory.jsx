// src/components/medicalHistory/MedicalHistory.jsx
import React, { useState, useEffect } from "react";
import fetchResource from "../../api";
import styles from "./userProfile.module.css";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

// Tell PDF.js where its worker is
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsDistVersion}/pdf.worker.min.js`;

const MedicalHistory = ({ userId }) => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [fileUploading, setFileUploading] = useState(false);

  // Load existing records
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const resp = await fetchResource(
          "GET",
          `user/${userId}/medical-history`
        );
        setMedicalHistory(resp);
      } catch (err) {
        console.error("Error fetching medical history:", err);
      }
    })();
  }, [userId]);

  // Send text to GPT for analysis
  const analyzeEntry = async (text) => {
    try {
      const res = await fetch("/api/medical-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const { alerts: newAlerts } = await res.json();
      setAlerts(newAlerts || []);
    } catch (err) {
      console.error("Error analyzing entry:", err);
    }
  };

  // Handle adding via form
  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntry || !entryDate) {
      alert("Both medical history and date are required.");
      return;
    }
    const record = { history: newEntry, date: entryDate };
    try {
      const resp = await fetchResource(
        "POST",
        `user/${userId}/medical-history`,
        { body: record }
      );
      setMedicalHistory(resp.medicalHistory || [record, ...medicalHistory]);
      setNewEntry("");
      setEntryDate("");
      await analyzeEntry(record.history);
    } catch (err) {
      console.error(err);
      alert("Failed to add medical history.");
    }
  };

  // Extract text from PDF ArrayBuffer
  const extractTextFromPDF = async (arrayBuffer) => {
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(" ") + "\n\n";
    }
    return fullText;
  };

  // Handle file uploads (.txt and .pdf)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileUploading(true);
    try {
      let text = "";
      if (file.name.endsWith(".txt")) {
        text = await file.text();
      } else if (file.name.endsWith(".pdf")) {
        const buffer = await file.arrayBuffer();
        text = await extractTextFromPDF(buffer);
      } else {
        alert("Only .txt or .pdf files are supported.");
        return;
      }
      setNewEntry(text);
      await analyzeEntry(text);
    } catch (err) {
      console.error("Error reading file:", err);
      alert("Failed to read file.");
    } finally {
      setFileUploading(false);
    }
  };

  return (
    <div className={styles.sessionForm}>
      <h2>Medical History</h2>

      {alerts.length > 0 && (
        <div className={styles.alerts}>
          <h4>⚠️ Alerts</h4>
          <ul>
            {alerts.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleAddEntry} className={styles.users_form}>
        <textarea
          placeholder="Enter medical history details"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          className={styles.textarea}
        />

        <div className={styles.bttn}>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
          />
          <button type="submit" disabled={!newEntry || !entryDate}>
            Add
          </button>
        </div>

        <div className={styles.bttn}>
          <input
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileUpload}
            disabled={fileUploading}
          />
          {fileUploading && <span>Reading file...</span>}
        </div>
      </form>

      <h3>Medical History Records</h3>
      {medicalHistory.length ? (
        <>
          <ul>
            {(showAll
              ? medicalHistory
              : medicalHistory.slice(0, 3)
            ).map((entry, idx) => (
              <li key={idx}>
                <strong>
                  {new Date(entry.date).toLocaleDateString()}
                </strong>
                : {entry.history}
              </li>
            ))}
          </ul>
          {medicalHistory.length > 3 && (
            <button
              onClick={() => setShowAll((s) => !s)}
              className={styles.toggleButton}
            >
              {showAll ? "Hide History" : "Show More"}
            </button>
          )}
        </>
      ) : (
        <p>No medical records available.</p>
      )}
    </div>
  );
};

export default MedicalHistory;
