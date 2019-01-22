FROM node:11

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

ARG REACT_APP_API_URL
ARG REACT_APP_BASE_URL
ARG NODE_PATH

WORKDIR /app

COPY . .

# Build for production.
RUN yarn install
RUN \
  REACT_APP_API_URL=${REACT_APP_API_URL} \
  REACT_APP_BASE_URL=${REACT_APP_BASE_URL} \
  NODE_PATH=${NODE_PATH} \
  yarn build

RUN \
  VERSION=$(git describe --tags --always --dirty=+) && \
  DATE=$(date +%Y-%m-%dT%H:%M:%S) && \
  sed -i "s/@@__VERSION__@@/${VERSION}/g;s/@@__BUILT__@@/${DATE}/g" ./build/index.html

# Install `serve` to run the application.
RUN npm install -g serve@6.5.8

# Set the command to start the node server.
CMD serve -s build

# Tell Docker about the port we'll run on.
EXPOSE 5000
