import "dotenv/config";

const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",

    headers: {
      Authorization:
        `Bearer ${process.env.OPENROUTER_API_KEY}`,

      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      model:
        process.env.OPENROUTER_MODEL ||
        "openai/gpt-oss-20b:free",

      messages: [
        {
          role: "user",
          content: "Reply with exactly: OK",
        },
      ],
    }),
  }
);

console.log("STATUS:", response.status);

console.log(
  await response.text()
);