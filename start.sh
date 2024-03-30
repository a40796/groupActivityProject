#!/bin/bash

cd ./BE
npm install
cd ..

cd ./FE
npm install
npm run build
cd ..

npm init
npm install
npm run start-all
