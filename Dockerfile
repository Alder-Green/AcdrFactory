FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN echo "NEXT_PUBLIC_DISABLE_SSR=true" > .env
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
