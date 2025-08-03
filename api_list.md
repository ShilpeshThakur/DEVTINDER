# DevTinder Api

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId


## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profiles of other users of platform



Status : ignored, interested, accepted, rejected