import { doIf } from "../if";

describe("doIf", () => {
    it("should return true if the context is true", () => {
        const context = {
            ifItem: {
                context: {
                    name: {
                        equals: 'test'
                    }
                }
            },
            contextModel: {
                name: "test",
            },
            path: 'start',
            history: ['start'],
        };
        console.log(context.history)
        expect(doIf(context)).toBe(true);
    });
});

