FROM node:11

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /app

COPY . .

# Build for production.
RUN yarn install
RUN yarn build

RUN \
  VERSION=$(git describe --tags --always --dirty=+) && \
  DATE=$(date +%Y-%m-%dT%H:%M:%S) && \
  sed -i "s/@@__VERSION__@@/${VERSION}/g;s/@@__BUILT__@@/${DATE}/g" ./dist/index.html


# Install `serve` to run the application.
RUN npm install -g serve@6.5.8

# Set the command to start the node server.
CMD serve -s dist

# Tell Docker about the port we'll run on.
EXPOSE 5000
