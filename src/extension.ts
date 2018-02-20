'use strict'

import { window, workspace, commands, Uri, ExtensionContext, QuickPickItem } from 'vscode'
import * as fs from 'fs'
import { dirname, join, basename, sep as fileSeperator } from 'path'

const findRelatedFiles = require('ember-find-related-files').findRelatedFiles

interface IRelatedFile {
  label: string,
  path: string
}

class TypeItem implements QuickPickItem {

  rootPath: string

  label: string

  description: string

  detail?: string

  constructor(item: IRelatedFile, rootPath: string) {
    this.label = item.label
    this.description = item.path
    this.rootPath = rootPath
  }

  public path() : string {
    return join(this.rootPath, this.description)
  }

  public uri() : Uri {
    return Uri.file(this.path())
  }
}

function open(item: TypeItem) {
  workspace.openTextDocument(item.uri()).then((doc) =>
    window.showTextDocument(doc.uri, { preview: config<boolean>('enablePreview') })
  )
}

function config<T>(key: string) : T {
  return workspace.getConfiguration('emberRelatedFiles').get<T>(key);
}

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand('extension.relatedFiles', () => {
    if (!window.activeTextEditor) {
      return
    }

    let relativeFileName = workspace.asRelativePath(window.activeTextEditor.document.fileName, false);
    let { uri: { path: rootPath } } = workspace.getWorkspaceFolder(window.activeTextEditor.document.uri)
    if (fileSeperator === '\\') {
      relativeFileName = relativeFileName.replace(/\\/g, "\/");
      rootPath = rootPath.replace(/\\/g, "\/");
    }

    const items = findRelatedFiles(rootPath, relativeFileName)
      .map((item) => new TypeItem(item, rootPath));

    if (items.length === 0) { return; }

    if (items.length === 1 && !config('showQuickPickForSingleOption')) {
      return open(items.pop())
    }

    window.showQuickPick(items as TypeItem[], { placeHolder: 'Select File', matchOnDescription: true }).then((item) => {
      if (item) {
        open(item)
      }
    })
  })

  context.subscriptions.push(disposable)
}

export function deactivate() { }
