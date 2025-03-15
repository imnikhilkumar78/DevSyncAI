import * as vscode from "vscode";
import { LlmApiService } from "../../service/llm-api-service";
import {
  GENERATE_DOCUMENTATION_FOR_SELECTION,
  ADD_AS_MULTILINE_COMMENT,
  GENERATE_DOCUMENTATION_FOR_FILE,
  DOCUMENTATION_GENERATED_INSERTED,
  FAILED_TO_GENERATE_DOCUMENTATION,
} from "./documentation-prompts";

export const generateDocumentation = async (
  llmService: LlmApiService
): Promise<void> => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

  const selection = editor.selection;
  const code = editor.document.getText(
    selection.isEmpty ? undefined : selection
  );
  const insertPosition = selection.isEmpty
    ? new vscode.Position(0, 0)
    : new vscode.Position(selection.start.line, 0);
  const prompt = selection.isEmpty
    ? `${GENERATE_DOCUMENTATION_FOR_FILE}${code}${ADD_AS_MULTILINE_COMMENT}`
    : `${GENERATE_DOCUMENTATION_FOR_SELECTION}${code}${ADD_AS_MULTILINE_COMMENT}`;

  const loadingMessage = vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Generating Documentation...",
      cancellable: false,
    },
    async (progress) => {
      let result: string | null = null;
      try {
        progress.report({ message: "Sending request to Ollama..." });
        result = await llmService.generate(prompt);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to generate documentation: ${error}`
        );
        return;
      }

      if (!result) {
        vscode.window.showErrorMessage(FAILED_TO_GENERATE_DOCUMENTATION);
        return;
      }

      progress.report({ message: "Inserting documentation..." });

      try {
        await editor.edit((editBuilder) => {
          editBuilder.insert(insertPosition, result + "\n\n");
        });
        vscode.window.showInformationMessage(DOCUMENTATION_GENERATED_INSERTED);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to insert documentation: ${error}`
        );
      }
    }
  );

  await loadingMessage;
};
