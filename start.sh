#!/bin/bash

cd ./BE
npm install
npm start &

echo "waiting..."
while ! nc -z localhost 3000; do   
  sleep 1
done
echo "server ready"
cd ../FE
npm install
npm run serve
