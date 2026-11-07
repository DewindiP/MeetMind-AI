const { GoogleGenAI } = require("@google/genai");

async function generateContentWithRetry(ai, request, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent(request);
    } catch (error) {
      const status = Number(error.status || error.statusCode);

      const isTemporaryError = [429, 500, 502, 503, 504].includes(status);

      if (!isTemporaryError || attempt === maxAttempts) {
        const apiError = new Error(
          isTemporaryError
            ? "Gemini AI is temporarily unavailable. Please try again later."
            : "Failed to generate the meeting summary."
        );

        apiError.statusCode = isTemporaryError ? 503 : 502;
        throw apiError;
      }

      const delay = 1000 * Math.pow(2, attempt - 1);

      console.log(
        `Gemini API temporary error (${status}). Retry ${attempt}/${maxAttempts} in ${delay}ms.`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function generateMeetingSummary(input) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("Gemini AI is not configured on this server.");
    error.statusCode = 503;
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
You are an assistant that organizes meeting notes.
Use only the information supplied. Do not invent decisions, dates, or assignments.
If information is missing, use an empty array or null.

Return valid JSON with this structure:
{
  "summary": "A concise summary",
  "decisions": ["Decision 1"],
  "actionItems": [
    {
      "title": "Task title",
      "description": "Task details or null",
      "assignee": "Person or null",
      "dueDate": null
    }
  ]
}

Meeting title: ${input.title}
Meeting description: ${input.description || ""}
Attendees: ${JSON.stringify(input.attendees || [])}
Meeting notes:
${input.notes}
`;

  const response = await generateContentWithRetry(ai, {
  model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
  },
});

  const text = response.text;

  if (!text) {
    const error = new Error("The AI service returned an empty response.");
    error.statusCode = 502;
    throw error;
  }

  let result;

  try {
    result = JSON.parse(text);
  } catch {
    const error = new Error("The AI service returned an invalid response.");
    error.statusCode = 502;
    throw error;
  }

  if (
    typeof result.summary !== "string" ||
    !Array.isArray(result.decisions) ||
    !Array.isArray(result.actionItems)
  ) {
    const error = new Error("The AI response did not match the expected format.");
    error.statusCode = 502;
    throw error;
  }

  return {
    summary: result.summary,
    decisions: result.decisions.filter((item) => typeof item === "string"),
    actionItems: result.actionItems
      .filter((item) => item && typeof item.title === "string")
      .map((item) => ({
        title: item.title.slice(0, 300),
        description:
          typeof item.description === "string"
            ? item.description.slice(0, 10000)
            : null,
        assignee:
          typeof item.assignee === "string"
            ? item.assignee.slice(0, 150)
            : null,
        dueDate:
          typeof item.dueDate === "string" &&
          !Number.isNaN(Date.parse(item.dueDate))
            ? new Date(item.dueDate)
            : null,
      })),
  };
}

module.exports = { generateMeetingSummary };