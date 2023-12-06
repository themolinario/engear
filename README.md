<div align="center"> <img alt="" width="200" height="200" src="">  <br> <br>

<h1>MERN Engear</h1>

</div>

## Introduction

Web App that allows sharing videos online and viewing different types of metrics


## Start project in local

- **Editor**：open the project with any editor
- **Start**:
  -  Locate yourself in the 'backend' folder and with terminal run 'npm run start'
  -  Locate yourself in the 'frontend' folder and with terminal run 'npm run dev'
- **Browswer**: Open browser in localhost with correct port



## Start project Docker

- **Docker desktop**：Open docker desktop
- **Docker compose**:
  - Open the terminal and locate yourself in the 'backend' folder, start the 'docker-compose up --build' command
  - Open the terminal and locate yourself in the 'frontend' folder, start the 'docker-compose up --build' command
  
## Start project Kubernetes

- **Docker desktop**：Open docker desktop and enable 'Kubernetes'
- **Kubectl**: open terminal and locate yourself in the 'kubernetes' folder and run these commands:
  - kubectl apply -f .\frontend-deployment.yaml
  - kubectl apply -f .\backend-deployment.yaml
  - kubectl apply -f .\frontend-service.yaml
  - kubectl apply -f .\frontend-service.yaml
- **Browswer**: Open browser in localhost with correct port

