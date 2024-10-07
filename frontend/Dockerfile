# Use official Node.js image as base
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
