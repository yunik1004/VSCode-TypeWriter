import * as vscode from 'vscode';

export class TypeWriter {
  static readonly _defaultPriority: number = 100;
  static readonly _configTarget: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global;

  private _statusBarItem: vscode.StatusBarItem;
  private _dpSwitch: vscode.Disposable;
  private _isEnabled: boolean;

  constructor() {
    const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("typewriter");

    this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, config.get<number>("priority", TypeWriter._defaultPriority));
    this._isEnabled = config.get<boolean>("enabled", false);
    this._updateWorkspace(false);
    this._statusBarItem.command = "typewriter.switch";
    this._statusBarItem.show();

    this._dpSwitch = vscode.commands.registerCommand("typewriter.switch", () => {
      const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("typewriter");
      this._isEnabled = !this._isEnabled;
      config.update("enabled", this._isEnabled, TypeWriter._configTarget);
    });

    vscode.workspace.onDidChangeConfiguration(event => {
      let affected = event.affectsConfiguration("typewriter.enabled");
      if (affected) {
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("typewriter");
        this._isEnabled = config.get<boolean>("enabled", false);
        this._updateWorkspace(true);
      }
    });
  }

  dispose() {
    this._statusBarItem.dispose();
    this._dpSwitch.dispose();
  }

  private _updateWorkspace(isChanged: boolean): void {
    this._statusBarItem.text = this._getStatusBarText();

    if (isChanged) {
      const config_editor: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("editor");
      const config_typewriter: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("typewriter");

      const editor_cs: number = config_editor.get<number>("cursorSurroundingLines", 0);
      const storage_cs: number = config_typewriter.get<number>("storage.cursorSurroundingLines", 0);

      config_editor.update("cursorSurroundingLines", storage_cs, TypeWriter._configTarget);
      config_typewriter.update("storage.cursorSurroundingLines", editor_cs, TypeWriter._configTarget);

      if (this._isEnabled) {
        vscode.window.showInformationMessage('TypeWriter mode enabled!');
      } else {
        vscode.window.showInformationMessage('TypeWriter mode disabled!');
      }
    }
  }

  private _getStatusBarText(): string {
    if (this._isEnabled) {
      return "$(keyboard) Typewriter ON!!!";
    }
    return "$(keyboard) Typewriter OFF!!!";
  }
}
