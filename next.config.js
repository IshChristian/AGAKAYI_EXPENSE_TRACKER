module.exports = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true },
  // Critical for SPAs:
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
}