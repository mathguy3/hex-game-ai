import { doEval } from "../../doEval";

describe("evalIf", () => {
    it("evalIf should return 'test' if the value is 'test'", () => {
        const ifItem = {
            context: {
                name: "$String"
            }
        };
        const model = {
            context: {
                name: "test",
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe("test");
    });
});

