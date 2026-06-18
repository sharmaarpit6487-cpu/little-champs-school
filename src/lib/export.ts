import * as XLSX from "xlsx";

export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  sheetName = "Sheet1"
) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
    },
  });
}

export function exportStudentsToExcel(
  students: {
    studentId: string;
    firstName: string;
    lastName: string;
    class: { name: string };
    division: string;
    rollNumber: string;
    admissionDate: Date;
  }[]
) {
  const rows = students.map((s) => ({
    "Student ID": s.studentId,
    Name: `${s.firstName} ${s.lastName}`,
    Class: s.class.name,
    Division: s.division,
    "Roll Number": s.rollNumber,
    "Admission Date": s.admissionDate.toISOString().split("T")[0],
  }));

  return exportToExcel(rows, "students-report", "Students");
}
