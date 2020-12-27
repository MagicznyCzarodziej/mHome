import { StandardLogger } from 'app/utils/Logger';

import { ReadTemperatures } from 'app/scripts/ReadTemperatures';
import { RandomScript } from 'app/scripts/RandomScript';

export function registerScripts() {
  const scriptsLogger = new StandardLogger('Scripts');
  const onFired = function (firedAt: Date) {
    const plannedDate = firedAt.toLocaleString().replace('T', ' ');
    const actualDate = new Date().toLocaleString().replace('T', ' ');
    const delay =
      new Date().getUTCMilliseconds() - firedAt.getUTCMilliseconds();
    scriptsLogger.info(
      `Script [${this.name}] planned on ${plannedDate} run at ${actualDate} (delay: ${delay}ms)`
    );
  };

  // const scripts = [new RandomScript(), new ReadTemperatures()];
  const scripts = [new ReadTemperatures()];
  scripts.forEach((script) => {
    script.register(onFired.bind(script));
    scriptsLogger.info(`Script registered: ${script.name}`);
  });
}
