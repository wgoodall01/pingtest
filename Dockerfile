FROM node:9-alpine
WORKDIR /srv

# Copy and install deps
COPY package.json yarn.lock ./
RUN yarn install --production

# Run the server
COPY . .
EXPOSE 80
ENV NODE_ENV=production
CMD node /srv/server.js

