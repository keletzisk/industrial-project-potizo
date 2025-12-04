# Use an official Node.js runtime as the base image
FROM node:16.20.0

# Set the working directory in the container to /app
WORKDIR /app

# Copy the rest of the application code to the working directory
COPY . .

# Install the application dependencies
RUN npm ci

# Expose the port that the application listens on
EXPOSE 5000

# Start the application
CMD ["sh", "-c", "npm run db:migrate && npm start"]
