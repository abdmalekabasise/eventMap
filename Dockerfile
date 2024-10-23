# Use an official Node runtime as a parent image
FROM node:16.20.2

# Set the working directory in the container
WORKDIR /usr/src/app

# Install global dependencies
RUN npm install -g nodemon

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies with legacy peer dependencies
RUN npm install --production --legacy-peer-deps

# Copy the local code to the container's workspace.
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Run the app using nodemon
CMD ["nodemon", "server.js"]
