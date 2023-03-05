# How to migrate
1. Install typeorm cli and ts-node
   1. `yarn add global typeorm`
   2. `yarn add --dev ts-node`
2. Generate migration file
   1. `typeorm migration:create ./src/migrations/something-you-want-to-do`
3. Execute migration
   1. `yarn migration:run`

Reference
https://typeorm.io/migrations#how-migrations-work
