#!/bin/bash

cd ./BE
npm install
cd ..

cd ./FE
npm install
cd ..

npm init
npm install
npm run start-all
