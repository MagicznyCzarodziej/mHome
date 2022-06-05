import chalk from 'chalk';
import { Container } from 'typedi';

export interface Logger {
  info(message: string): void;
  error(message: string): void;
}

export type LoggerLevel = 'ALL' | 'ERROR';

export class ConsoleLogger implements Logger {
  constructor(private author: string, private level: LoggerLevel) {}

  info(message: string): void {
    if (this.level !== 'ERROR')
      console.log(
        `${chalk.bgBlue(' INFO ')} ${chalk.blue(this.author)}: ${message}`,
      );
  }

  error(message: string): void {
    console.log(
      `${chalk.bgRed(' ERROR ')} ${chalk.red(`${this.author}: ${message}`)}`,
    );
  }
}

export function Logger(author: string) {
  return function (object: any, propertyName: string, index?: number) {
    const level: LoggerLevel = Container.has('LoggerLevel')
      ? Container.get('LoggerLevel')
      : 'ALL';
    const logger = new ConsoleLogger(author, level);
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: (containerInstance) => logger,
    });
  };
}
