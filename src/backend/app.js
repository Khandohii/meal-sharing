const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");

const mealsRouter = require("./api/meals");
const buildPath = path.join(__dirname, "../../dist");
const port = process.env.PORT || 3000;
const cors = require("cors");
const knex = require("./database");

// For week4 no need to look into this!
// Serve the built client html
app.use(express.static(buildPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cors());

router.use("/meals", mealsRouter);

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

module.exports = app;
