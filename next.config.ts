import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  rewrites(){
    return[
      {
        source:"/api/:path*",
        destination:"http://localhost:5000/api/:path*"
      },
      {
        source:"/socket.io/:path*",
        destination:"http://localhost:5000/socket.io/:path*"
      },
    ]
  },
};

export default nextConfig;
