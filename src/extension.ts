// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "typewriter" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let typewriter = new TypeWriter();
  context.subscriptions.push(typewriter);
}

// this method is called when your extension is deactivated
export function deactivate() { }

class TypeWriter {
  static readonly _defaultPriority: number = 100;

  private _statusBarItem: vscode.StatusBarItem;
  private _dpSwitch: vscode.Disposable;

  constructor() {
    const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("typewriter");
    this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, config.get<number>("priority", TypeWriter._defaultPriority));
    this._statusBarItem.text = this._getStatusBarText(config.get<boolean>("enabled", false));

    this._dpSwitch = vscode.commands.registerCommand("typewriter.switch", () => {
      const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("typewriter");
      let isEnabled: boolean = !config.get<boolean>("enabled", false);

      config.update("enabled", isEnabled, vscode.ConfigurationTarget.Global);
      this._statusBarItem.text = this._getStatusBarText(isEnabled);
      if (isEnabled) {
        vscode.window.showInformationMessage('TypeWriter mode enabled!');
      } else {
        vscode.window.showInformationMessage('TypeWriter mode disabled!');
      }
    });

    this._statusBarItem.command = "typewriter.switch";
    this._statusBarItem.show();
  }

  dispose() {
    this._statusBarItem.dispose();
    this._dpSwitch.dispose();
  }

  private _getStatusBarText(isEnabled: boolean): string {
    if (isEnabled) {
      return "$(keyboard) Typewriter ON!!!";
    }
    return "$(keyboard) Typewriter OFF!!!";
  }
}
