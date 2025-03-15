import axios, { AxiosResponse } from "axios";
import * as vscode from "vscode";

export class LlmApiService {
  private readonly apiUrl: string = "http://localhost:11434/api";
  private readonly baseUrl: string = "/generate";
  private readonly modelName: string = "devsyncaiV1";
  private isApiAvailable: boolean = false;
  private readonly initializationPromise: Promise<void>;

  constructor() {
    this.initializationPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      console.log(`${this.apiUrl}/tags`);
      await axios.get(`${this.apiUrl}/tags`);
      console.log("returning true");
      this.isApiAvailable = true;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.code === "ECONNREFUSED") {
        this.isApiAvailable = false;
      } else {
        console.error("Error checking Ollama status:", error);
        this.isApiAvailable = false;
      }
    }
  }

  public isAvailable(): boolean {
    return this.isApiAvailable;
  }

  public async generate(prompt: string): Promise<string> {
    await this.initializationPromise;

    if (!this.isApiAvailable) {
      vscode.window.showErrorMessage("Ollama API is not available.");
      return "Error: Ollama API is not available.";
    }

    if (!prompt) {
      vscode.window.showErrorMessage("Prompt cannot be empty.");
      return "Error: Prompt cannot be empty.";
    }

    try {
      const response: AxiosResponse = await axios.post(
        `${this.apiUrl}${this.baseUrl}`,
        {
          model: this.modelName,
          prompt: prompt,
          stream: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (typeof response.data.response !== "string") {
        vscode.window.showErrorMessage("Invalid response format from Ollama.");
        return "Error: Invalid response format.";
      }

      return response.data.response;
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.message;
        if (error.response) {
          errorMessage = `Ollama API error: ${error.response.status} - ${error.response.data}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      vscode.window.showErrorMessage(
        `Error communicating with Ollama: ${errorMessage}`
      );
      return `Error: ${errorMessage}`;
    }
  }

  public async generateStreaming(
    prompt: string,
    onData: (data: string) => void
  ): Promise<string> {
    await this.initializationPromise;

    if (!this.isApiAvailable) {
      return this.handleError("Ollama API is not available.");
    }
    if (!prompt) {
      return this.handleError("Prompt cannot be empty.");
    }

    try {
      const response: AxiosResponse = await axios.post(
        `${this.apiUrl}${this.baseUrl}`,
        { model: this.modelName, prompt: prompt, stream: true },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "stream",
        }
      );

      return await this.processStream(response.data, onData);
    } catch (error: any) {
      return this.handleAxiosError(error);
    }
  }

  private async processStream(
    stream: any,
    onData: (data: string) => void
  ): Promise<string> {
    let accumulatedResponse = "";
    for await (const chunk of stream) {
      const lines = chunk
        .toString()
        .split("\n")
        .filter((line: string) => line.trim() !== "");
      for (const line of lines) {
        const parsed = this.parseJson(line);
        if (parsed && typeof parsed.response === "string") {
          accumulatedResponse += parsed.response;
          onData(parsed.response);
        } else if (parsed) {
          return this.handleError("Invalid streaming response format.");
        }
      }
    }
    return accumulatedResponse;
  }

  private parseJson(line: string): any {
    try {
      return JSON.parse(line);
    } catch (parseError) {
      this.handleError(`Error parsing streaming response: ${parseError}`);
      return null;
    }
  }

  private handleError(message: string): string {
    vscode.window.showErrorMessage(message);
    return `Error: ${message}`;
  }

  private handleAxiosError(error: any): string {
    let errorMessage = "An unexpected error occurred.";
    if (axios.isAxiosError(error)) {
      errorMessage = error.message;
      if (error.response) {
        errorMessage = `Ollama API error: ${error.response.status} - ${error.response.data}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return this.handleError(`Error communicating with Ollama: ${errorMessage}`);
  }
}
