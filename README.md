
# js-chat

JavaScript chat app, with Express backend and Postgres DB. Very much work in progress.

Right now it can connect to a database, create an user there and login/logout using cookies.

Backend tested with Jest, can be run with ```npm test```

Will probably add a React UI and a dockerfile later...

### Installation and running

Clone the repo and ``npm install``.

Add ```.env``` file to root of the directory, it should have info about the database and a secret for creating login cookies:
```
PGDATABASE=db
PGDATABASE_TEST=db_test
PGUSER=user
PGPASSWORD=pw
SECRET=yoursecret
```

### Endpoints

```GET /postgres``` - shows pg version info

```GET /api/account/info``` - logged in user's info

```POST /api/account/create``` - create new user

```POST /api/account/login``` - create login cookie if user's in the DB

```POST /api/account/logout``` - clear login cookie


-------

Some scratchpad stuff:

* How does redirecting work? Refreshing the page?
  - Express res.redirect('/blabla') doesn't work if it's a post request!
    * https://stackoverflow.com/questions/43182358/express-login-with-redirect-using-node-js
  - should I load the page on frontend side..?
    - window.location = 'http://localhost:3003/app.html'
    - happens even if the request fails :/

* Shouldn't install Jest on top of Create-React-App's Jest. Figure out how to handle this.

Some other endpoints to make:

```
POST /api/channel/create
POST /api/channel/join
POST /api/channel/invite
POST /api/channel/leave (channel name or id)
GET /api/channel/info

POST /api/channel/send (channel name, message)
GET /api/channel/messages
...
```
