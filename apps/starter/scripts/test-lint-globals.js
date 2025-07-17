#!/usr/bin/env node
import console from 'console';
import process from 'process';

console.log('Test process.env:', process.env.NODE_ENV);
if (!process.env.TEST_VAR) {
  console.warn('TEST_VAR is not set!');
}
process.exit(0);
