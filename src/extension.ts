import * as vscode from "vscode";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "code-refactor" is now active!');

  const disposable = vscode.commands.registerCommand(
    "code-refactor.refactor",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("Please open a file to refactor.");
        return;
      }

      const code = editor.document.getText();
      const refactoredCode = await refactorCode(code);

      if (refactoredCode) {
        await applyRefactoredCode(editor, refactoredCode);
        vscode.window.showInformationMessage(
          "Code Refactor: Refactoring applied successfully."
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function refactorCode(code: string): Promise<string | undefined> {
  const prompt = `Refactor the following code and add comments explaining the changes:\n\n${code}\n`;

  try {
	console.log("POST: ", OPENAI_API_KEY);
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a development assistant" },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const refactoredCode = response.data.choices[0].message.content;
	console.log("Response: ", refactoredCode);
    return refactoredCode;
  } catch (error) {
    vscode.window.showErrorMessage("Error during code refactoring: " + error);
    return undefined;
  }
}

async function applyRefactoredCode(
  editor: vscode.TextEditor,
  refactoredCode: string
) {
  const edit = new vscode.WorkspaceEdit();
  const fullRange = new vscode.Range(
    editor.document.positionAt(0),
    editor.document.positionAt(editor.document.getText().length)
  );

  edit.replace(editor.document.uri, fullRange, refactoredCode);

  await vscode.workspace.applyEdit(edit);
}

export function deactivate() {}
