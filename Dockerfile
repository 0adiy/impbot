FROM node:22

WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install --omit=dev

# Copy source
COPY . .

# Use PM2 to run the bot
RUN npm install -g pm2
CMD ["pm2-runtime", "index.js"]
