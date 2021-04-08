import * as vscode from 'vscode';

export class TypeWriter {
  static readonly _defaultPriority: number = 100;

  private _statusBarItem: vscode.StatusBarItem;
  private _dpSwitch: vscode.Disposable;

  constructor() {
    const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("typewriter");

    this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, config.get<number>("priority", TypeWriter._defaultPriority));
    this._updateWorkspace(config.get<boolean>("enabled", false), false);
    this._statusBarItem.command = "typewriter.switch";
    this._statusBarItem.show();

    this._dpSwitch = vscode.commands.registerCommand("typewriter.switch", () => {
      const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("typewriter");
      let isEnabled: boolean = !config.get<boolean>("enabled", false);

      config.update("enabled", isEnabled, vscode.ConfigurationTarget.Global);
    });

    vscode.workspace.onDidChangeConfiguration(event => {
      let affected = event.affectsConfiguration("typewriter.enabled");
      if (affected) {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("typewriter");
        this._updateWorkspace(config.get<boolean>("enabled", false), true);
      }
    });
  }

  dispose() {
    this._statusBarItem.dispose();
    this._dpSwitch.dispose();
  }

  private _updateWorkspace(isEnabled: boolean, showMessage: boolean): void {
    this._statusBarItem.text = this._getStatusBarText(isEnabled);

    if (isEnabled) {
      // TODO
    } else {
      // TODO
    }

    if (showMessage) {
      if (isEnabled) {
        vscode.window.showInformationMessage('TypeWriter mode enabled!');
      } else {
        vscode.window.showInformationMessage('TypeWriter mode disabled!');
      }
    }
  }

  private _getStatusBarText(isEnabled: boolean): string {
    if (isEnabled) {
      return "$(keyboard) Typewriter ON!!!";
    }
    return "$(keyboard) Typewriter OFF!!!";
  }
}
