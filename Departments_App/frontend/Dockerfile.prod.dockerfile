# Build
FROM node:19 as build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Run nginx server
FROM nginx:1.23.2

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]



