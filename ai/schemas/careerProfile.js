const careerProfileSchema = {
  type: "object",

  properties: {
    personal: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        email: {
          type: "string",
        },
        phone: {
          type: "string",
        },
        location: {
          type: "string",
        },
      },
      required: [
        "name",
        "email",
        "phone",
        "location",
      ],
    },

    summary: {
      type: "string",
    },

    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          degree: {
            type: "string",
          },
          field: {
            type: "string",
          },
          institution: {
            type: "string",
          },
          graduationYear: {
            type: "string",
          },
        },
        required: [
          "degree",
          "field",
          "institution",
          "graduationYear",
        ],
      },
    },

    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: {
            type: "string",
          },
          role: {
            type: "string",
          },
          startDate: {
            type: "string",
          },
          endDate: {
            type: "string",
          },
          description: {
            type: "string",
          },
          technologies: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: [
          "company",
          "role",
          "startDate",
          "endDate",
          "description",
          "technologies",
        ],
      },
    },

    skills: {
      type: "object",
      properties: {
        programming: {
          type: "array",
          items: {
            type: "string",
          },
        },
        frontend: {
          type: "array",
          items: {
            type: "string",
          },
        },
        backend: {
          type: "array",
          items: {
            type: "string",
          },
        },
        databases: {
          type: "array",
          items: {
            type: "string",
          },
        },
        tools: {
          type: "array",
          items: {
            type: "string",
          },
        },
        other: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: [
        "programming",
        "frontend",
        "backend",
        "databases",
        "tools",
        "other",
      ],
    },

    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          description: {
            type: "string",
          },
          technologies: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: [
          "name",
          "description",
          "technologies",
        ],
      },
    },

    certifications: {
      type: "array",
      items: {
        type: "string",
      },
    },

    achievements: {
      type: "array",
      items: {
        type: "string",
      },
    },

    careerProfile: {
      type: "object",
      properties: {
        likelyRoles: {
          type: "array",
          items: {
            type: "string",
          },
        },
        experienceLevel: {
          type: "string",
        },
        primaryDomain: {
          type: "string",
        },
        careerInterests: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: [
        "likelyRoles",
        "experienceLevel",
        "primaryDomain",
        "careerInterests",
      ],
    },
  },

  required: [
    "personal",
    "summary",
    "education",
    "experience",
    "skills",
    "projects",
    "certifications",
    "achievements",
    "careerProfile",
  ],
};

export default careerProfileSchema;