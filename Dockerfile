FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the vite app
ENV VITE_API_URL="http://localhost:4000"
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "server"]
