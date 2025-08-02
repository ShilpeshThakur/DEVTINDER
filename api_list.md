# DevTinder Api

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/requestId
- POST /request/review/rejected/:requestId

userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - Gets you the profiles of other users of platform



Status : ignored, interested, accepted, rejected