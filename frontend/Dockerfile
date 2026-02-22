FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# We declare the backend URL for client-side API requests so it compiles correctly or runs properly
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
