import "dotenv/config";

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY;

// Use the exact model that successfully returned 200
const OPENROUTER_MODEL =
  "openai/gpt-oss-20b";


const extractJson = (content) => {
  if (!content || typeof content !== "string") {
    throw new Error(
      "The AI returned an empty response."
    );
  }

  let cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (
    start !== -1 &&
    end !== -1 &&
    end > start
  ) {
    try {
      return JSON.parse(
        cleaned.slice(start, end + 1)
      );
    } catch {}
  }

  console.error(
    "RAW AI RESPONSE:"
  );

  console.error(content);

  throw new Error(
    "The AI returned invalid JSON."
  );
};


export const analyzeResumeWithAI = async (
  resumeText
) => {

  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is missing from .env"
    );
  }

  if (
    !resumeText ||
    !resumeText.trim()
  ) {
    throw new Error(
      "Resume text is empty."
    );
  }


  const prompt = `
You are CareerPilot's Resume Intelligence Engine.

Analyze the resume below and extract the candidate's
career information.

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "personal": {
    "name": "",
    "email": "",
    "phone": "",
    "location": ""
  },

  "summary": "",

  "education": [
    {
      "degree": "",
      "field": "",
      "institution": "",
      "graduationYear": ""
    }
  ],

  "experience": [
    {
      "company": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "description": "",
      "technologies": []
    }
  ],

  "skills": {
    "programming": [],
    "frontend": [],
    "backend": [],
    "databases": [],
    "tools": [],
    "other": []
  },

  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
  ],

  "certifications": [],

  "achievements": [],

  "careerProfile": {
    "likelyRoles": [],
    "experienceLevel": "",
    "primaryDomain": "",
    "careerInterests": []
  }
}

RULES:

1. Extract information ONLY from the resume.
2. Never invent information.
3. Do not assume skills that are not present.
4. If information is missing, use "" or [].
5. Keep company names and role names exactly as written.
6. Keep education information accurate.
7. Separate employment experience from projects.
8. Extract technologies mentioned in experience and projects.
9. Put skills into the appropriate skill categories.
10. Determine likely roles only from evidence in the resume.
11. Determine experience level from actual experience.
12. Return JSON only.
13. Do NOT use markdown.
14. Do NOT use code fences.
15. Do NOT explain your answer.

RESUME
==================================================

${resumeText}

==================================================

Return the JSON object now.
`;


  console.log(
    "=========================================="
  );

  console.log(
    "Sending resume to OpenRouter..."
  );

  console.log(
    "Model:",
    OPENROUTER_MODEL
  );

  console.log(
    "Resume characters:",
    resumeText.length
  );

  console.log(
    "=========================================="
  );


  const response = await fetch(
    OPENROUTER_URL,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${OPENROUTER_API_KEY}`,

        "Content-Type":
          "application/json",

        "HTTP-Referer":
          "http://localhost:5175",

        "X-Title":
          "CareerPilot",
      },

      body: JSON.stringify({
        model: OPENROUTER_MODEL,

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0,
      }),
    }
  );


  let data;

  try {
    data =
      await response.json();
  } catch {
    throw new Error(
      "OpenRouter returned an invalid response."
    );
  }


  if (!response.ok) {

    console.error(
      "OPENROUTER ERROR:"
    );

    console.error(
      JSON.stringify(
        data,
        null,
        2
      )
    );

    throw new Error(
      data?.error?.message ||
      `OpenRouter request failed with status ${response.status}.`
    );
  }


  const content =
    data?.choices?.[0]?.message?.content;


  if (
    !content ||
    typeof content !== "string"
  ) {

    console.error(
      "OPENROUTER RESPONSE:"
    );

    console.error(
      JSON.stringify(
        data,
        null,
        2
      )
    );

    throw new Error(
      "The AI returned an empty response."
    );
  }


  console.log(
    "OpenRouter response received."
  );


  const profile =
    extractJson(content);


  console.log(
    "Resume profile extracted successfully."
  );


  return {
    profile,

    model:
      data?.model ||
      OPENROUTER_MODEL,

    usage:
      data?.usage ||
      null,
  };
};


export default analyzeResumeWithAI;