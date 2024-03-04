const express = require("express");
const router = express.Router();
const knex = require("../database");

router.get("/", async (request, response) => {
  try {
    // knex syntax for selecting things. Look up the documentation for knex for further info
    const data = await knex("review").select("*");
    response.json(data);
  } catch (error) {
    throw error;
  }
});

router.post('/', async (req, res) => {
  const dataReq = req.body;

  console.log(dataReq);
  try {
    if (dataReq) {
      dataReq.created_date = new Date();
      await knex('review').insert(dataReq);

      res.status(201).json(dataReq);
    }
  } catch (error) {
    throw error;
  }
})

router.get("/:id", async (req, res) => {
  const reqId = +req.params.id;

  try {
    const data = await knex("review").select("*").where('id', reqId);

    if (data.length > 0) {
      res.json(data);
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
      const mealData = await knex('review').where('id', reqId);

      if (mealData.length > 0) {
        await knex('review').where('id', reqId).update(data)
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
    const data = await knex('review').where('id', reqId).del();

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
