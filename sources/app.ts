import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.get('/', (req, res) => res.status(200).send("Flash API du swag (prepare for lightspeed)"));

export default app;
