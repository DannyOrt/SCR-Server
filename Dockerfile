# Dokerizar la aplicación Node.js

FROM node:18.17.0-alpine

RUN apk --no-cache add \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

WORKDIR /app

COPY package.json /

RUN npm install

COPY . /

EXPOSE 8080

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROME_BIN /usr/bin/chromium-browser

CMD ["npm", "start"]
