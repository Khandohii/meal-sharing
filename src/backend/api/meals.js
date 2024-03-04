import express from 'express';
import knex from '../database.js';

const router = express.Router();

function dateFormat(date) {
  const parts = date.split('-');
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return new Date(year, month - 1, day); 
}

router.get("/", async (req, res) => {

  try {
    const {maxPrice, limit, title, dateAfter, dateBefore, sortKey, sortDir, availableReservations} = req.query;
    
    let meals = knex("meal").select("*");

    if (maxPrice) {
      meals = meals.where('price', '<=', parseInt(maxPrice));
    }

    if (limit) {
      meals = meals.limit(parseInt(limit));
    }

    if (title) {
      meals = meals.where('title', 'like', `%${title}%`);
    }

    if (dateAfter) {
      meals = meals.where('when', '>', dateFormat(dateAfter));
    }

    if (dateBefore) {
      meals = meals.where('when', '<', dateFormat(dateBefore));
    }

    if (sortKey && !sortKey) {
      meals = meals.orderBy(sortKey);
    }

    if (sortDir && sortKey) {
      meals = meals.orderBy(sortKey, sortDir);
    }

    if (availableReservations) {

      if (availableReservations === true) {
        meals = meals.leftJoin('reservation', 'reservation.meal_id', '=', 'meal.id')
        .whereRaw('max_reservations > COALESCE(reservation.number_of_guests, 0)')
        .groupBy('meal.id')
      }
    }

    const finalQuery = await meals;

    res.json(finalQuery);
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

router.get("/:id/reviews", async (req, res) => {
  const reqId = +req.params.id;

  try {
    const data = await knex("review").select("*").where('meal_id', reqId);

    if (data.length > 0) {
      res.json(data);
    } else{
      res.status(404).send("Reviews don't exist");
    }
  } catch (error) {
    throw error;
  }
});

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

export default router;

