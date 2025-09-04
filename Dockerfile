FROM hub.indraproject.ir/hubproxy/cypress/included
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENTRYPOINT []
CMD []
