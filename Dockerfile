
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV VITE_API_URL=http://localhost:3001/api

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
