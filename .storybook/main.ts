import path from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@/app': path.resolve(__dirname, '../src/app'),
        '@/pages': path.resolve(__dirname, '../src/pages'),
        '@/widgets': path.resolve(__dirname, '../src/widgets'),
        '@/features': path.resolve(__dirname, '../src/features'),
        '@/entities': path.resolve(__dirname, '../src/entities'),
        '@/shared': path.resolve(__dirname, '../src/shared'),
        src: path.resolve(__dirname, '../src'),
      }
    }
    return config
  },
}
export default config
