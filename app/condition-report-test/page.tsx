"use client";

async function generatePdf(debug: boolean) {
  const answers = [
    {
      questionId: "b1",
      section: "B",
      answer: "YES",
      explanation: "Leak observed around chimney flashing during heavy rain.",
    },
    {
      questionId: "b2",
      section: "B",
      answer: "NO",
    },
    {
      questionId: "b3",
      section: "B",
      answer: "NA",
    },
  ];

  const response = await fetch("/api/condition-report/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answers,
      debug,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    alert(`Failed: ${text}`);
    return;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

export default function ConditionReportTestPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Condition Report PDF Test</h1>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button
          onClick={() => generatePdf(false)}
          style={{
            padding: "10px 14px",
            border: "1px solid #ccc",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Generate PDF
        </button>

        <button
          onClick={() => generatePdf(true)}
          style={{
            padding: "10px 14px",
            border: "1px solid #ccc",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Generate PDF (Debug Boxes)
        </button>
      </div>
    </main>
  );
}