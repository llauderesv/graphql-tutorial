FROM node:12.18.1
ENV NODE_ENV=development

WORKDIR /var/www/app/graphql_client

COPY ./graphql-client/package*.json ./

RUN npm install

COPY ./graphql-client .

# Docker expose port 3000 to be accesible to outside
# -p tag in docker run command is used to map the port expose in docker with provided exposed
EXPOSE 3000

CMD ["npm", "run", "start"]