import { doEval } from "../../doEval";

describe("evalIf", () => {
    const ifItem = {
        context: {
            not: {
                or: [{
                    oneValue: "$Boolean"
                }, {
                    anotherValue: "$Boolean"
                }, {
                    thirdValue: "$Boolean"
                }]
            }
        }
    };
    it("doIf should return false if any value is true", () => {
        const model = {
            context: {
                oneValue: true,
                anotherValue: false,
                thirdValue: false
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe(false);
    });
    it("doIf should return true if all values are false", () => {
        const model = {
            context: {
                oneValue: false,
                anotherValue: false,
                thirdValue: false
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe(true);
    });
});
