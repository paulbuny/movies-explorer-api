# Diploma project - Movie explorer api
Api for the Yandex.Praktikum diploma project

# Link to live API
Link to server https://api.peacewalker.nomoredomains.icu/

# Runing on your local machine
In order to run this project on your local machine
1. Clone repo
2. Run > `npm install`
3. Create .env file inside home directory of this project with next content inside.
    ```
    PORT=3000
    NODE_ENV=development
    JWT_SECRET='super_secret_key'
    ```
4. Run your Mongo DB > `mongod`
5. Run > `npm run start` to run production version,
<br>or `npm run dev` to start dev version
