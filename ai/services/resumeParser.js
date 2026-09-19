import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const extractPdfText = async (
  buffer
) => {
  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result =
      await parser.getText();

    return result.text || "";
  } finally {
    await parser.destroy();
  }
};

const extractDocxText = async (
  buffer
) => {
  const result =
    await mammoth.extractRawText({
      buffer,
    });

  return result.value || "";
};

export const extractResumeText =
  async (file) => {
    if (!file) {
      throw new Error(
        "Resume file is required."
      );
    }

    const fileName =
      file.originalname.toLowerCase();

    if (
      file.mimetype ===
        "application/pdf" ||
      fileName.endsWith(".pdf")
    ) {
      return extractPdfText(
        file.buffer
      );
    }

    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      return extractDocxText(
        file.buffer
      );
    }

    throw new Error(
      "Only PDF and DOCX resumes are supported."
    );
  };