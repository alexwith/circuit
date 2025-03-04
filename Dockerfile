FROM arm64v8/node:23-alpine AS build

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

FROM nginx:stable-alpine AS prod

COPY --from=build /app/nginx.conf /etc/nginx/conf.d

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
