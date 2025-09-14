import {config} from "dotenv";
config()

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {SerpAPI} from "@langchain/community/tools/serpapi";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

const model = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    temperature: 0.7,
    maxOutputTokens: 2048,
    apiKey: process.env.GEMINI_API_KEY,
});

//! directly using built in tools

const searchTool = new SerpAPI(process.env.SERP_API_KEY, {
    location: "India",
});

const agent = await initializeAgentExecutorWithOptions(
    [searchTool],
    model
)

//! try a questions
const response = await agent.invoke({
    input: "Tell me latest new about Web Development in India",
})

console.log("Agent Response:\n", response);

/* 
{
  output: "Latest news in web development in India indicates a strong demand for skilled developers, particularly in technologies like MERN 
stack, React, and Angular. The 'Digital India' initiative continues to drive growth, leading to increased adoption of e-commerce and digital services. Key trends include a growing focus on Progressive Web Apps (PWAs), serverless architectures, and the integration of AI/ML into web applications. Remote work opportunities are also expanding, distributing tech talent more broadly, and companies are investing in cloud-native development and microservices for scalable solutions."
}
*/