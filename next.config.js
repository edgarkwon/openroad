/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd', '@ant-design', 'rc-util', 'rc-pagination', 'rc-picker', '@ant-design/icons', 'rc-notification', 'rc-tooltip']
};

export default nextConfig;