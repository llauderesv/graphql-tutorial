FROM node:12.18.1
ENV NODE_ENV=development

WORKDIR /var/www/app/api

COPY ./api/package*.json ./

RUN npm install

COPY ./api .

# Docker expose port 3000 to be accesible to outside
# -p tag in docker run command is used to map the port expose in docker with provided exposed
EXPOSE 4000

CMD ["npm", "run", "start"]