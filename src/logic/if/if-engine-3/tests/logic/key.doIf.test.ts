import { doIf } from "../../doIf";

describe("doIf", () => {
    const ifItem = {
        context: {
            name: {
                equals: {
                    context: {
                        key: {
                            context: {
                                nameKey: "$String"
                            }
                        },
                        value: "$String"
                    }
                }
            }
        }
    };
    it("doIf should return false if key is otherName", () => {
        const model = {
            context: {
                name: "test",
                otherName: "test2",
                nameKey: "otherName"
            }
        };
        const result = doIf({ ifItem, model })
        expect(result).toBe(false);
    });

    it("doIf should return true if key is name", () => {
        const model = {
            context: {
                name: "test",
                otherName: "test2",
                nameKey: "name"
            }
        };
        const result = doIf({ ifItem, model })
        expect(result).toBe(true);
    });
});

