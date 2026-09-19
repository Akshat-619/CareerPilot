const AI_API_URL =
  "http://localhost:5000/api";

export const analyzeResume = async (
  file,
  signal
) => {
  if (!file) {
    throw new Error("Please select a resume.");
  }

  const formData = new FormData();

  formData.append(
    "resume",
    file
  );

  const response = await fetch(
    `${AI_API_URL}/resume/analyze`,
    {
      method: "POST",
      body: formData,
      signal,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The AI server returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      "Resume analysis failed."
    );
  }

  return data;
};

export default analyzeResume;