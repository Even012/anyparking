# Use a base image with Node.js
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the port your frontend will be served on
EXPOSE 3000

# Command to serve the frontend
CMD ["npm", "start"]