FROM node:20

# Install build tools and Python for canvas
RUN apt-get update && apt-get install -y \
	build-essential \
	python3 \
	pkg-config \
	libcairo2-dev \
	libpango1.0-dev \
	libjpeg-dev \
	libgif-dev \
	librsvg2-dev

# Set working directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install --omit=dev

# Copy source
COPY . .

# Use PM2 to run the bot
RUN npm install -g pm2
CMD ["pm2-runtime", "index.js"]
