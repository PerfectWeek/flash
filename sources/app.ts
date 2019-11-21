import express from "express";
import morgan from "morgan";
import cors from "cors";

import router from "./api/routes/router";
import bodyParser from "body-parser";

const app = express();

app.use(morgan("dev"), cors(), bodyParser());

app.use(router);

app.get("/", (req, res) =>
  res.status(200).send("Flash API du swag (prepare for lightspeed)")
);

export default app;
