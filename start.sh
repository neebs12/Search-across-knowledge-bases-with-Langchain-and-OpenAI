#!/bin/bash
cp knowledgebase-constants.json ./backend/knowledgebase-constants.json && cp knowledgebase-constants.json ./frontend/knowledgebase-constants.json

echo '{}' > ./backend/context-cache.json

cd ./backend && npm run start
