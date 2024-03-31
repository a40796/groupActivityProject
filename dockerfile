FROM node:18 as Builder

COPY BE /home/app/BE
COPY FE /home/app/FE
COPY start.sh /home/app

WORKDIR /home/app

RUN npm install -g serve
RUN chmod +x /home/app/start.sh

RUN cd /home/app/BE && npm install
RUN cd /home/app/FE && npm install && npm run build

EXPOSE 3000 8080

CMD ["/bin/bash", "/home/app/start.sh"]
