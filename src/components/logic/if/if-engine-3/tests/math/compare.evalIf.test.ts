import { doEval } from "../../doEval";

describe("evalIf", () => {
    it("evalIf should return 'test' if the value is 'test'", () => {
        const ifItem = {
            context: {
                name: {
                    equals: 'test'
                }
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
    it("evalIf should return 'test' if the value is 'test'", () => {
        const ifItem = {
            subject: {
                name: {
                    equals: 'test'
                }
            }
        };
        const model = {
            subject: {
                name: "test",
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe("test");
    });
    it("evalIf should return 'test' if the value is 'test'", () => {
        const ifItem = {
            target: {
                name: {
                    equals: 'test'
                }
            }
        };
        const model = {
            target: {
                name: "test",
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe("test");
    });
    it("evalIf should return true if the value is greater than", () => {
        const ifItem = {
            target: {
                health: {
                    greaterThan: 10
                }
            }
        };
        const model = {
            target: {
                health: 11,
            }
        };
        const result = doEval({ ifItem, model })
        expect(result).toBe(true);
    });
});

