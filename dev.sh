#!/bin/bash
cp knowledgebase-constants.json ./backend/knowledgebase-constants.json && cp knowledgebase-constants.json ./frontend/knowledgebase-constants.json

cd ./backend && npm run dev &
cd ./frontend && npm run dev &
wait
