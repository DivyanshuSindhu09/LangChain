import { config } from "dotenv";
config();

import XLSX from "xlsx";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

// -------------------
// 1. Read Excel file with multiple sheets
// -------------------
const workbook = XLSX.readFile("./timetable.xlsx");
console.log("📊 Available sheets:", workbook.SheetNames);

// Helper function to safely read sheet data
const readSheet = (sheetName) => {
  if (workbook.Sheets[sheetName]) {
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  } else {
    console.warn(`⚠️ Sheet "${sheetName}" not found`);
    return [];
  }
};

// Read data from different sheets
const classesData = readSheet("Classes");
const slotsData = readSheet("Slots");
const roomsData = readSheet("Rooms");
const labsData = readSheet("Labs");
const teachersData = readSheet("Teachers");
const unavailabilityData = readSheet("Unavailability");
const lectureRequirementsData = readSheet("LectureRequirements");
const constraintsData = readSheet("Constraints");

// -------------------
// 2. Process data for JSON generation
// -------------------

// Process Classes
const classGroups = {};
classesData.forEach(row => {
  const cls = row["Class Name"];
  if (!classGroups[cls]) {
    classGroups[cls] = { 
      theory: new Set(), 
      labs: new Set(), 
      sections: new Map()
    };
  }

  if (row["Subject Type"] === "Theory" && row["Subject Name"]) {
    classGroups[cls].theory.add(row["Subject Name"]);
  }
  if (row["Subject Type"] === "Lab" && row["Lab Name"]) {
    classGroups[cls].labs.add(row["Lab Name"]);
  }

  // Store unique sections with their student counts
  const sectionName = row["Section"];
  if (sectionName && !classGroups[cls].sections.has(sectionName)) {
    classGroups[cls].sections.set(sectionName, row["Students"] || 0);
  }
});

// Convert to classes array
const classes = Object.keys(classGroups).map(cls => {
  const info = classGroups[cls];
  return {
    name: cls,
    subjects: [...info.theory],
    lab_subjects: [...info.labs],
    sections: Array.from(info.sections.entries()).map(([name, count]) => ({
      name,
      student_count: count
    }))
  };
});

// Process Rooms
const rooms = roomsData.map(room => room["Room Name"]);

// Process Labs and Lab Rooms
const labs = [...new Set(labsData.map(lab => lab["Lab Name"]))];
const labRooms = {};
labsData.forEach(lab => {
  const subject = lab["Subject"];
  const labName = lab["Lab Name"];
  if (!labRooms[subject]) labRooms[subject] = [];
  if (!labRooms[subject].includes(labName)) {
    labRooms[subject].push(labName);
  }
});

// Process Time Slots
const slots = slotsData.map(slot => slot["Slot Name"]);

// Process Teachers
const teachers = {};
const labTeachers = {};
teachersData.forEach(teacher => {
  const teacherName = teacher["Teacher Name"];
  const subject = teacher["Subject"];
  const type = teacher["Type"];
  
  if (type === "Theory") {
    if (!teachers[subject]) teachers[subject] = [];
    if (!teachers[subject].includes(teacherName)) {
      teachers[subject].push(teacherName);
    }
  } else if (type === "Lab") {
    if (!labTeachers[subject]) labTeachers[subject] = [];
    if (!labTeachers[subject].includes(teacherName)) {
      labTeachers[subject].push(teacherName);
    }
  }
});

// Process Teacher Unavailability
const teacherUnavailability = {};
unavailabilityData.forEach(unavail => {
  const teacherName = unavail["Teacher Name"];
  if (!teacherUnavailability[teacherName]) {
    teacherUnavailability[teacherName] = [];
  }
  teacherUnavailability[teacherName].push({
    day: unavail["Day"],
    slot: unavail["Slot"]
  });
});

// Process Lecture Requirements
const lectureRequirements = {};
lectureRequirementsData.forEach(req => {
  lectureRequirements[req["Subject"]] = req["Weekly Lectures"];
});

// Process Constraints
const constraints = {};
let labCapacity = 30; // default
constraintsData.forEach(constraint => {
  const type = constraint["Constraint Type"];
  const value = constraint["Value"];
  
  if (type === "lab_capacity") {
    labCapacity = parseInt(value);
  } else if (type === "distribute_across_week") {
    constraints[type] = value === "true" || value === true;
  } else {
    constraints[type] = parseInt(value);
  }
});

// -------------------
// 3. Generate the complete timetable object
// -------------------
const timetableData = {
  classes,
  rooms,
  labs,
  lab_rooms: labRooms,
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  slots,
  teachers,
  lab_teachers: labTeachers,
  teacher_unavailability: teacherUnavailability,
  lecture_requirements: lectureRequirements,
  lab_capacity: labCapacity,
  constraints
};

// -------------------
// 4. Set up Gemini Pro model (Optional - you can skip AI and use direct data)
// -------------------
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-pro",
  maxOutputTokens: 4096,
  temperature: 0.1,
  apiKey: process.env.GEMINI_API_KEY,
});

// -------------------
// 5. Option 1: Direct JSON output (Recommended)
// -------------------
console.log("✅ Generated Timetable JSON:");
console.log(JSON.stringify(timetableData, null, 2));

// Optional: Save to file
import fs from 'fs';
fs.writeFileSync('./generated_timetable.json', JSON.stringify(timetableData, null, 2));
console.log("💾 JSON saved to generated_timetable.json");

// -------------------
// 6. Option 2: Use AI for validation/enhancement (Optional)
// -------------------
const prompt = PromptTemplate.fromTemplate(`
You are a timetable JSON validator and enhancer.
Review the following timetable JSON and return an improved version with any corrections or enhancements.
Ensure all data is properly structured and consistent.

Return ONLY the corrected JSON:

{timetable_json}
`);

const chain = prompt.pipe(model);

// Uncomment below if you want AI validation
/*
(async () => {
  try {
    console.log("🤖 Validating with Gemini Pro...");
    const response = await chain.invoke({ 
      timetable_json: JSON.stringify(timetableData, null, 2) 
    });

    try {
      const content = response.content[0]?.text || response.content;
      const enhancedOutput = JSON.parse(content);
      console.log("✅ AI-Enhanced Timetable JSON:");
      console.log(JSON.stringify(enhancedOutput, null, 2));
      
      // Save enhanced version
      fs.writeFileSync('./enhanced_timetable.json', JSON.stringify(enhancedOutput, null, 2));
      console.log("💾 Enhanced JSON saved to enhanced_timetable.json");
      
    } catch (err) {
      console.error("❌ AI response parsing failed, using direct data");
      console.error("AI Response:", response.content);
    }
  } catch (err) {
    console.error("❌ Error calling Gemini Pro:", err);
    console.log("Using direct data conversion instead");
  }
})();
*/