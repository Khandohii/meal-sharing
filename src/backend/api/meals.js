const express = require("express");
const router = express.Router();
const knex = require("../database");

router.get("/", async (request, response) => {
  try {
    // knex syntax for selecting things. Look up the documentation for knex for further info
    const meals = await knex("meal").select("*");
    response.json(meals);
  } catch (error) {
    throw error;
  }
});

router.post('/', async (req, res) => {
  const data = req.body;
  try {
    if (data) {
      data.created_date = new Date();
      await knex('meal').insert(data);

      res.status(201).json(data)
    }
  } catch (error) {
    throw error;
  }
})

router.get("/:id", async (req, res) => {
  const reqId = +req.params.id;

  try {
    const meals = await knex("meal").select("*").where('id', reqId);

    if (meals.length > 0) {
      res.json(meals);
    } else{
      res.status(404).send("ID doesn't exist")
    }
  } catch (error) {
    throw error;
  }
});

router.put("/:id", async (req, res) => {
  const reqId = +req.params.id;
  const data = req.body;

  try {
    if (Object.keys(data).length !== 0) {
      const mealData = await knex('meal').where('id', reqId);

      if (mealData.length > 0) {
        await knex('meal').where('id', reqId).update(data)
        res.json(data)
      } else{
        res.status(404).send("ID doesn't exist")
      }
    } else{
      res.status(404).send("No data fot update")
    }
  } catch (error) {
    throw error;
  }
});

router.delete("/:id", async (req, res) => {
  const reqId = +req.params.id;

  try {
    const data = await knex('meal').where('id', reqId).del();

    if (data) {
      res.send('Deleted')
    } else{
      res.status(404).send('ID not found')
    }
  } catch (error) {
    throw error;
  }
});

module.exports = router;
