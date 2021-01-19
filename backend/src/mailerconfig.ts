import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

// You can load you .env file here synchronously using dotenv package
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const environment = process.env.NODE_ENV || '';
const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`));
// You can also make a singleton service that load and expose the .env file content.
// ...

const config: MailerOptions = {
  transport: {
    host: data.MAILER_HOST,
    port: data.MAILER_PORT,
    ignoreTLS: data.MAILER_TLS,
    secure: data.MAILER_SECURE,
    auth: {
      user: data.MAILER_USER,
      pass: data.MAILER_PASSWORD,
    },
  },
  defaults: {
    from: data.MAILER_FROM,
  },
  preview: data.DEBUG,
  template: {
    dir: process.cwd() + '/../frontend/src/mailer/',
    adapter: new PugAdapter(),
    options: {
      strict: true,
    },
  },
};

export = config;
