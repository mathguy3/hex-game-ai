// Write a basic test that runs a simple context on the doIf function I'll start writing right after this comment

import { doIf } from "../if";

describe("doIf", () => {
    it("should return true if the context is true", () => {
        const context = {
            operationType: "if",
            ifItem: {
                context: {
                    name: 'test'
                }
            },
            contextModel: {
                name: "test",
            },
            path: 'start',
            history: ['start'],
        };
        expect(doIf(context)).toBe(true);
    });
});

