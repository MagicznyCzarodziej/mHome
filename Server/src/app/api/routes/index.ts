import Express from 'express';

import { thermometers } from 'app/api/routes/thermometers';
import { lights } from 'app/api/routes/lights';
import { groups } from 'app/api/routes/groups';
import { reeds } from 'app/api/routes/reeds';
import { blinds } from 'app/api/routes/blinds';
import { scenarios } from 'app/api/routes/scenarios';
import { security } from 'app/api/routes/security';
import { msg } from 'app/api/routes/msg';

const router = Express.Router();
router.use('/thermometers', thermometers);
router.use('/lights', lights);
router.use('/groups', groups);
router.use('/reeds', reeds);
router.use('/blinds', blinds);
router.use('/scenarios', scenarios);
router.use('/security', security);
router.use('/msg', msg);

export { router };
