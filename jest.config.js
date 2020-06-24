module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: ["**/__tests__/**/*.[tj]s?(x)", "**/?(*.)(spec|test).[tj]s?(x)"],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  "reporters": [
    "default",
    [
      "jest-junit",
      {
        "suiteName": "npm test",
        "outputDirectory": "./reports/",
      }
    ]
  ]
}
