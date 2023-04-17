FROM node:18-alpine AS deploy-node

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]