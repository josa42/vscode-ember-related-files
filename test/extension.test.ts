import * as assert from 'assert'
import * as vscode from 'vscode'
import { getPath, detectType, getRelatedTypeKeys } from '../src/extension'

// Defines a Mocha test suite to group tests of similar kind together
suite("Ember Related Files Extension", () => {
  suite("getPath()", () => {

    const source = { hostType: 'app', key: '', path: '', part: 'foo' }

    test("Component paths", () => {
      assert.equal(getPath(source, 'component-js'),             'app/components/foo.js')
      assert.equal(getPath(source, 'component-template-hbs'),   'app/templates/components/foo.hbs')
      assert.equal(getPath(source, 'component-style-scss'),     'app/styles/components/foo.scss')
      assert.equal(getPath(source, 'component-unit-js'),        'tests/unit/components/foo-test.js')
      assert.equal(getPath(source, 'component-integration-js'), 'tests/integration/components/foo-test.js')

      assert.equal(getPath(source, 'pod:component-js'),             'app/components/foo/component.js')
      assert.equal(getPath(source, 'pod:component-template-hbs'),   'app/components/foo/template.hbs')
      assert.equal(getPath(source, 'pod:component-unit-js'),        'tests/unit/components/foo/component-test.js')
      assert.equal(getPath(source, 'pod:component-integration-js'), 'tests/integration/components/foo/component-test.js')
    })

    test("Controller paths", () => {
      assert.equal(getPath(source, 'controller-js'),             'app/controllers/foo.js')
      assert.equal(getPath(source, 'controller-template-hbs'),   'app/templates/foo.hbs')
      assert.equal(getPath(source, 'controller-unit-js'),        'tests/unit/controllers/foo-test.js')
      assert.equal(getPath(source, 'controller-integration-js'), 'tests/integration/controllers/foo-test.js')

      assert.equal(getPath(source, 'pod:controller-js'),             'app/foo/controller.js')
      assert.equal(getPath(source, 'pod:controller-template-hbs'),   'app/foo/template.hbs')
      assert.equal(getPath(source, 'pod:controller-unit-js'),        'tests/unit/foo/controller-test.js')
      assert.equal(getPath(source, 'pod:controller-integration-js'), 'tests/integration/foo/controller-test.js')
    })

    test("Route paths", () => {
      assert.equal(getPath(source, 'route-js'),             'app/routes/foo.js')
      assert.equal(getPath(source, 'route-unit-js'),        'tests/unit/routes/foo-test.js')
      assert.equal(getPath(source, 'route-integration-js'), 'tests/integration/routes/foo-test.js')

      assert.equal(getPath(source, 'pod:route-js'),             'app/foo/route.js')
      assert.equal(getPath(source, 'pod:route-unit-js'),        'tests/unit/foo/route-test.js')
      assert.equal(getPath(source, 'pod:route-integration-js'), 'tests/integration/foo/route-test.js')
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

    test("Adapter paths", () => {
      assert.equal(getPath(source, 'adapter-js'),             'app/adapters/foo.js')
      assert.equal(getPath(source, 'adapter-unit-js'),        'tests/unit/adapters/foo-test.js')
      assert.equal(getPath(source, 'adapter-integration-js'), 'tests/integration/adapters/foo-test.js')
    })
    
    test("Serializer paths", () => {
      assert.equal(getPath(source, 'serializer-js'),             'app/serializers/foo.js')
      assert.equal(getPath(source, 'serializer-unit-js'),        'tests/unit/serializers/foo-test.js')
      assert.equal(getPath(source, 'serializer-integration-js'), 'tests/integration/serializers/foo-test.js')
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

    test("Service paths", () => {
      assert.equal(getPath(source, 'service-js'),             'app/services/foo.js')
      assert.equal(getPath(source, 'service-unit-js'),        'tests/unit/services/foo-test.js')
      assert.equal(getPath(source, 'service-integration-js'), 'tests/integration/services/foo-test.js')
    })

    test("Initializer paths", () => {
      assert.equal(getPath(source, 'initializer-js'),             'app/initializers/foo.js')
      assert.equal(getPath(source, 'initializer-unit-js'),        'tests/unit/initializers/foo-test.js')
      assert.equal(getPath(source, 'initializer-integration-js'), 'tests/integration/initializers/foo-test.js')
    })
  })

  suite("detectType()", () => {
    test("Component and related types", () => {
      assert.deepEqual(detectType('app/components/foo.js'),                     { hostType: 'app', path: 'app/components/foo.js', part: 'foo', key: 'component-js' });
      assert.deepEqual(detectType('app/templates/components/foo.hbs'),          { hostType: 'app', path: 'app/templates/components/foo.hbs', part: 'foo', key: 'component-template-hbs' });
      assert.deepEqual(detectType('app/styles/components/foo.scss'),            { hostType: 'app', path: 'app/styles/components/foo.scss', part: 'foo', key: 'component-style-scss' });
      assert.deepEqual(detectType('tests/unit/components/foo-test.js'),         { hostType: 'app', path: 'tests/unit/components/foo-test.js', part: 'foo', key: 'component-unit-js' });
      assert.deepEqual(detectType('tests/integration/components/foo-test.js'),  { hostType: 'app', path: 'tests/integration/components/foo-test.js', part: 'foo', key: 'component-integration-js' });
    });

    test("Route and related types", () => {
      assert.deepEqual(detectType('app/routes/foo.js'),                         { hostType: 'app', path: 'app/routes/foo.js', part: 'foo', key: 'route-js' });
      assert.deepEqual(detectType('tests/unit/routes/foo-test.js'),             { hostType: 'app', path: 'tests/unit/routes/foo-test.js', part: 'foo', key: 'route-unit-js' });
      assert.deepEqual(detectType('tests/integration/routes/foo-test.js'),      { hostType: 'app', path: 'tests/integration/routes/foo-test.js', part: 'foo', key: 'route-integration-js' });
    });

    test("Controller and related types", () => {
      assert.deepEqual(detectType('app/controllers/foo.js'),                    { hostType: 'app', path: 'app/controllers/foo.js', part: 'foo', key: 'controller-js' });
      assert.deepEqual(detectType('app/templates/foo.hbs'),                     { hostType: 'app', path: 'app/templates/foo.hbs', part: 'foo', key: 'controller-template-hbs' });
      assert.deepEqual(detectType('tests/unit/controllers/foo-test.js'),        { hostType: 'app', path: 'tests/unit/controllers/foo-test.js', part: 'foo', key: 'controller-unit-js' });
      assert.deepEqual(detectType('tests/integration/controllers/foo-test.js'), { hostType: 'app', path: 'tests/integration/controllers/foo-test.js', part: 'foo', key: 'controller-integration-js' });
    });

    test("Model and related types", () => {
      assert.deepEqual(detectType('app/models/foo.js'),                         { hostType: 'app', path: 'app/models/foo.js', part: 'foo', key: 'model-js' });
      assert.deepEqual(detectType('tests/unit/models/foo-test.js'),             { hostType: 'app', path: 'tests/unit/models/foo-test.js', part: 'foo', key: 'model-unit-js' });
      assert.deepEqual(detectType('tests/integration/models/foo-test.js'),      { hostType: 'app', path: 'tests/integration/models/foo-test.js', part: 'foo', key: 'model-integration-js' });
    });

    test("Adapter and related types", () => {
      assert.deepEqual(detectType('app/adapters/foo.js'),                       { hostType: 'app', path: 'app/adapters/foo.js', part: 'foo', key: 'adapter-js' });
      assert.deepEqual(detectType('tests/unit/adapters/foo-test.js'),           { hostType: 'app', path: 'tests/unit/adapters/foo-test.js', part: 'foo', key: 'adapter-unit-js' });
      assert.deepEqual(detectType('tests/integration/adapters/foo-test.js'),    { hostType: 'app', path: 'tests/integration/adapters/foo-test.js', part: 'foo', key: 'adapter-integration-js' });
    });

    test("Serializer and related types", () => {
      assert.deepEqual(detectType('app/serializers/foo.js'),                    { hostType: 'app', path: 'app/serializers/foo.js', part: 'foo', key: 'serializer-js' });
      assert.deepEqual(detectType('tests/unit/serializers/foo-test.js'),        { hostType: 'app', path: 'tests/unit/serializers/foo-test.js', part: 'foo', key: 'serializer-unit-js' });
      assert.deepEqual(detectType('tests/integration/serializers/foo-test.js'), { hostType: 'app', path: 'tests/integration/serializers/foo-test.js', part: 'foo', key: 'serializer-integration-js' });
    });

    test("Util and related types", () => {
      assert.deepEqual(detectType('app/utils/foo.js'),                          { hostType: 'app', path: 'app/utils/foo.js', part: 'foo', key: 'util-js' });
      assert.deepEqual(detectType('tests/unit/utils/foo-test.js'),              { hostType: 'app', path: 'tests/unit/utils/foo-test.js', part: 'foo', key: 'util-unit-js' });
      assert.deepEqual(detectType('tests/integration/utils/foo-test.js'),       { hostType: 'app', path: 'tests/integration/utils/foo-test.js', part: 'foo', key: 'util-integration-js' });
    });

    test("Helper and related types", () => {
      assert.deepEqual(detectType('app/helpers/foo.js'),                        { hostType: 'app', path: 'app/helpers/foo.js', part: 'foo', key: 'helper-js' });
      assert.deepEqual(detectType('tests/unit/helpers/foo-test.js'),            { hostType: 'app', path: 'tests/unit/helpers/foo-test.js', part: 'foo', key: 'helper-unit-js' });
      assert.deepEqual(detectType('tests/integration/helpers/foo-test.js'),     { hostType: 'app', path: 'tests/integration/helpers/foo-test.js', part: 'foo', key: 'helper-integration-js' });
    });

    test("Mixin and related types", () => {
      assert.deepEqual(detectType('app/mixins/foo.js'),                         { hostType: 'app', path: 'app/mixins/foo.js', part: 'foo', key: 'mixin-js' });
      assert.deepEqual(detectType('tests/unit/mixins/foo-test.js'),             { hostType: 'app', path: 'tests/unit/mixins/foo-test.js', part: 'foo', key: 'mixin-unit-js' });
      assert.deepEqual(detectType('tests/integration/mixins/foo-test.js'),      { hostType: 'app', path: 'tests/integration/mixins/foo-test.js', part: 'foo', key: 'mixin-integration-js' });
    })

    test("Service and related types", () => {
      assert.deepEqual(detectType('app/services/foo.js'),                       { hostType: 'app', path: 'app/services/foo.js', part: 'foo', key: 'service-js' });
      assert.deepEqual(detectType('tests/unit/services/foo-test.js'),           { hostType: 'app', path: 'tests/unit/services/foo-test.js', part: 'foo', key: 'service-unit-js' });
      assert.deepEqual(detectType('tests/integration/services/foo-test.js'),    { hostType: 'app', path: 'tests/integration/services/foo-test.js', part: 'foo', key: 'service-integration-js' });
    })
    
    test("Initializer and related types", () => {
      assert.deepEqual(detectType('app/initializers/foo.js'),                       { hostType: 'app', path: 'app/initializers/foo.js', part: 'foo', key: 'initializer-js' });
      assert.deepEqual(detectType('tests/unit/initializers/foo-test.js'),           { hostType: 'app', path: 'tests/unit/initializers/foo-test.js', part: 'foo', key: 'initializer-unit-js' });
      assert.deepEqual(detectType('tests/integration/initializers/foo-test.js'),    { hostType: 'app', path: 'tests/integration/initializers/foo-test.js', part: 'foo', key: 'initializer-integration-js' });
    })
  })

  suite('getRelatedTypeKeys()', () => {
    test("Component and related types", () => {
      const types = ['pod:component-js', 'pod:component-template-hbs', 'pod:component-integration-js', 'pod:component-unit-js', 'component-js', 'component-template-hbs', 'component-style-scss', 'component-unit-js', 'component-integration-js']
      types.forEach((type) => {
        assert.deepEqual(getRelatedTypeKeys(type), types.filter((iType) => iType !== type));
      })
    })
    
    test("Controller and related types", () => {
      const types = ['pod:route-js', 'pod:route-unit-js', 'pod:route-integration-js', 'pod:controller-js','pod:controller-template-hbs', 'pod:controller-unit-js', 'pod:controller-integration-js', 'controller-js', 'controller-template-hbs', 'route-js', 'controller-unit-js', 'controller-integration-js', 'route-unit-js', 'route-integration-js']
      types.forEach((type) => {
        assert.deepEqual(getRelatedTypeKeys(type), types.filter((iType) => iType !== type));
      })
    })
    
    test("Mixin and related types", () => {
      const types = ['mixin-js', 'mixin-unit-js', 'mixin-integration-js']
      types.forEach((type) => {
        assert.deepEqual(getRelatedTypeKeys(type), types.filter((iType) => iType !== type));
      })
    })
    
    test("Model and related types", () => {
      const types = ['model-js', 'model-unit-js', 'model-integration-js', 'adapter-js', 'adapter-unit-js', 'adapter-integration-js', 'serializer-js', 'serializer-unit-js', 'serializer-integration-js']
      types.forEach((type) => {
        assert.deepEqual(getRelatedTypeKeys(type), types.filter((iType) => iType !== type));
      })
    })
    
    test("Util and related types", () => {
      const types = ['util-js', 'util-unit-js', 'util-integration-js']
      types.forEach((type) => {
        assert.deepEqual(getRelatedTypeKeys(type), types.filter((iType) => iType !== type));
      })
    })
    
    test("Helper and related types", () => {
      const types = ['helper-js', 'helper-unit-js', 'helper-integration-js']
      types.forEach((type) => {
        assert.deepEqual(getRelatedTypeKeys(type), types.filter((iType) => iType !== type));
      })
    })
   
    test("Service and related types", () => {
      const types = ['service-js', 'service-unit-js', 'service-integration-js']
      types.forEach((type) => {
        assert.deepEqual(getRelatedTypeKeys(type), types.filter((iType) => iType !== type));
      })
    })

    test("Initializer and related types", () => {
      const types = ['initializer-js', 'initializer-unit-js', 'initializer-integration-js']
      types.forEach((type) => {
        assert.deepEqual(getRelatedTypeKeys(type), types.filter((iType) => iType !== type));
      })
    })
  })
})
