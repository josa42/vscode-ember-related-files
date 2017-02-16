'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as fs from 'fs'
import { dirname, join, basename } from 'path'

const groups = [
  ['component-js', 'component-template-hbs', 'component-style-scss', 'component-unit-js', 'component-integration-js'],
  ['controller-js', 'controller-template-hbs', 'route-js', 'controller-unit-js', 'controller-integration-js', 'route-unitjs', 'route-integration-js']
]

const types = [
  { module: 'component',              exp: /^(app|addon)\/components\/(.+)\.(js)$/ },
  { module: 'component-template',     exp: /^(app|addon)\/templates\/components\/(.+)\.(hbs)$/ },
  { module: 'component-style',        exp: /^(app|addon)\/styles\/components\/(.+)\.(scss)$/ },
  { module: 'component-unit',         exp: /^()tests\/unit\/components\/(.+)-test\.(js)$/ },
  { module: 'component-integration',  exp: /^()tests\/integration\/components\/(.+)-test\.(js)$/ },
  { module: 'route',                  exp: /^(app|addon)\/routes\/(.+)\.(js)$/ },
  { module: 'route-unit',             exp: /^()tests\/unit\/routes\/(.+)-test\.(js)$/ },
  { module: 'route-integration',      exp: /^()tests\/integration\/routes-test\/(.+)\.(js)$/ },
  { module: 'controller',             exp: /^(app|addon)\/controllers\/(.+)\.(js)$/ },
  { module: 'controller-unit',        exp: /^()tests\/unit\/controllers\/(.+)-test\.(js)$/ },
  { module: 'controller-integration', exp: /^()tests\/integration\/controllers\/(.+)-test\.(js)$/ },
  { module: 'controller-template',    exp: /^(app|addon)\/templates\/(.+)\.(hbs)$/ },
]

const HOST_TYPE_CACHE = {};

function detectHostType() {

  const hostPath = vscode.workspace.rootPath
  if (!HOST_TYPE_CACHE[hostPath]) {
    HOST_TYPE_CACHE[hostPath] = fs.existsSync(join(vscode.workspace.rootPath, 'addon')) ? 'addon' : 'app'
  }

  return HOST_TYPE_CACHE[hostPath];
}

function detectType(path): IType {

  return types
    .map((type) => {
      const { module, exp} = type
      const m = path.match(exp)
      
      if (m) {
        const hostType = m[1] || detectHostType()
        const part = m[2]
        const ext = m[3]
        
        return { hostType, path, part, key: `${module}-${ext}` }
      }
    })
    .find((type) => Boolean(type))
}

function getRelatedTypeKeys(type: IType): string[] {
    return groups
      .find((group) => group.indexOf(type.key) !== -1)
      .filter((key) => key !== type.key);
}

function getPath(sourceType: IType, typeKey: string): string {

  const { hostType, part } = sourceType
  const [ , type, , subtype, ext ] = typeKey.match(/^([a-z]+)(-([a-z]+))?-([a-z]+)$/)

  let filePath, basePath;

  switch (subtype) {
    case 'integration':
    case 'unit':
      basePath = `tests/${subtype}`
      filePath = `${part}-test.${ext}`
      break;
    
    case 'style':
      basePath = `${hostType}/styles`
      filePath = `${part}.${ext}`
      break;
    
    case 'template':
      basePath = `${hostType}/templates`
      filePath = `${part}.${ext}`
      break;
  
    default:
      basePath = hostType
      filePath = `${part}.${ext}`
      break;
  }

  return `${basePath}/${type}s/${filePath}`
}

function typeKeyToLabel(typeKey: string) : string {
  switch (typeKey) {
    case 'component-js':
      return 'Component'

    case 'component-style-scss':
      return 'Stylesheet'

    case 'route-js':
      return 'Route'

    case 'controller-js':
      return 'Controller'

    case 'component-template-hbs':
    case 'controller-template-hbs':
      return 'Template'
    
    case 'component-unit-js':
    case 'route-unit-js':
    case 'controller-unit-js':
      return 'Unit Test'
    
    case 'component-integration-js':
    case 'route-integration-js':
    case 'controller-integration-js':
      return 'Integration Test'
  }
}

interface IType {
  hostType: string,
  key: string,
  path: string,
  part: string
}

class TypeItem implements vscode.QuickPickItem {

  /**
   * A human readable string which is rendered prominent.
   */
  label: string

  /**
   * A human readable string which is rendered less prominent.
   */
  description: string

  /**
   * A human readable string which is rendered less prominent.
   */
  detail?: string

  constructor(sourceType: IType, typeKey: string) {
    this.label = typeKeyToLabel(typeKey)
    this.description = getPath(sourceType, typeKey)
  }

  public path() : string {
    return join(vscode.workspace.rootPath, this.description)
  }

  public uri() : vscode.Uri {
    return vscode.Uri.parse(`file://${this.path()}`)
  }

  public exists() : boolean {
    return fs.existsSync(this.path())
  }
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('extension.relatedFiles', () => {

    if (!vscode.window.activeTextEditor) {
      return
    }

    try {
      const relativeFileName = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName)
      const type = detectType(relativeFileName)
      const items = getRelatedTypeKeys(type)
        .map((typeKey) => new TypeItem(type, typeKey))
        .filter((type) => type.exists())
      
      vscode.window.showQuickPick(items, { placeHolder: "Select File", matchOnDetail: true }).then((item) => {
        if (!item) return

        vscode.workspace.openTextDocument(item.uri()).then((doc) =>
          vscode.window.showTextDocument(doc)
        )
      })
    } catch(err) {
      console.error(err.stack);
    }
  })

  context.subscriptions.push(disposable)
}

export function deactivate() { }
