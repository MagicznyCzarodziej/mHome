import Express from 'express';

import { thermometers } from 'app/routes/thermometers';
import { lights } from 'app/routes/lights';
import { groups } from 'app/routes/groups';
import { reeds } from 'app/routes/reeds';
import { blinds } from 'app/routes/blinds';
import { scenarios } from 'app/routes/scenarios';
import { security } from 'app/routes/security';

const router = Express.Router();
router.use('/thermometers', thermometers);
router.use('/lights', lights);
router.use('/groups', groups);
router.use('/reeds', reeds);
router.use('/blinds', blinds);
router.use('/scenarios', scenarios);
router.use('/security', security);

export { router };
