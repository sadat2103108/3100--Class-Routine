import { jsPDF } from "jspdf";


export async function downloadRoutinePDF(batchNames, timeSlots) {
  try {
    const url = `${import.meta.env.VITE_SERVER_URL}/api/routine`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch routine data");
    const data = await res.json();
    const routineData = data.routineData || [];

    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth() * 0.9; // scale down 80%
    const margin = 20;
    const cellHeight = 35;


    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];


    const cellWidth = pageWidth / (timeSlots.length + 1); // +1 for batch column

    doc.setFont("helvetica", "normal");

    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      const day = days[dayIndex];

      // Start each day on a new page
      if (dayIndex > 0) doc.addPage();

      let y = margin;

      // Day title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(day, margin, y);
      y += 30;

      // Header row
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      // Batch header
      const xBatch = margin;
      doc.rect(xBatch, y, cellWidth, cellHeight);
      const batchHeaderLines = doc.splitTextToSize("Batch", cellWidth - 4);
      batchHeaderLines.forEach((line, i) => {
        const textY = y + cellHeight / 2 - (batchHeaderLines.length - 1) * 3 + i * 10;
        doc.text(line, xBatch + cellWidth / 2, textY, { align: "center" });
      });

      // Time slot headers
      timeSlots.forEach((time, tIndex) => {
        const x = margin + cellWidth * (tIndex + 1);
        doc.rect(x, y, cellWidth, cellHeight);
        const timeLines = doc.splitTextToSize(time, cellWidth - 4);
        timeLines.forEach((line, i) => {
          const textY = y + cellHeight / 2 - (timeLines.length - 1) * 3 + i * 10;
          doc.text(line, x + cellWidth / 2, textY, { align: "center" });
        });
      });

      y += cellHeight;

      // Batch rows
      batchNames.forEach((batchName, batchIndex) => {
        // Batch cell
        doc.rect(xBatch, y, cellWidth, cellHeight);
        const batchLines = doc.splitTextToSize(batchName, cellWidth - 4);
        batchLines.forEach((line, i) => {
          const textY = y + cellHeight / 2 - (batchLines.length - 1) * 3 + i * 10;
          doc.text(line, xBatch + cellWidth / 2, textY, { align: "center" });
        });

        // Time slot cells
        for (let t = 0; t < timeSlots.length; t++) {
          const x = margin + cellWidth * (t + 1);
          doc.rect(x, y, cellWidth, cellHeight);

          const classInfo = routineData.find(
            (c) =>
              c.dayIndex === dayIndex &&
              c.timeIndex === t &&
              c.batchIndex === batchIndex
          );

          if (classInfo) {
            const text = `${classInfo.course || ""}\n${
              Array.isArray(classInfo.teacher)
                ? classInfo.teacher.join(", ")
                : classInfo.teacher || ""
            }\n${classInfo.room || ""}`;
            const lines = doc.splitTextToSize(text, cellWidth - 4);
            lines.forEach((line, i) => {
              const textY = y + cellHeight / 2 - (lines.length - 1) * 3 + i * 10;
              doc.text(line, x + cellWidth / 2, textY, { align: "center" });
            });
          }
        }

        y += cellHeight;
      });
    }

    doc.save("class_routine.pdf");
  } catch (err) {
    console.error("Error generating PDF:", err);
  }
}
