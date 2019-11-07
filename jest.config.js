module.exports = {
    "globals": {
        "ts-jest": {
            "tsConfig": "tsconfig.spec.json"
        }
    },
    "transform": {
        "^.+\\.(ts|tsx)?$": "ts-jest"
    },
    "testRegex": "(spec/__tests__/.*|(\\.|/)(test|spec))\\.((ts|tsx)?)$",
    "testPathIgnorePatterns": [
        "/node_modules/"
    ],
    "collectCoverage": false,
    "coverageReporters": [
        "lcov",
        "text"
    ],
    "coverageDirectory": "tests-coverage",
    "collectCoverageFrom": [
        "src/**/*component.ts",
        "src/**/*service.ts",
        "src/**/*pipe.ts",
        "src/**/form-element.base.ts"
    ],
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "setupFiles": [
        "./spec/localstorage.mock.ts"
    ],
    "modulePathIgnorePatterns": [
        "<rootDir>/projects/"
    ],
    "moduleNameMapper": {
        "^@react-state/store$": "<rootDir>/projects/react-state/release",
        "^@react-state/data-strategy$": "<rootDir>/projects/data-strategy/release",
        "^@react-state/immer-data-strategy$": "<rootDir>/projects/immer-data-strategy/release",
        "^@react-state/immutable-data-strategy$": "<rootDir>/projects/immutable-data-strategy/release",
        "^@react-state/(.*)$": "<rootDir>/projects/$1/release"
    }
}