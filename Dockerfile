# Dockerfile

## Stage 1 (production base)
# This gets our prod dependencies installed and out of the way
FROM node:20-alpine3.16 as base
EXPOSE 8080
ARG NPM_TOKEN
ENV NODE_ENV=production \
    NPM_TOKEN="${NPM_TOKEN}"
WORKDIR /home/node/app
RUN chown -R node:node /home/node/app
RUN apk update \
 && apk add jq \
 && rm -rf /var/cache/apk/*
COPY --chown=node:node package.json package-lock*.json .npmrc ./
USER node
RUN npm config list \
    && npm ci --only=production --arch=x64 --platform=linux \
    && npm cache clean --force


## Stage 2 (copy in source)
# This gets our source code into builder for use in next two stages
# It gets its own stage so we don't have to copy twice
# this stage starts from the first one and skips the last two
FROM base as source
WORKDIR /home/node/app
COPY --chown=node:node . .




## Stage 3 (security scanning and audit)
# docker build --target=audit --build-arg MICROSCANNER_TOKEN=NmMzYTFhM2VmOTIy .
# FROM source as audit
# RUN npm audit
# aqua microscanner, which needs a token for API access
# note this isn't super secret, so we'll use an ARG here
# https://github.com/aquasecurity/microscanner
# ARG MICROSCANNER_TOKEN=NmMzYTFhM2VmOTIy
# ADD https://get.aquasec.com/microscanner /
# RUN chmod +x /microscanner
# RUN apk add --no-cache ca-certificates && update-ca-certificates
# RUN /microscanner $MICROSCANNER_TOKEN --continue-on-failure




## Stage 4 (development)
# we don't COPY in this stage because for dev you'll bind-mount anyway
# this saves time when building locally for dev via docker-compose
FROM source as dev
ENV NODE_ENV=development
RUN npm install --only=development --silent
USER node
CMD ["node", "./src/app.js"]





## Stage 5 (testing)
# use this in automated CI
# it has prod and dev npm dependencies
# In 18.09 or older builder, this will always run
# In BuildKit, this will be skipped by default 
FROM source as test
ENV NODE_ENV=development
COPY --from=dev /home/node/app/node_modules /home/node/app/node_modules
CMD ["npm", "run", "test"]





## Stage 6 (default, production)
# this will run by default if you don't include a target
# it has prod-only dependencies
# In BuildKit, this is skipped for dev and test stages
FROM source as prod
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=5 CMD wget -q -t 1 --spider http://0.0.0.0:8152/ || exit 1
CMD ["node", "./src/app.js"]
