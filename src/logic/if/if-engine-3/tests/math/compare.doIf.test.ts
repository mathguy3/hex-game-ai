import { doIf } from "../../doIf";

describe("doIf", () => {
    it("doIf should return true if the value is equal", () => {
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
        const result = doIf({ ifItem, model })
        expect(result).toBe(true);
    });
    it("doIf should return false if the value is equal", () => {
        const ifItem = {
            target: {
                health: {
                    greaterThan: 11
                }
            }
        };
        const model = {
            target: {
                health: 11,
            }
        };
        const result = doIf({ ifItem, model })
        expect(result).toBe(false);
    });
    it("doIf should return true if the value is less than", () => {
        const ifItem = {
            target: {
                health: {
                    lessThan: 11
                }
            }
        };
        const model = {
            target: {
                health: 10,
            }
        };
        const result = doIf({ ifItem, model })
        expect(result).toBe(true);
    });
    it("doIf should return true if the value is less than equal", () => {
        const ifItem = {
            target: {
                health: {
                    lessThanEqual: 11
                }
            }
        };
        const model = {
            target: {
                health: 11,
            }
        };
        const result = doIf({ ifItem, model })
        expect(result).toBe(true);
    });
    it("doIf should return true if the value is greater than equal", () => {
        const ifItem = {
            target: {
                health: {
                    greaterThanEqual: 10
                }
            }
        };
        const model = {
            target: {
                health: 10,
            }
        };
        const result = doIf({ ifItem, model })
        expect(result).toBe(true);
    });
    it("doIf should return true if the value is equal", () => {
        const ifItem = {
            target: {
                health: {
                    equals: 10
                }
            }
        };
        const model = {
            target: {
                health: 10,
            }
        };
        const result = doIf({ ifItem, model })
        expect(result).toBe(true);
    });
});

