export default {
    entry: './release/index.js',
    dest: './release/bundles/immutablejsDataStrategy.umd.js',
    format: 'umd',
    moduleName: 'reactState.immutablejsDataStrategy',
    globals: {
        'immutable': 'Immutable',
        'immutable/contrib/cursor': '_Cursor'
    }
  }