import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { sendOpenRouterRequest } from "../../openrouter";
import {
  GENERATE_TEST_FOR_ENTIRE_FILE,
  GENERATE_TEST_FOR_SELECTION,
  OUTPUT_TEST_IN_TYPESCRIPT,
} from "./generate-tests-prompts";

export const generateTests = async (): Promise<void> => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

  const selection = editor.selection;
  let code: string;
  let prompt: string;

  if (!selection.isEmpty) {
    // Generate tests for the selected code
    code = editor.document.getText(selection);
    prompt = `${GENERATE_TEST_FOR_SELECTION}${code}${OUTPUT_TEST_IN_TYPESCRIPT}`;
  } else {
    // Generate tests for the entire file
    code = editor.document.getText();
    prompt = `${GENERATE_TEST_FOR_ENTIRE_FILE}${code}${OUTPUT_TEST_IN_TYPESCRIPT}`;
  }

  const result = await sendOpenRouterRequest(prompt);
  if (result) {
    // Determine the spec file path (e.g., myFile.spec.ts)
    const currentFile = editor.document.uri.fsPath;
    const ext = path.extname(currentFile);
    const baseName = path.basename(currentFile, ext);
    const dir = path.dirname(currentFile);
    const specFilePath = path.join(dir, `${baseName}.spec.ts`);

    // Check if the spec file exists; if not, create it.
    let specUri = vscode.Uri.file(specFilePath);
    try {
      await vscode.workspace.fs.stat(specUri);
    } catch (error) {
      // File does not exist; create it synchronously (for simplicity)
      fs.writeFileSync(specFilePath, "");
    }

    // Open the spec file and insert the generated tests at the top.
    const document = await vscode.workspace.openTextDocument(specUri);
    const specEditor = await vscode.window.showTextDocument(document, {
      preview: false,
    });
    specEditor.edit((editBuilder) => {
      editBuilder.insert(new vscode.Position(0, 0), result + "\n\n");
    });
    vscode.window.showInformationMessage(
      `Test cases generated and inserted into ${baseName}.spec.ts`
    );
  } else {
    vscode.window.showErrorMessage("Failed to generate test cases.");
  }
};
