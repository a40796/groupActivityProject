FROM node:18

COPY BE /home/app/BE
COPY FE /home/app/FE
COPY start.sh /home/app
COPY package.json /home/app

WORKDIR /home/app

EXPOSE 8081

RUN chmod +x /home/app/start.sh

CMD /home/app/start.sh && tail -f /dev/null
