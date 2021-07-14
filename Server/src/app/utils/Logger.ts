import chalk from 'chalk';

export interface Logger {
  info(message: string): void;
  error(message: string): void;
}

export class StandardLogger implements Logger {
  constructor(private author: string, private infoDisabled?: boolean) {}

  info(message: string): void {
    if (!this.infoDisabled)
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
