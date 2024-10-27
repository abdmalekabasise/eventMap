# Use an official Node.js runtime as a parent image
FROM node:18.20.2

# Set the working directory
WORKDIR /

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --force

# Copy the rest of your application
COPY . .

# Expose the port
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]  # Replace app.js with your entry file if different
