/* eslint-disable */
export default {
  displayName: 'hooks',

  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/hooks',
  preset: '../../jest.preset.js',
};
