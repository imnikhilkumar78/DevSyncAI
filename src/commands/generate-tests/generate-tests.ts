import * as vscode from "vscode";
import { LlmApiService } from "../../service/llm-api-service";
import * as path from "path";
import {
  GENERATE_TEST_FOR_SELECTION,
  OUTPUT_TEST_IN_TYPESCRIPT,
  GENERATE_TEST_FOR_ENTIRE_FILE,
} from "./generate-tests-prompts";

const TEST_FILE_SUFFIX = ".spec.ts";

export const generateTests = async (
  llmService: LlmApiService
): Promise<void> => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

  const selection = editor.selection;
  let code: string;
  let prompt: string;

  if (!selection.isEmpty) {
    code = editor.document.getText(selection);
    prompt = `${GENERATE_TEST_FOR_SELECTION}${code}${OUTPUT_TEST_IN_TYPESCRIPT}`;
  } else {
    code = editor.document.getText();
    prompt = `${GENERATE_TEST_FOR_ENTIRE_FILE}${code}${OUTPUT_TEST_IN_TYPESCRIPT}`;
  }

  const fileName = editor.document.fileName;
  const testFileName =
    path.basename(fileName, path.extname(fileName)) + TEST_FILE_SUFFIX;
  const testFilePath = path.join(path.dirname(fileName), testFileName);

  const loadingMessage = vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Generating Tests...",
      cancellable: false,
    },
    async (progress) => {
      let result: string | null = null;
      try {
        progress.report({ message: "Sending request to Ollama..." });
        result = await llmService.generate(prompt);
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to generate tests: ${error}`);
        return;
      }

      if (!result) {
        vscode.window.showErrorMessage("Failed to generate tests.");
        return;
      }

      progress.report({ message: "Inserting tests..." });

      try {
        const testFileUri = vscode.Uri.file(testFilePath);
        let testDocument;

        try {
          testDocument = await vscode.workspace.openTextDocument(testFileUri);
        } catch {
          testDocument = await vscode.workspace.openTextDocument(
            vscode.Uri.parse(`untitled:${testFilePath}`)
          );
        }

        const edit = new vscode.WorkspaceEdit();
        if (testDocument.getText().length === 0) {
          edit.insert(testFileUri, new vscode.Position(0, 0), result);
        } else {
          edit.insert(
            testFileUri,
            testDocument.positionAt(testDocument.getText().length),
            `\n\n${result}`
          );
        }

        await vscode.workspace.applyEdit(edit);
        await testDocument.save();

        await vscode.window.showTextDocument(testDocument);
        vscode.window.showInformationMessage("Tests generated and inserted.");
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to insert tests: ${error}`);
      }
    }
  );

  await loadingMessage;
};
