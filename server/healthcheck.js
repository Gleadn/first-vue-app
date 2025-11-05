#!/usr/bin/env node

/**
 * Script de healthcheck pour Docker
 * Vérifie que l'application répond correctement
 */

import http from 'http';

const options = {
  host: 'localhost',
  port: process.env.PORT || 3001,
  path: '/api/health',
  timeout: 2000,
};

const request = http.request(options, (res) => {
  console.log(`Healthcheck: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log('Healthcheck failed:', err.message);
  process.exit(1);
});

request.end();