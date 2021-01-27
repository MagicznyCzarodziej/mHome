import Express from 'express';

import { thermometers } from 'app/routes/thermometers';
import { lights } from 'app/routes/lights';
import { groups } from 'app/routes/groups';
import { reeds } from 'app/routes/reeds';

const router = Express.Router();
router.use('/thermometers', thermometers);
router.use('/lights', lights);
router.use('/groups', groups);
router.use('/reeds', reeds);

export { router };
