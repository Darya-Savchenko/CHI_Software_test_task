#!/bin/bash

# Create file .env
echo "REACT_APP_API='https://myfakeapi.com'" > .env

# Install dependencies
npm install

# Run project
npm start