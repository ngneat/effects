module.exports = {
  displayName: 'hooks',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/hooks',
  preset: '../../jest.preset.ts',
};
