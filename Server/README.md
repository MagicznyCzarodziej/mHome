# Setup

1. Install dependencies

`yarn install`

2. Generate Prisma Client from schema

`yarn run db:generate`

`yarn run prisma migrate dev` to create migration

`yarn run prisma migrate deploy` to create tables in database

Optional: Insert default data (groups, elements, etc.) to database
`yarn run db:seed` WARNING! This will erase all data from existing database (states, history, logs, etc.)

If the schema was changed, you need to run `yarn migrate dev` and `yarn migrate deploy` to update database to new schema.

3. Set SerialComumunicator path

`SET SERIAL_PATH=COM5` // Windows

`EXPORT SERIAL_PATH=/dev/???` // Linux

4. Build
`yarn build`

5. Run server
   
`yarn start`

Or run in watch mode for development

`yarn watch`
