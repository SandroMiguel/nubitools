import { promptInput } from "../../src/cli/promptInput.js";
import inquirer from "inquirer";

jest.mock("inquirer");

describe("promptInput()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user input without validation", async () => {
    inquirer.prompt.mockResolvedValueOnce({ input: "test value" });

    const result = await promptInput("Enter something:");
    expect(result).toBe("test value");
    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: "input",
        name: "input",
        message: "Enter something:",
      },
    ]);
  });

  it("should pass the custom validator to inquirer", async () => {
    const validator = jest.fn();

    inquirer.prompt.mockResolvedValueOnce({ input: "any value" });

    await promptInput("Enter something:", validator);

    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: "input",
        name: "input",
        message: "Enter something:",
        validate: validator,
      },
    ]);
  });
});
