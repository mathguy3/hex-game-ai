import { doIf } from "../../doIf";

describe("doIf", () => {
    const ifItem = {
        context: {
            name: {
                equals: {
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
                }
            }
        }
    };
    it("doIf should return false if shouldUseOther is true", () => {
        const model = {
            context: {
                name: "test",
                otherName: "test2",
                shouldUseOther: true
            }
        };
        const result = doIf({ ifItem, model })
        expect(result).toBe(false);
    });

    it("doIf should return true if shouldUseOther is false", () => {
        const model = {
            context: {
                name: "test",
                otherName: "test2",
                shouldUseOther: false
            }
        };
        const result = doIf({ ifItem, model })
        expect(result).toBe(true);
    });
});

