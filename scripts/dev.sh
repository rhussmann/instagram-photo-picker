#!/usr/bin/env bash
docker-compose -f docker-compose-dev.yml up -d --force-recreate
cd src
npm i
npm start
