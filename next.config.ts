import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api', 'import'],
  },
};

export default withPayload(nextConfig);
