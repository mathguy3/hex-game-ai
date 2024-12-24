import { doEval } from "../../doEval";

describe("evalIf", () => {
    const ifItem = {
        context: {
            and: [{
                oneValue: "$Boolean"
            }, {
                anotherValue: "$Boolean"
            }, {
                thirdValue: "$Boolean"
            }],
        }
    };
    it("doIf should return true if all values are true", () => {
        const model = {
            context: {
                oneValue: true,
                anotherValue: true,
                thirdValue: true
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe(true);
    });
    it("doIf should return false if one value is false", () => {
        const model = {
            context: {
                oneValue: true,
                anotherValue: false,
                thirdValue: true
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe(false);
    });
});
