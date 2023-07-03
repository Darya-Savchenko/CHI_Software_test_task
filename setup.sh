#!/bin/bash

# Create file .env
echo "REACT_APP_API='https://myfakeapi.com'" > .env

# Install dependencies
npm install --legacy-peer-deps

# Run project
npm start