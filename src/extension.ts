import * as vscode from "vscode";
import { generateDocumentation } from "./commands/generate-documentation/generate-documentation";
import { generateTests } from "./commands/generate-tests/generate-tests";
import { LlmApiService } from "./service/llm-api-service";

export function activate(context: vscode.ExtensionContext) {
  const llmService = new LlmApiService();

  context.subscriptions.push(
    vscode.commands.registerCommand("smartCodeBuddy.generateTests", () =>
      generateTests(llmService)
    ),
    vscode.commands.registerCommand(
      "smartCodeBuddy.generateDocumentation",
      () => generateDocumentation(llmService)
    )
  );
}

export function deactivate() {
  console.log("Your Extension is now deactivated");
}
