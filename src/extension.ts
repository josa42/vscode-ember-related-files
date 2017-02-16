'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as fs from 'fs'
import { dirname, join, basename } from 'path'

const groups = [
  ['component-js', 'component-hbs', 'component-scss'],
  ['controller-js', 'controller-hbs', 'route-js']
]

const types = [
  { key: 'component-js', ext: 'js', exp: /^app\/components\/(.+)\.js$/ },
  { key: 'component-hbs', ext: 'hbs', exp: /^app\/templates\/components\/(.+)\.hbs$/ },
  { key: 'route-js', ext: 'js', exp: /^app\/routes\/(.+)\.js$/ },
  { key: 'controller-js', ext: 'js', exp: /^app\/controllers\/(.+)\.js$/ },
  { key: 'controller-hbs', ext: 'hbs', exp: /^app\/templates\/(.+)\.hbs$/ },
]

function detectType(path): IType {

  return types
    .map((type) => {
      const { key, ext, exp} = type
      const m = path.match(exp)
      if (m) {
        return { key, path, name: `${m[1]} ${ext.toUpperCase()}`, part: m[1]}
      }
    })
    .find((type) => Boolean(type))
}

function getRelatedTypeKeys(type): string[] {
  return groups
    .find((group) => group.indexOf(type.key) !== -1)
    .filter((key) => key !== type.key);
}

function getPath(sourceType, typeKey): string {

  let basePath
  let ext

  switch (typeKey) {
    case 'component-js':
      return `app/components/${sourceType.part}.js`

    case 'component-hbs':
      return `app/templates/components/${sourceType.part}.hbs`

    case 'component-scss':
      return `app/styles/components/${sourceType.part}.scss`

    case 'route-js':
      return `app/routes/${sourceType.part}.js`

    case 'controller-js':
      return `app/controllers/${sourceType.part}.js`

    case 'controller-hbs':
      return `app/templates/${sourceType.part}.hbs`
  }
}

function typeKeyToLabel(typeKey: string) : string {
  switch (typeKey) {
    case 'component-js':
      return 'Component'

    case 'component-scss':
      return 'Stylesheet'

    case 'route-js':
      return 'Route'

    case 'controller-js':
      return 'Controller'

    case 'component-hbs':
    case 'controller-hbs':
      return 'Template'
  }
}

interface IType {
  key: string,
  path: string,
  name: string,
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

    let relativeFileName = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName)

    const type = detectType(relativeFileName)
    const items = getRelatedTypeKeys(type)
      .map((typeKey) => new TypeItem(type, typeKey))
      .filter((type) => type.exists())

    vscode.window.showQuickPick(items, { placeHolder: "Select File", matchOnDetail: true }).then((item) => {
      if (!item) return

      const fn = vscode.Uri.parse('file://' + join(vscode.workspace.rootPath, item.description))
      vscode.workspace.openTextDocument(fn).then(doc => {
        return vscode.window.showTextDocument(doc)
      })
    })
  })

  context.subscriptions.push(disposable)
}

export function deactivate() { }
