import Express from 'express';

import { thermometer } from 'app/routes/thermometer';

const router = Express.Router();
router.use('/thermometer', thermometer);

export { router };
