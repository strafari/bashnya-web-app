module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/login',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/login`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};
