/** @type {import('next').NextConfig} */
const path = require('path');
const withImages = require('next-images');

module.exports = withImages({
  esModule: true,
  inlineImageLimit: false,
  images: {
    domains: ['avatars.githubusercontent.com', 'storage.googleapis.com']
  },
  sassOptions: [
    path.join(__dirname, 'styles')
  ],
  reactStrictMode: true,
});
