FROM node:22-bookworm

WORKDIR /app

USER node

CMD ["yarn", "dev"]
