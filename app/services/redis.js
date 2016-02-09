var redis = require('redis')

exports.client = redis.createClient('redis://redis:6379')
