FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --force

COPY . .

# BCRYPT im Container neu installieren
# RUN npm rebuild bcrypt --build-from-source
RUN rm -rf node_modules package-lock.json && npm cache clean --force
RUN npm install bcrypt --build-from-source


EXPOSE 8753

CMD ["npm", "run", "dev"]