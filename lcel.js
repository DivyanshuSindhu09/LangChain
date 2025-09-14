// LCEL stands for LangChain Expression Language

import {config} from "dotenv";
config()

import {ChatGoogleGenerativeAI} from "@langchain/google-genai"
import {PromptTemplate} from "@langchain/core/prompts"

//! creating a model
const model = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    maxOutputTokens: 2048,
    temperature: 0.7,
    apiKey: process.env.GEMINI_API_KEY
})

//! creating a prompt
const prompt = PromptTemplate.fromTemplate(
    `Explain the concept of {topic} to the beginner.`
)

//! creating the chain using LCEL
const chain = prompt.pipe(model)

//! run the chain with user input
const response = await chain.invoke({
    topic: "JSON"
})

console.log("response:\n", response.content)