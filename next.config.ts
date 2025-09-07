
type CustomNextConfig = {
    output?: 'standalone' | 'static' | 'export';
    // Include other Next.js config properties as needed
    reactStrictMode?: boolean;
    // ... other properties
};


const nextConfig: CustomNextConfig = {
    output: "static",
};

export default nextConfig;
