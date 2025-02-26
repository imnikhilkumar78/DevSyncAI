import * as vscode from 'vscode';
import { sendOpenRouterRequest } from './openrouter';

export function activate(context: vscode.ExtensionContext) {
  console.log('Smart Code Buddy extension is now active!');

  // Command: Code Suggestions
  let codeSuggestions = vscode.commands.registerCommand('smartCodeBuddy.codeSuggestions', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }
    const code = editor.document.getText(editor.selection) || editor.document.getText();
    const prompt = `Provide code suggestions for the following JavaScript/TypeScript code:\n\n${code}`;
    
    const result = await sendOpenRouterRequest(prompt);
    if (result) {
      vscode.window.showInformationMessage('Code Suggestions:\n' + result);
    } else {
      vscode.window.showErrorMessage('Failed to get code suggestions.');
    }
  });

  // Command: Find Errors and Suggest Fixes
  let findErrors = vscode.commands.registerCommand('smartCodeBuddy.findErrors', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }
    const code = editor.document.getText(editor.selection) || editor.document.getText();
    const prompt = `Find errors and suggest potential fixes for the following JavaScript/TypeScript code:\n\n${code}`;

    const result = await sendOpenRouterRequest(prompt);
    if (result) {
      vscode.window.showInformationMessage('Error Analysis & Fixes:\n' + result);
    } else {
      vscode.window.showErrorMessage('Failed to analyze code.');
    }
  });

  // Command: Generate Test Cases
  let generateTests = vscode.commands.registerCommand('smartCodeBuddy.generateTests', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }
    const code = editor.document.getText(editor.selection) || editor.document.getText();
    const prompt = `Generate test cases for the following JavaScript/TypeScript code:\n\n${code}`;

    const result = await sendOpenRouterRequest(prompt);
    if (result) {
      vscode.window.showInformationMessage('Generated Test Cases:\n' + result);
    } else {
      vscode.window.showErrorMessage('Failed to generate test cases.');
    }
  });

  // Command: Generate Documentation
  let generateDocs = vscode.commands.registerCommand('smartCodeBuddy.generateDocumentation', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }
    const code = editor.document.getText(editor.selection) || editor.document.getText();
    const prompt = `Generate inline documentation (comments, API docs) for the following JavaScript/TypeScript code:\n\n${code}`;

    const result = await sendOpenRouterRequest(prompt);
    if (result) {
      // Insert generated documentation at the top of the document
      editor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(0, 0), result + '\n\n');
      });
      vscode.window.showInformationMessage('Documentation generated and inserted.');
    } else {
      vscode.window.showErrorMessage('Failed to generate documentation.');
    }
  });

  context.subscriptions.push(codeSuggestions, findErrors, generateTests, generateDocs);
}

export function deactivate() {
  console.log('Smart Code Buddy extension has been deactivated.');
}
