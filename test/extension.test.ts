//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert'

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
import { getPath } from '../src/extension'

// Defines a Mocha test suite to group tests of similar kind together
suite("getPath()", () => {

  const source = { hostType: 'app', key: '', path: '', part: 'foo' }

  test("Component paths", () => {
    assert.equal(getPath(source, 'component-js'),             'app/components/foo.js')
    assert.equal(getPath(source, 'component-template-hbs'),   'app/templates/components/foo.hbs')
    assert.equal(getPath(source, 'component-style-scss'),     'app/styles/components/foo.scss')
    assert.equal(getPath(source, 'component-unit-js'),        'tests/unit/components/foo-test.js')
    assert.equal(getPath(source, 'component-integration-js'), 'tests/integration/components/foo-test.js')
  })

  test("Controller paths", () => {
    assert.equal(getPath(source, 'controller-js'),             'app/controllers/foo.js')
    assert.equal(getPath(source, 'controller-template-hbs'),   'app/templates/foo.hbs')
    assert.equal(getPath(source, 'controller-unit-js'),        'tests/unit/controllers/foo-test.js')
    assert.equal(getPath(source, 'controller-integration-js'), 'tests/integration/controllers/foo-test.js')
  })

  test("Route paths", () => {
    assert.equal(getPath(source, 'route-js'),             'app/routes/foo.js')
    assert.equal(getPath(source, 'route-unit-js'),        'tests/unit/routes/foo-test.js')
    assert.equal(getPath(source, 'route-integration-js'), 'tests/integration/routes/foo-test.js')
  })
  
  test("Mixin paths", () => {
    assert.equal(getPath(source, 'mixin-js'),             'app/mixins/foo.js')
    assert.equal(getPath(source, 'mixin-unit-js'),        'tests/unit/mixins/foo-test.js')
    assert.equal(getPath(source, 'mixin-integration-js'), 'tests/integration/mixins/foo-test.js')
  })

  test("Models paths", () => {
    assert.equal(getPath(source, 'model-js'),             'app/models/foo.js')
    assert.equal(getPath(source, 'model-unit-js'),        'tests/unit/models/foo-test.js')
    assert.equal(getPath(source, 'model-integration-js'), 'tests/integration/models/foo-test.js')
  })

  test("Util paths", () => {
    assert.equal(getPath(source, 'util-js'),             'app/utils/foo.js')
    assert.equal(getPath(source, 'util-unit-js'),        'tests/unit/utils/foo-test.js')
    assert.equal(getPath(source, 'util-integration-js'), 'tests/integration/utils/foo-test.js')
  })

  test("Helper paths", () => {
    assert.equal(getPath(source, 'helper-js'),             'app/helpers/foo.js')
    assert.equal(getPath(source, 'helper-unit-js'),        'tests/unit/helpers/foo-test.js')
    assert.equal(getPath(source, 'helper-integration-js'), 'tests/integration/helpers/foo-test.js')
  })
})
