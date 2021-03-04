
# js-chat

JavaScript chat app, with Express backend and Postgres DB. Very much work in progress.

Right now it can connect to a database, create an user there and login/logout using cookies.

Will probably add a React UI later


----
Some scratchpad stuff:

* How does redirecting work? Refreshing the page?
  - Express res.redirect('/blabla') doesn't work if it's a post request!
    * https://stackoverflow.com/questions/43182358/express-login-with-redirect-using-node-js
  - should I load the page on frontend side..?
    - window.location = 'http://localhost:3003/app.html'
    - happens even if the request fails :/

* Shouldn't install Jest on top of Create-React-App's Jest. Figure out how to handle this.

```
POST /api/account/create
POST /api/account/login
POST /api/account/logout
GET /api/account/info

POST /api/channel/create
POST /api/channel/join
POST /api/channel/invite
POST /api/channel/leave channel name
GET /api/channel/info

POST /api/channel/send channel name, string? 
GET /api/channel/messages
...
```
