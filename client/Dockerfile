FROM node:23.8.0

WORKDIR /app

# Kopiere nur package.json und package-lock.json
COPY package.json package-lock.json* ./

# Entferne node_modules und package-lock.json vor der Installation
RUN rm -rf node_modules package-lock.json && \
    npm install --force

# Kopiere den restlichen Code ins Image
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]