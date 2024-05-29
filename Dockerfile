# using specific version for compatibility 
# using alpine to reduce the size
from node:22-alpine
# change working directory
WORKDIR /luxcars
# copy cwd on host to the dir inside the container
COPY . /luxcars
# expose port externally
EXPOSE 3000
# install dependencies
RUN npm install
# start the server
CMD ["node", "server.js"]
