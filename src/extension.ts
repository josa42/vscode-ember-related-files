'use strict'

import * as vscode from 'vscode'
import * as fs from 'fs'
import { dirname, join, basename, sep as fileSeperator } from 'path'

const findRelatedFiles = require('ember-find-related-files').findRelatedFiles

interface IRelatedFile {
  label: string,
  path: string
}

class TypeItem implements vscode.QuickPickItem {

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

  public uri() : vscode.Uri {
    return vscode.Uri.file(this.path())
  }
}

function open(item: TypeItem) {
  vscode.workspace.openTextDocument(item.uri()).then((doc) =>
    vscode.window.showTextDocument(doc)
  )
}

function config<T>(key: string) : T {
  return vscode.workspace.getConfiguration('emberRelatedFiles').get<T>(key);
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.relatedFiles', () => {
    if (!vscode.window.activeTextEditor) {
      return
    }

    let relativeFileName = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName, false);
    let { uri: { path: rootPath } } = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri)
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

    vscode.window.showQuickPick(items as TypeItem[], { placeHolder: 'Select File', matchOnDescription: true }).then((item) => {
      if (item) {
        open(item)
      }
    })
  })

  context.subscriptions.push(disposable)
}

export function deactivate() { }
