import { ExpressMiddleware } from 'app/interfaces/ExpressMiddleware';

/** Checks if `id` param is a number, and passes parsed id in `res.locals` */
export const validateAndParseId: ExpressMiddleware = (req, res, next) => {
  const { id } = req.params;
  const idInt = Number.parseInt(id);
  if (Number.isNaN(idInt))
    res.status(400).send({
      error: 'Invalid id',
    });
  else {
    res.locals.id = idInt;
    next();
  }
};
