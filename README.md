# DevSync AI

DevSync AI is a VS Code extension that leverages the power of local Large Language Models (LLMs) through Ollama to enhance your development workflow. It provides features to generate unit tests and documentation directly within your VS Code editor.

## Features

* **Generate Unit Tests:** Create comprehensive unit tests for selected code or entire files using CodeLlama.
* **Generate Documentation:** Automatically generate inline documentation for your code.
* **Local LLM Processing:** Utilizes Ollama to run LLMs locally, ensuring privacy and control.
* **Customizable LLM Behavior:** Fine-tune CodeLlama's behavior using a custom `Modelfile`.

## Prerequisites

1.  **VS Code:** Make sure you have Visual Studio Code installed.
2.  **Node.js and npm (or Yarn):** These are required for building and running the extension.
3.  **Ollama:** Download and install Ollama from [ollama.ai](https://ollama.ai/).
4.  **CodeLlama Model:** Pull the CodeLlama model using Ollama:

    ```bash
    ollama pull codellama
    ```

## Installation and Running

1.  **Clone the Repository:**

    ```bash
    git clone <your-repository-url>
    cd DevSyncAI
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Open in VS Code:**

    ```bash
    code .
    ```

4.  **Build the Extension:**

    ```bash
    npm run compile
    # or
    yarn compile
    ```

5.  **Run the Extension in Debug Mode:**

    * Go to the "Run and Debug" view in VS Code (Ctrl+Shift+D or Cmd+Shift+D).
    * Click the green "Run Extension" button or press F5.
    * This will open a new VS Code window (Extension Development Host) where your extension will be running.

## Using the Extension

1.  **Open a TypeScript File:** Open a `.ts` file in the Extension Development Host window.
2.  **Generate Tests:**
    * Select code or leave the selection empty for the whole file.
    * Open the command palette (Ctrl+Shift+P or Cmd+Shift+P).
    * Type and select "DevSync AI: Generate Tests".
    * The generated tests will be inserted into a `.spec.ts` file in the same directory.
3.  **Generate Documentation:**
    * Select code or leave the selection empty for the whole file.
    * Open the command palette.
    * Type and select "DevSync AI: Generate Documentation".
    * The generated documentation will be inserted as comments at the top of the selection or file.

## Customizing CodeLlama

1.  **Create a `Modelfile`:**
    * Create a directory for your custom model.
    * Place a `Modelfile` in that directory.

    ```
    FROM codellama
    PARAMETER temperature 0.3
    PARAMETER num_ctx 4096
    SYSTEM You are an expert TypeScript code assistant.
    STOP ["\n\n\n", "```"]
    ```

2.  **Build the Custom Model:**
    * Open a terminal and navigate to the directory containing your `Modelfile`.
    * Run the following command:

        ```bash
        ollama create your-model-name -f Modelfile
        ```

        * Replace `your-model-name` with the desired name for your custom model.

3.  **Use the Custom Model:**
    * In your VS Code extension's code (`llm-api-service.ts`), make sure to use the name of your custom model when making API requests to Ollama.

        ```typescript
        // In LlmApiService class
        private readonly modelName: string = "your-model-name"; // Replace with your model name
        ```

## Debugging

* Set breakpoints in your TypeScript code.
* When running the extension in debug mode, the debugger will stop at your breakpoints.
* Use the VS Code debugger to inspect variables and step through your code.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.
