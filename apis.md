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

- POST /request/send/:status/:userId => status - "interested", "ignored"
- POST /request/receive/:status/:requestId => status - "accepted", "rejected"

### userRouter

- GET /user/feed
- GET /user/requests
- GET /user/connections

- post/notification
- post/onlinestatuschange
