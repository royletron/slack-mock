const request = require('request');
const crypto = require('crypto');
const querystring = require('querystring');

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || '';

module.exports = (req) => {
  const hmac = crypto.createHmac('sha256', SLACK_SIGNING_SECRET);
  const ts = Date.now();
  const body = querystring.stringify(req.body || req.form);
  hmac.update(`v0:${ts}:${body}`);
  return request.defaults({headers: {
    'x-slack-signature': `v0=${hmac.digest('hex')}`,
    'x-slack-request-timestamp': ts
  }})(req);
}