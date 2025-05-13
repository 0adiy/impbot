FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app files
COPY . .

# Run the app
CMD ["node", "index.js"]
