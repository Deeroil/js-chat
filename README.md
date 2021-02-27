
# js-chat

JavaScript chat app, with Express backend and Postgres DB. Very much work in progress.

Right now it can connect to a database, create an user there and login/logout using cookies.

Will probably add a React UI later


----
Some scratchpad stuff:
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
