import { Logger } from 'app/utils/Logger';

import { ReadTemperatures } from 'app/scripts/ReadTemperatures';
import { RandomScript } from 'app/scripts/RandomScript';
import { Service } from 'typedi';

@Service()
export class Scripts {
  @Logger('Scripts')
  private readonly logger: Logger;

  registerScripts() {
    const onFired = (name: string, firedAt: Date) => {
      const plannedDate = firedAt.toLocaleString().replace('T', ' ');
      const actualDate = new Date().toLocaleString().replace('T', ' ');
      const delay =
        new Date().getUTCMilliseconds() - firedAt.getUTCMilliseconds();
      this.logger.info(
        `Script [${name}] planned on ${plannedDate} run at ${actualDate} (delay: ${delay}ms)`,
      );
    };

    // const scripts = [new RandomScript(), new ReadTemperatures()];
    const scripts = [new ReadTemperatures()];
    scripts.forEach((script) => {
      script.register((firedAt: Date) => {
        onFired(script.name, firedAt);
      });
      this.logger.info(`Script registered: ${script.name}`);
    });
  }
}
