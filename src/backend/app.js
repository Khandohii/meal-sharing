import express from 'express';
import path from 'path';
import mealsRouter from './api/meals.js';
import reservationsRouter from './api/reservations.js';
import reveiewsRouter from './api/reviews.js';
import cors from 'cors';
import knex from './database.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const app = express();

const buildPath = path.join(__dirname, "../../dist");
const port = process.env.PORT || 3000;

// For week4 no need to look into this!
// Serve the built client html
app.use(express.static(buildPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cors());

router.use("/meals", mealsRouter);
router.use("/reservations", reservationsRouter);
router.use("/reviews", reveiewsRouter);

app.get("/my-route", (req, res) => {
  res.send("Hi friend");
});

app.get("/future-meals", async (req, res) => {
  try {
    const meals = await knex("meal").select("*").where('when', '>', knex.fn.now());

    if (meals.length > 0) {
      res.json(meals);
    } else{
      res.status(404).send("There is not future meals");
    }
  } catch (error) {
    throw error;
  }
});

app.get("/past-meals", async (req, res) => {
  try {
    const meals = await knex("meal").select("*").where('when', '<', knex.fn.now());

    if (meals.length > 0) {
      res.json(meals);
    } else{
      res.status(404).send("There is not past meals");
    }
  } catch (error) {
    throw error;
  }
});

app.get("/all-meals", async (req, res) => {
  try {
    const meals = await knex("meal").select("*");

    if (meals.length > 0) {
      res.json(meals);
    } else{
      res.status(404).send("There is not meals");
    }
  } catch (error) {
    throw error;
  }
});

app.get("/first-meal", async (req, res) => {
  try {
    const meals = await knex("meal").select("*").orderBy('id').limit(1);

    if (meals.length > 0) {
      res.json(meals);
    } else{
      res.status(404).send("There is not first meal");
    }
  } catch (error) {
    throw error;
  }
});

app.get("/last-meal", async (req, res) => {
  try {
    const meals = await knex("meal").select("*").orderBy('id', 'desc').limit(1);

    if (meals.length > 0) {
      res.json(meals);
    } else{
      res.status(404).send("There is not last meal");
    }
  } catch (error) {
    throw error;
  }
});

if (process.env.API_PATH) {
  app.use(process.env.API_PATH, router);
} else {
  throw "API_PATH is not set. Remember to set it in your .env file"
}

// for the frontend. Will first be covered in the react class
app.use("*", (req, res) => {
  res.sendFile(path.join(`${buildPath}/index.html`));
});

export default app;
