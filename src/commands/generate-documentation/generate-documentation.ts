import * as vscode from "vscode";
import { sendOpenRouterRequest } from "../../openrouter";
import {
  ADD_AS_MULTILINE_COMMENT,
  DOCUMENTATION_GENERATED_INSERTED,
  FAILED_TO_GENERATE_DOCUMENTATION,
  GENERATE_DOCUMENTATION_FOR_FILE,
  GENERATE_DOCUMENTATION_FOR_SELECTION,
} from "./documentation-prompts";
import { sendOllamaRequest } from "../../LLM Service/ollama-helper";

export const generateDocumentation = async (): Promise<void> => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

  const selection = editor.selection;
  let code: string;
  let insertPosition: vscode.Position;
  let prompt: string;

  if (!selection.isEmpty) {
    //Means a code block is selected
    //Generate documentation for this code block and insert at top of line.
    code = editor.document.getText(selection);
    insertPosition = new vscode.Position(selection.start.line, 0);
    prompt = `${GENERATE_DOCUMENTATION_FOR_SELECTION}${code}${ADD_AS_MULTILINE_COMMENT}`;
  } else {
    //generate documentation for whole file
    code = editor.document.getText();
    insertPosition = new vscode.Position(0, 0);
    prompt = `${GENERATE_DOCUMENTATION_FOR_FILE}${code}${ADD_AS_MULTILINE_COMMENT}`;
  }

  //Send the prompt to open router
  //const result = await sendOpenRouterRequest(prompt);

  const result = await sendOllamaRequest(prompt);
  console.log(result);

  if (result) {
    editor.edit(editBuilder => {
      editBuilder.insert(insertPosition, result + '\n\n');
    });
    vscode.window.showInformationMessage(DOCUMENTATION_GENERATED_INSERTED);
  } else {
    vscode.window.showErrorMessage(FAILED_TO_GENERATE_DOCUMENTATION);
  }
};
