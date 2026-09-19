import "dotenv/config";

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

const API_KEY =
  process.env.OPENROUTER_API_KEY;

const MODEL =
  process.env.OPENROUTER_MODEL ||
  "openai/gpt-oss-20b:free";

export const analyzeResumeWithAI = async (resumeText) => {
  if (!API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing.");
  }

  const prompt = `
You are CareerPilot, a resume analysis system.

Analyze this resume and return ONLY valid JSON.

Use exactly this structure:

{
  "personal": {
    "name": "",
    "email": "",
    "phone": "",
    "location": ""
  },
  "summary": "",
  "education": [],
  "experience": [],
  "skills": {
    "programming": [],
    "frontend": [],
    "backend": [],
    "databases": [],
    "tools": [],
    "other": []
  },
  "projects": [],
  "certifications": [],
  "achievements": [],
  "careerProfile": {
    "likelyRoles": [],
    "experienceLevel": "",
    "primaryDomain": "",
    "careerInterests": []
  }
}

Rules:
- Extract ONLY information present in the resume.
- Never invent information.
- Missing information must be empty.
- Return JSON only.
- Do not use markdown.
- Do not use code fences.

RESUME:

${resumeText}
`;

  console.log("Sending resume to OpenRouter...");
  console.log("Model:", MODEL);
  console.log("Resume characters:", resumeText.length);

  const response = await fetch(
    OPENROUTER_URL,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: MODEL,
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

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "OPENROUTER ERROR:",
      JSON.stringify(data, null, 2)
    );

    throw new Error(
      data?.error?.message ||
      `OpenRouter error ${response.status}`
    );
  }

  const content =
    data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(
      "OpenRouter returned an empty response."
    );
  }

  console.log("OpenRouter response received.");

  let cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let profile;

  try {
    profile = JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error(
        "AI returned invalid JSON."
      );
    }

    profile = JSON.parse(
      cleaned.slice(start, end + 1)
    );
  }

  return {
    profile,
    model: data?.model || MODEL,
    usage: data?.usage || null,
  };
};

export default analyzeResumeWithAI;