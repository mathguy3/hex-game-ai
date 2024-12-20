import { doSet } from "../../doSet";

describe("setIf", () => {
    it("doSet should set the value to 'blah' if the value is 'blah'", () => {
        const ifItem = {
            context: {
                name: {
                    equals: 'blah'
                }
            }
        };
        const model = {
            context: {
                name: "test",
            }
        };
        const { context } = doSet({ ifItem, model })
        expect(model.context.name).toBe("blah");
        expect(context.name).toBe("blah");
    });
    it("doSet should set the value to 'blah' if the value is 'blah'", () => {
        const ifItem = {
            subject: {
                name: {
                    equals: 'blah'
                }
            }
        };
        const model = {
            subject: {
                name: "test",
            }
        };
        const { subject } = doSet({ ifItem, model })
        expect(model.subject.name).toBe("blah");
        expect(subject.name).toBe("blah");
    });
    it("doSet should set the value to 'blah' if the value is 'blah'", () => {
        const ifItem = {
            target: {
                name: {
                    equals: 'blah'
                }
            }
        };
        const model = {
            target: {
                name: "test",
            }
        };
        const { target } = doSet({ ifItem, model })
        expect(model.target.name).toBe("blah");
        expect(target.name).toBe("blah");
    });
});

