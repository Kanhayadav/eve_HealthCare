import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "EVE Healthcare API",
      version: "1.0.0",
      description: "Diagnostic booking and payment API",
    },

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    paths: {
      "/api/v1/auth/signup": {
        post: {
          summary: "Create a new user",
          responses: {
            201: {
              description: "User registered",
            },
            400: {
              description: "Invalid request",
            },
          },
        },
      },

      "/api/v1/auth/login": {
        post: {
          summary: "Login user",
          responses: {
            200: {
              description: "Login successful",
            },
            401: {
              description: "Invalid credentials",
            },
          },
        },
      },

      "/api/v1/auth/logout": {
        post: {
          summary: "Logout user",
          responses: {
            200: {
              description: "Logout successful",
            },
          },
        },
      },

      "/api/v1/centre": {
        get: {
          summary: "Get diagnostic centres",
          responses: {
            200: {
              description: "List of centres",
            },
          },
        },
      },

      "/api/v1/booking": {
        post: {
          summary: "Create diagnostic booking",
          responses: {
            201: {
              description: "Booking created",
            },
            400: {
              description: "Invalid appointment",
            },
            401: {
              description: "Unauthorized",
            },
            404: {
              description: "Centre does not offer test",
            },
          },
        },
      },

      "/api/v1/payments": {
        post: {
          summary: "Process simulated payment",
          responses: {
            200: {
              description: "Payment processed",
            },
            404: {
              description: "Booking not found",
            },
          },
        },
      },

      "/api/v1/payments/webhook": {
        post: {
          summary: "Process payment webhook",
          responses: {
            200: {
              description: "Webhook processed",
            },
            404: {
              description: "Booking not found",
            },
          },
        },
      },
    },
  },

  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);