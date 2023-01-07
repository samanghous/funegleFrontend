# FunOmegle or Funegle Front end (vue js)
# Deployment at render.com https://frontend-qudg.onrender.com

# Demo

## Login Page
<img width="959" alt="login" src="https://user-images.githubusercontent.com/62466836/211167274-d695a90b-252e-4aa7-981e-458e52711138.png">

## OTP Received (otp send by backend to respective email && stored in db as hashed format)
<img width="746" alt="otp email" src="https://user-images.githubusercontent.com/62466836/211167275-e0061fa9-8387-4fcb-9e94-b2701423274e.png">

## OTP Page
<img width="953" alt="otp" src="https://user-images.githubusercontent.com/62466836/211167281-9856c09d-1bdc-4184-b1fd-d4da83cfaa1e.png">

## Main page section (Chose intersted topics in dropdown)
<img width="960" alt="main page" src="https://user-images.githubusercontent.com/62466836/211167304-2dcfa9f7-ae86-4aba-bc24-a012b67dbc95.png">

## Chat random stranger (on a common topic chosen by both)
<img width="960" alt="stream" src="https://user-images.githubusercontent.com/62466836/211167310-a6a0b0c6-fe85-4080-8dae-0d825304ebe3.png">

## Backend app project link https://github.com/samanghous/funeglebackend
 
## Use case of this project
- In original Omegle it annoying when it become extravagantly random .
- We have to discard a tons of match before actually matching a right person.
- Common interest is needed for before match.
- This project solves this problem

## Features of this project
- Twilio Third Party Api used for video streaming and video room maintenance
- Otp based login
- Otp hashed in backend
- Otp expires after 10 min
- Separate node & express backend deployed and running
- Jwt Token System is used where 
- Token is saved in users local storage after login & removed after expiry/logout


