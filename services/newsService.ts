
import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse, Source } from "../types"; // Import TypeScript types for structured response

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); // Initialize Google Generative AI client using API key from environment variables

const MODEL_NAME = 'gemini-2.5-flash';

// Function to analyze news text and detect fake news
export const analyzeNews = async (text: string): Promise<AnalysisResponse> => {
  if (!text || text.trim().length < 20) {  // Validate input: ensure text exists and is long enough for analysis
    throw new Error("Please provide a longer text snippet (at least 20 characters) for a strict analysis.");
  }

  try {
    // Call Gemini model to generate analysis
    const response = await ai.models.generateContent({
      model: MODEL_NAME,   // Prompt sent to the AI model
      contents:  `
      Act as "AI FactGuard", a high-strictness fake news detection system. 
      
      YOUR TASK:
      1. **Search & Verify**: You have access to Google Search. USE IT to verify the claims in the text below.
      2. **Strict Classification**:
         - **Fake**: If claims are debunked, conspiracy theories, or contrary to established facts.
         - **Satire**: If the source is known for satire (e.g., The Onion) or obvious humor.
         - **Real**: ONLY if claims are corroborated by reputable sources found in your search.
         - **Unsure**: If no verifying information is found.
      3. **Analyze Style**: Check for clickbait, emotional manipulation, and logical fallacies.

      Text to analyze:
      """
      ${text}
      """

      OUTPUT FORMAT:
      You CANNOT use a schema, so you must produce valid JSON text strictly.
      Return a SINGLE JSON object with this structure:
      {
        "classification": "Real" | "Fake" | "Satire" | "Unsure",
        "confidence": number, // 0-100
        "summary": "string", // Short explanation (max 2 sentences)
        "reasoning": "string", // Detailed technical explanation referencing the search results
        "redFlags": ["string", "string"] // List of specific red flags found
      }
      
      Do not include markdown code blocks (like \`\`\`json). Just the raw JSON string.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseSchema and responseMimeType are NOT allowed when using googleSearch tool
      }
    });

    let jsonText = response.text || "";
    
    // Clean up markdown if the model adds it despite instructions
    jsonText = jsonText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
    
    let data: AnalysisResponse;
    try {
      // Find the JSON object in the response text
      const jsonStartIndex = jsonText.indexOf('{');
      const jsonEndIndex = jsonText.lastIndexOf('}');
      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        jsonText = jsonText.substring(jsonStartIndex, jsonEndIndex + 1);
        data = JSON.parse(jsonText);
      } else {
        throw new Error("Invalid JSON format in response");
      }
    } catch (e) {
      console.error("Failed to parse AI response:", jsonText);
      throw new Error("Analysis completed but the report format was invalid. Please try again.");
    }

    // Extract sources from Grounding Metadata
    const sources: Source[] = [];
    // Access groundingChunks safely
    // @ts-ignore - The SDK types might lag behind the actual response structure for grounding
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const uniqueUrls = new Set<string>();

    chunks.forEach((chunk: any) => {
      if (chunk.web && chunk.web.uri && chunk.web.title) {
        if (!uniqueUrls.has(chunk.web.uri)) {
          uniqueUrls.add(chunk.web.uri);
          sources.push({
            title: chunk.web.title,
            url: chunk.web.uri
          });
        }
      }
    });

    data.sources = sources;
    //console.log("AI FactGuard Analysis Completed:");
    //console.log(JSON.stringify(data, null, 2)); 
    console.log("RAW AI RESPONSE:", response);
    console.log("EXTRACTED JSON TEXT:", jsonText);
    console.log("FINAL PARSED JSON:", JSON.stringify(data, null, 2));

    // ----------------------------

    return data;


  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("AI Analysis failed. The service might be overloaded or the text was flagged for safety.");
  }
};
