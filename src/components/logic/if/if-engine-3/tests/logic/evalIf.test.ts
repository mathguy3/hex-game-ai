import { doEval } from "../../doEval";

describe("evalIf", () => {
    const ifItem = {
        if: {
            context: {
                shouldUseOther: "$Boolean"
            }
        },
        then: {
            context: {
                otherName: "$String"
            }
        },
        else: {
            context: {
                name: "$String"
            }
        }
    };
    const ifItem2 = {
        context: {
            if: {
                shouldUseOther: "$Boolean"
            },
            then: {
                otherName: "$String"
            },
            else: {
                name: "$String"
            }
        }
    };
    it("doIf should return true if shouldUseOther is true", () => {
        const model = {
            context: {
                name: "test",
                otherName: "test2",
                shouldUseOther: true
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe("test2");
    });

    it("doIf should return false if shouldUseOther is false", () => {
        const model = {
            context: {
                name: "test",
                otherName: "test2",
                shouldUseOther: false
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe("test");
    });
    it("doIf should return true if shouldUseOther is true", () => {
        const model = {
            context: {
                name: "test",
                otherName: "test2",
                shouldUseOther: true
            }
        };
        const result = doEval({ ifItem: ifItem2, model })
        expect(result).toBe("test2");
    });

    it("doIf should return false if shouldUseOther is false", () => {
        const model = {
            context: {
                name: "test",
                otherName: "test2",
                shouldUseOther: false
            }
        };
        const result = doEval({ ifItem: ifItem2, model })
        expect(result).toBe("test");
    });
});

