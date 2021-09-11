FROM node:12.18.1
ENV NODE_ENV=development

# Set a default working directory
WORKDIR /var/www/app/graphql_client

# copy package.json and package-lock so that we can install node_modules
COPY package*.json ./

# Install required dependencies
RUN npm install

# Add files to working dir
COPY . .

# Docker expose port 3000 to be accesible to outside
# -p tag in docker run command is used to map the port expose in docker with provided exposed
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]