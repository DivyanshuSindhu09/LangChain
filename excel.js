
import XLSX from "xlsx";

// Create a new workbook
const workbook = XLSX.utils.book_new();

// -------------------
// 1. Classes Sheet
// -------------------
const classesData = [
  { "Class Name": "CSE 3rd Year", "Subject Name": "IT", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "IT", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "OOP", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "OOP", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "COA", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "COA", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "DSA", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "DSA", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "OB", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "OB", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "EITK", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "EITK", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "PS", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "PS", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 84 },
  
  { "Class Name": "CSE 3rd Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "IT LAB", "Section": "A", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "IT LAB", "Section": "B", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "DSA LAB", "Section": "A", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "DSA LAB", "Section": "B", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "OOP LAB", "Section": "A", "Students": 84 },
  { "Class Name": "CSE 3rd Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "OOP LAB", "Section": "B", "Students": 84 },
  
  { "Class Name": "CSE 5th Year", "Subject Name": "SE", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 80 },
  { "Class Name": "CSE 5th Year", "Subject Name": "SE", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 78 },
  { "Class Name": "CSE 5th Year", "Subject Name": "DBS", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 80 },
  { "Class Name": "CSE 5th Year", "Subject Name": "DBS", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 78 },
  { "Class Name": "CSE 5th Year", "Subject Name": "WIT", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 80 },
  { "Class Name": "CSE 5th Year", "Subject Name": "WIT", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 78 },
  { "Class Name": "CSE 5th Year", "Subject Name": "ISE", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 80 },
  { "Class Name": "CSE 5th Year", "Subject Name": "ISE", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 78 },
  { "Class Name": "CSE 5th Year", "Subject Name": "ML", "Subject Type": "Theory", "Lab Name": "", "Section": "A", "Students": 80 },
  { "Class Name": "CSE 5th Year", "Subject Name": "ML", "Subject Type": "Theory", "Lab Name": "", "Section": "B", "Students": 78 },
  
  { "Class Name": "CSE 5th Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "WIT LAB", "Section": "A", "Students": 80 },
  { "Class Name": "CSE 5th Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "WIT LAB", "Section": "B", "Students": 78 },
  { "Class Name": "CSE 5th Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "DBS LAB", "Section": "A", "Students": 80 },
  { "Class Name": "CSE 5th Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "DBS LAB", "Section": "B", "Students": 78 },
  { "Class Name": "CSE 5th Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "ML LAB", "Section": "A", "Students": 80 },
  { "Class Name": "CSE 5th Year", "Subject Name": "", "Subject Type": "Lab", "Lab Name": "ML LAB", "Section": "B", "Students": 78 }
];

// -------------------
// 2. Slots Sheet
// -------------------
const slotsData = [
  { "Slot Name": "9:00-9:55", "Start Time": "9:00", "End Time": "9:55" },
  { "Slot Name": "9:55-10:50", "Start Time": "9:55", "End Time": "10:50" },
  { "Slot Name": "10:50-11:45", "Start Time": "10:50", "End Time": "11:45" },
  { "Slot Name": "11:45-12:40", "Start Time": "11:45", "End Time": "12:40" },
  { "Slot Name": "Lunch Break", "Start Time": "12:40", "End Time": "2:00" },
  { "Slot Name": "2:00-2:55", "Start Time": "2:00", "End Time": "2:55" },
  { "Slot Name": "2:55-3:50", "Start Time": "2:55", "End Time": "3:50" },
  { "Slot Name": "3:50-4:45", "Start Time": "3:50", "End Time": "4:45" }
];

// -------------------
// 3. Rooms Sheet
// -------------------
const roomsData = [
  { "Room Name": "301", "Capacity": 100, "Room Type": "Theory" },
  { "Room Name": "300", "Capacity": 100, "Room Type": "Theory" },
  { "Room Name": "338", "Capacity": 100, "Room Type": "Theory" },
  { "Room Name": "340", "Capacity": 100, "Room Type": "Theory" }
];

// -------------------
// 4. Labs Sheet
// -------------------
const labsData = [
  { "Lab Name": "308", "Subject": "OOP LAB", "Capacity": 30 },
  { "Lab Name": "308", "Subject": "DBS LAB", "Capacity": 30 },
  { "Lab Name": "339", "Subject": "DSA LAB", "Capacity": 30 },
  { "Lab Name": "339", "Subject": "ML LAB", "Capacity": 30 },
  { "Lab Name": "337", "Subject": "IT LAB", "Capacity": 30 },
  { "Lab Name": "337", "Subject": "ML LAB", "Capacity": 30 },
  { "Lab Name": "335", "Subject": "IT LAB", "Capacity": 30 },
  { "Lab Name": "335", "Subject": "WIT LAB", "Capacity": 30 },
  { "Lab Name": "311", "Subject": "DSA LAB", "Capacity": 30 },
  { "Lab Name": "311", "Subject": "DBS LAB", "Capacity": 30 },
  { "Lab Name": "333", "Subject": "OOP LAB", "Capacity": 30 },
  { "Lab Name": "333", "Subject": "WIT LAB", "Capacity": 30 }
];

// -------------------
// 5. Teachers Sheet
// -------------------
const teachersData = [
  { "Teacher Name": "Dr. Karambir", "Subject": "IT", "Type": "Theory" },
  { "Teacher Name": "Mr. Abhishek", "Subject": "IT", "Type": "Theory" },
  { "Teacher Name": "Mrs. Manisha", "Subject": "OOP", "Type": "Theory" },
  { "Teacher Name": "Mr. Divyansh", "Subject": "OOP", "Type": "Theory" },
  { "Teacher Name": "Mrs. Shikha", "Subject": "COA", "Type": "Theory" },
  { "Teacher Name": "Dr. Sona", "Subject": "DSA", "Type": "Theory" },
  { "Teacher Name": "Dr. Sakshi", "Subject": "OB", "Type": "Theory" },
  { "Teacher Name": "Dr. Randhir", "Subject": "EITK", "Type": "Theory" },
  { "Teacher Name": "Ms. Neha Kalyan", "Subject": "PS", "Type": "Theory" },
  { "Teacher Name": "Mr. Pankaj", "Subject": "SE", "Type": "Theory" },
  { "Teacher Name": "Mrs. Jyoti", "Subject": "DBS", "Type": "Theory" },
  { "Teacher Name": "Mrs. Pragya", "Subject": "WIT", "Type": "Theory" },
  { "Teacher Name": "Mr. Atul", "Subject": "WIT", "Type": "Theory" },
  { "Teacher Name": "Dr. Nikhil", "Subject": "ISE", "Type": "Theory" },
  { "Teacher Name": "Mrs. Priya", "Subject": "ML", "Type": "Theory" },
  
  { "Teacher Name": "Dr. Karambir", "Subject": "IT LAB", "Type": "Lab" },
  { "Teacher Name": "Dr. Shikha Bhardwaj", "Subject": "IT LAB", "Type": "Lab" },
  { "Teacher Name": "Mrs. Manisha", "Subject": "OOP LAB", "Type": "Lab" },
  { "Teacher Name": "Mrs. Shikha", "Subject": "OOP LAB", "Type": "Lab" },
  { "Teacher Name": "Dr. Sona", "Subject": "DSA LAB", "Type": "Lab" },
  { "Teacher Name": "Mr. Rohan", "Subject": "DSA LAB", "Type": "Lab" },
  { "Teacher Name": "Mrs. Pragya", "Subject": "WIT LAB", "Type": "Lab" },
  { "Teacher Name": "Mr. Rohan", "Subject": "WIT LAB", "Type": "Lab" },
  { "Teacher Name": "Mrs. Jyoti", "Subject": "DBS LAB", "Type": "Lab" },
  { "Teacher Name": "Mrs. Priya", "Subject": "ML LAB", "Type": "Lab" },
  { "Teacher Name": "Mr. Abhishek", "Subject": "ML LAB", "Type": "Lab" }
];

// -------------------
// 6. Teacher Unavailability Sheet
// -------------------
const unavailabilityData = [
  { "Teacher Name": "Dr. Karambir", "Day": "Friday", "Slot": "9:00-9:55" },
  { "Teacher Name": "Mrs. Manisha", "Day": "Wednesday", "Slot": "3:50-4:45" },
  { "Teacher Name": "Dr. Sona", "Day": "Friday", "Slot": "2:00-2:55" }
];

// -------------------
// 7. Lecture Requirements Sheet
// -------------------
const lectureRequirementsData = [
  { "Subject": "IT", "Weekly Lectures": 3 },
  { "Subject": "OOP", "Weekly Lectures": 4 },
  { "Subject": "COA", "Weekly Lectures": 3 },
  { "Subject": "DSA", "Weekly Lectures": 4 },
  { "Subject": "OB", "Weekly Lectures": 3 },
  { "Subject": "EITK", "Weekly Lectures": 2 },
  { "Subject": "PS", "Weekly Lectures": 3 },
  { "Subject": "SE", "Weekly Lectures": 3 },
  { "Subject": "DBS", "Weekly Lectures": 3 },
  { "Subject": "WIT", "Weekly Lectures": 3 },
  { "Subject": "ISE", "Weekly Lectures": 3 },
  { "Subject": "ML", "Weekly Lectures": 4 }
];

// -------------------
// 8. Constraints Sheet
// -------------------
const constraintsData = [
  { "Constraint Type": "max_lectures_per_day_teacher", "Value": 5 },
  { "Constraint Type": "max_lectures_per_subject_per_day", "Value": 2 },
  { "Constraint Type": "min_lectures_per_day_section", "Value": 4 },
  { "Constraint Type": "max_lectures_per_day_section", "Value": 6 },
  { "Constraint Type": "lab_session_duration", "Value": 2 },
  { "Constraint Type": "lab_capacity", "Value": 30 },
  { "Constraint Type": "distribute_across_week", "Value": "true" }
];

// Create worksheets
const classesSheet = XLSX.utils.json_to_sheet(classesData);
const slotsSheet = XLSX.utils.json_to_sheet(slotsData);
const roomsSheet = XLSX.utils.json_to_sheet(roomsData);
const labsSheet = XLSX.utils.json_to_sheet(labsData);
const teachersSheet = XLSX.utils.json_to_sheet(teachersData);
const unavailabilitySheet = XLSX.utils.json_to_sheet(unavailabilityData);
const lectureReqSheet = XLSX.utils.json_to_sheet(lectureRequirementsData);
const constraintsSheet = XLSX.utils.json_to_sheet(constraintsData);

// Add worksheets to workbook
XLSX.utils.book_append_sheet(workbook, classesSheet, "Classes");
XLSX.utils.book_append_sheet(workbook, slotsSheet, "Slots");
XLSX.utils.book_append_sheet(workbook, roomsSheet, "Rooms");
XLSX.utils.book_append_sheet(workbook, labsSheet, "Labs");
XLSX.utils.book_append_sheet(workbook, teachersSheet, "Teachers");
XLSX.utils.book_append_sheet(workbook, unavailabilitySheet, "Unavailability");
XLSX.utils.book_append_sheet(workbook, lectureReqSheet, "LectureRequirements");
XLSX.utils.book_append_sheet(workbook, constraintsSheet, "Constraints");

// Write the file
XLSX.writeFile(workbook, "timetable.xlsx");
console.log("✅ Excel file 'timetable.xlsx' created successfully!");
console.log("📊 Sheets created:");
console.log("- Classes: Class information with subjects and sections");
console.log("- Slots: Time slots for the timetable");
console.log("- Rooms: Available theory rooms");
console.log("- Labs: Lab rooms and their subject assignments");
console.log("- Teachers: Teacher assignments for subjects and labs");
console.log("- Unavailability: Teacher unavailable times");
console.log("- LectureRequirements: Weekly lecture requirements per subject");
console.log("- Constraints: Scheduling constraints and parameters");