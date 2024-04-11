#!/bin/bash

npm install
npm install -g pm2
pm2 start 'npm run start-be' --name be
pm2 start 'npm run start-fe' --name fe

