export const GENERATE_TEST_FOR_SELECTION = `
Generate thorough unit tests for the following TypeScript function(s) using Jest or Mocha. Follow these guidelines:

1.  **Import Statements:** Include necessary import statements at the beginning of the file.
2.  **Describe Block:** Use a 'describe' block to group related tests.
3.  **Test Cases:** For each test case, use an 'it' block with a descriptive message.
4.  **Assertions:** Use 'expect' to make assertions about the function's output.
5.  **Edge Cases and Invalid Inputs:** Include test cases for edge cases and invalid inputs.
6.  **Example Structure:**

    \`\`\`typescript
    describe('yourFunctionName', () => {
        it('should handle valid input', () => {
            // Your test logic here
            expect(yourFunction(validInput)).toEqual(expectedOutput);
        });

        it('should handle edge case', () => {
            // Your test logic here
            expect(yourFunction(edgeCaseInput)).toEqual(expectedOutput);
        });
    });
    \`\`\`

\`\`\`typescript
`;

export const OUTPUT_TEST_IN_TYPESCRIPT = `
\`\`\`

Please output the generated tests in TypeScript, using Jest or Mocha. Include necessary imports and setup. Ensure the tests are well-structured and easy to understand.
`;

export const GENERATE_TEST_FOR_ENTIRE_FILE = `
Generate thorough unit tests for all functions and classes in the following TypeScript file using Jest or Mocha. Follow these guidelines:

1.  **Import Statements:** Include necessary import statements at the beginning of the file.
2.  **Describe Blocks:** Use 'describe' blocks to group related tests for each function or class.
3.  **Test Cases:** For each test case, use an 'it' block with a descriptive message.
4.  **Assertions:** Use 'expect' to make assertions about the function or class's output.
5.  **Edge Cases and Invalid Inputs:** Include test cases for edge cases and invalid inputs.
6.  **Example Structure:**

    \`\`\`typescript
    describe('yourFunctionName', () => {
        it('should handle valid input', () => {
            // Your test logic here
            expect(yourFunction(validInput)).toEqual(expectedOutput);
        });

        it('should handle edge case', () => {
            // Your test logic here
            expect(yourFunction(edgeCaseInput)).toEqual(expectedOutput);
        });
    });
    \`\`\`

\`\`\`typescript
`;