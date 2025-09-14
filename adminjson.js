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

/* 
PS C:\Users\wel\Desktop\langchain> node .\adminjson.js
[dotenv@17.2.2] injecting env (2) from .env -- tip: ⚙️  enable debug logging with { debug: true }
📊 Available sheets: [
  'Classes',
  'Slots',
  'Rooms',
  'Labs',
  'Teachers',
  'Unavailability',
  'LectureRequirements',
  'Constraints'
]
✅ Generated Timetable JSON:
{
  "classes": [
    {
      "name": "CSE 3rd Year",
      "subjects": [
        "IT",
        "OOP",
        "COA",
        "DSA",
        "OB",
        "EITK",
        "PS"
      ],
      "lab_subjects": [
        "IT LAB",
        "DSA LAB",
        "OOP LAB"
      ],
      "sections": [
        {
          "name": "A",
          "student_count": 84
        },
        {
          "name": "B",
          "student_count": 84
        }
      ]
    },
    {
      "name": "CSE 5th Year",
      "subjects": [
        "SE",
        "DBS",
        "WIT",
        "ISE",
        "ML"
      ],
      "lab_subjects": [
        "WIT LAB",
        "DBS LAB",
        "ML LAB"
      ],
      "sections": [
        {
          "name": "A",
          "student_count": 80
        },
        {
          "name": "B",
          "student_count": 78
        }
      ]
    }
  ],
  "rooms": [
    "301",
    "300",
    "338",
    "340"
  ],
  "labs": [
    "308",
    "339",
    "337",
    "335",
    "311",
    "333"
  ],
  "lab_rooms": {
    "OOP LAB": [
      "308",
      "333"
    ],
    "DBS LAB": [
      "308",
      "311"
    ],
    "DSA LAB": [
      "339",
      "311"
    ],
    "ML LAB": [
      "339",
      "337"
    ],
    "IT LAB": [
      "337",
      "335"
    ],
    "WIT LAB": [
      "335",
      "333"
    ]
  },
  "days": [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
  ],
  "slots": [
    "9:00-9:55",
    "9:55-10:50",
    "10:50-11:45",
    "11:45-12:40",
    "Lunch Break",
    "2:00-2:55",
    "2:55-3:50",
    "3:50-4:45"
  ],
  "teachers": {
    "IT": [
      "Dr. Karambir",
      "Mr. Abhishek"
    ],
    "OOP": [
      "Mrs. Manisha",
      "Mr. Divyansh"
    ],
    "COA": [
      "Mrs. Shikha"
    ],
    "DSA": [
      "Dr. Sona"
    ],
    "OB": [
      "Dr. Sakshi"
    ],
    "EITK": [
      "Dr. Randhir"
    ],
    "PS": [
      "Ms. Neha Kalyan"
    ],
    "SE": [
      "Mr. Pankaj"
    ],
    "DBS": [
      "Mrs. Jyoti"
    ],
    "WIT": [
      "Mrs. Pragya",
      "Mr. Atul"
    ],
    "ISE": [
      "Dr. Nikhil"
    ],
    "ML": [
      "Mrs. Priya"
    ]
  },
  "lab_teachers": {
    "IT LAB": [
      "Dr. Karambir",
      "Dr. Shikha Bhardwaj"
    ],
    "OOP LAB": [
      "Mrs. Manisha",
      "Mrs. Shikha"
    ],
    "DSA LAB": [
      "Dr. Sona",
      "Mr. Rohan"
    ],
    "WIT LAB": [
      "Mrs. Pragya",
      "Mr. Rohan"
    ],
    "DBS LAB": [
      "Mrs. Jyoti"
    ],
    "ML LAB": [
      "Mrs. Priya",
      "Mr. Abhishek"
    ]
  },
  "teacher_unavailability": {
    "Dr. Karambir": [
      {
        "day": "Friday",
        "slot": "9:00-9:55"
      }
    ],
    "Mrs. Manisha": [
      {
        "day": "Wednesday",
        "slot": "3:50-4:45"
      }
    ],
    "Dr. Sona": [
      {
        "day": "Friday",
        "slot": "2:00-2:55"
      }
    ]
  },
  "lecture_requirements": {
    "IT": 3,
    "OOP": 4,
    "COA": 3,
    "DSA": 4,
    "OB": 3,
    "EITK": 2,
    "PS": 3,
    "SE": 3,
    "DBS": 3,
    "WIT": 3,
    "ISE": 3,
    "ML": 4
  },
  "lab_capacity": 30,
  "constraints": {
    "max_lectures_per_day_teacher": 5,
    "max_lectures_per_subject_per_day": 2,
    "min_lectures_per_day_section": 4,
    "max_lectures_per_day_section": 6,
    "lab_session_duration": 2,
    "distribute_across_week": true
  }
}
*/