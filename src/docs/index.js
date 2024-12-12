const YAML = require("yamljs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const setupSwagger = (app) => {
  const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Diary API Documentation",
    })
  );
};

module.exports = setupSwagger;
