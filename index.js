import { config } from "dotenv";
config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";

//! set the model
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
  apiKey: process.env.GEMINI_API_KEY,
});

//! create a prompt
const prompt = PromptTemplate.fromTemplate(
  `Explain the concept of {topic} to the beginner.`
);

//! create the chain
const chain = new LLMChain({
  llm: model,
  prompt: prompt,
});

//! run the chain
const res = await chain.run({
  topic: "Quantum Computing",
});

console.log("Gemini Response:\n", res);
