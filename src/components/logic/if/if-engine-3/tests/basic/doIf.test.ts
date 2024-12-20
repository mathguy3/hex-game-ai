import { doIf } from "../../doIf";

describe("doIf", () => {
    it("doIf should return true if the value is equal", () => {
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
        const result = doIf({ ifItem, model })
        expect(result).toBe(true);
    });
    it("doIf should return true if the value is equal", () => {
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
        const result = doIf({ ifItem, model })
        expect(result).toBe(true);
    });
    it("doIf should return true if the value is equal", () => {
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
        const result = doIf({ ifItem, model })
        expect(result).toBe(true);
    });
    it("doIf should return true if the value is not equal", () => {
        const ifItem = {
            target: {
                name: {
                    notEquals: 'test'
                }
            }
        };
        const model = {
            target: {
                name: 'test2',
            }
        };
        const result = doIf({ ifItem, model })
        expect(result).toBe(true);
    });
    it("doIf should return false if the value is equal", () => {
        const ifItem = {
            target: {
                name: {
                    notEquals: 'test'
                }
            }
        };
        const model = {
            target: {
                name: 'test',
            }
        };
        const result = doIf({ ifItem, model })
        expect(result).toBe(false);
    });
});

