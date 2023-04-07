#!/bin/bash
cd ./backend && npm run dev &
cd ./frontend && npm run dev &
wait
