# Use the official Node.js image as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the application port (default port for the app)
EXPOSE 3030

# Start the application
CMD ["npm", "start"]