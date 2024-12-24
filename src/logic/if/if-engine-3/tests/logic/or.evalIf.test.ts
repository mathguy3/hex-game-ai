import { doEval } from "../../doEval";

describe("evalIf", () => {
    const ifItem = {
        context: {
            or: [{
                oneValue: "$Boolean"
            }, {
                anotherValue: "$Boolean"
            }, {
                thirdValue: "$Boolean"
            }],
        }
    };
    it("doIf should return true if any value is true", () => {
        const model = {
            context: {
                oneValue: true,
                anotherValue: false,
                thirdValue: false
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe(true);
    });
    it("doIf should return false if all values are false", () => {
        const model = {
            context: {
                oneValue: false,
                anotherValue: false,
                thirdValue: false
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe(false);
    });
});
