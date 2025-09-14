import { config } from "dotenv";
config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

//! create model
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  maxOutputTokens: 4096,
  temperature: 0.3, // kam rakha so JSON stable bane
  apiKey: process.env.GEMINI_API_KEY,
});

//! create prompt
const prompt = PromptTemplate.fromTemplate(`
You are a timetable JSON generator.
Return only valid JSON.
In "lecture_requirements", include ONLY theory subjects (not lab subjects).
Follow exactly this structure:

{{
  "classes": [
    {{
      "name": "string",
      "subjects": ["string"],
      "lab_subjects": ["string"],
      "sections": [
        {{ "name": "string", "student_count": number }}
      ]
    }}
  ],
  "rooms": ["string"],
  "labs": ["string"],
  "lab_rooms": {{ "subject": ["string"] }},
  "days": ["string"],
  "slots": ["string"],
  "teachers": {{ "subject": ["string"] }},
  "lab_teachers": {{ "lab_subject": ["string"] }},
  "teacher_unavailability": {{ "teacher_name": [ {{ "day":"string","slot":"string" }} ] }},
  "lecture_requirements": {{ "subject": number }},
  "lab_capacity": number,
  "constraints": {{
    "max_lectures_per_day_teacher": number,
    "max_lectures_per_subject_per_day": number,
    "min_lectures_per_day_section": number,
    "max_lectures_per_day_section": number,
    "lab_session_duration": number,
    "distribute_across_week": boolean
  }}
}}

Now generate timetable JSON for the following case:

{class_info}
`);

//! create chain
const chain = prompt.pipe(model);

//! run with input
const response = await chain.invoke({
  class_info: `There is one class: CSE 3rd Year. It has the following theory subjects: IT, OOP, COA, DSA, OB, EITK, PS, and the following lab subjects: IT LAB, DSA LAB, OOP LAB. The class has two sections: A with 84 students and B with 84 students. Available rooms are 301, 300, 338, 340. Labs are 308, 339, 337, 335, 311, 333. Lab_rooms mapping: IT LAB → [337, 335], DSA LAB → [339, 311], OOP LAB → [308, 333]. Working days are Monday to Friday, and the slots are 9:00-9:55, 9:55-10:50, 10:50-11:45, 11:45-12:40, Lunch Break, 2:00-2:55, 2:55-3:50, 3:50-4:45. Teachers are: IT → Dr. Karambir and Mr. Abhishek; OOP → Mrs. Manisha and Mr. Divyansh; COA → Mrs. Shikha; DSA → Dr. Sona; OB → Dr. Sakshi; EITK → Dr. Randhir; PS → Ms. Neha Kalyan. Lab teachers are: IT LAB → Dr. Karambir and Dr. Shikha Bhardwaj; OOP LAB → Mrs. Manisha and Mrs. Shikha; DSA LAB → Dr. Sona and Mr. Rohan. Teacher unavailability is: Dr. Karambir on Friday 9:00-9:55, Mrs. Manisha on Wednesday 3:50-4:45, and Dr. Sona on Friday 2:00-2:55. Lecture requirements are IT(3), OOP(4), COA(3), DSA(4), OB(3), EITK(2), PS(3). Lab capacity is 30. Constraints: max_lectures_per_day_teacher=5, max_lectures_per_subject_per_day=2, min_lectures_per_day_section=4, max_lectures_per_day_section=6, lab_session_duration=2, and distribute_across_week=true. Generate only valid JSON strictly following the timetable schema, with no explanations or extra text.`
});

//! parse JSON
let output;
try {
  output = JSON.parse(response.content[0]?.text || response.content);
  console.log("✅ Final JSON:\n", output);
} catch (err) {
  console.error("❌ Invalid JSON received:", response.content);
}
