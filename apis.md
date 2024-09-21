# DevTinder APIs

### authRouter

- POST /signup
- POST /login
- POST /logout

### profileRouter

- GET /profile/view
- PATCH /prfile/edit
- PATCH /profile/forget => forget password
- DELETE /profile/delete
- PATCH /profile/change/password => change password

### connectionRequestRouter

- POST /request/send/ignored/:userId
- POST /request/send/accepted/:userId
- POST /request/receive/accepted/:requestId
- POST /request/receive/rejected/:requestId

### userRouter

- GET /user/feed
- GET /user/requests
- GET /user/connections

- post/notification
- post/onlinestatuschange
