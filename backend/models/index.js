/**
 * Models Index - Central export point for all database models
 * Provides easy access to all schemas for the AI Tutor platform
 */

const Problem = require('./Problem');
const User = require('./User');

module.exports = {
  Problem,
  User
};
