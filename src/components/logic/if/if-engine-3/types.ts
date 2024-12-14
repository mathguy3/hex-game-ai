
type RealGameModel = {
    properties: {
        health: 5,
        deathHealth: 0
    }
}

interface ContextBase<GameModel extends ModelBase, Type extends IFType> {
    model: GameModel;
    type: Type
}

interface ModelBase {

}

// Utility types
type Values<V> = V[keyof V];
type ObjectToAnyPair<V> = Values<{ [K in keyof V]: { [K1 in K]: V[K1] } }>
type GeneralType<T> =
    T extends number ? number :
    T extends string ? string :
    T extends boolean ? boolean :
    T;

type StringConstant = '$String' | '$Float' | '$Int' | '$Boolean' | '$Object' | '$Array';
type SimpleType = string | number | boolean | {} | [] | null | undefined;
type SimpleByType<T> = string;

type FieldType<Property, Context extends ContextBase<any, any>> = ContextIndex<ContextBase<Context['model'], 'eval'>> | FieldsOf<Property, Context> | StringConstant | (Context['type'] extends 'if' ? GeneralType<Property> : never)

type FieldsOf<T, Context extends ContextBase<any, any>> = ObjectToAnyPair<{
    [Property in keyof T]: FieldType<T[Property], Context>;
}>

type ContextIndex<Context extends ContextBase<any, any>> = { context: FieldsOf<Context['model'], Context> }
type SubjectIndex = {}

type IfElse<Property, Context extends ContextBase<any, any>> = { if: FieldType<Property, Context>, else: FieldType<Property, Context> }

type Operations<Context extends ContextBase<any, any>> = IfElse<string, Context>
type IndexTypes<Context extends ContextBase<any, any>> = ContextIndex<Context>


type IFType = 'if' | 'eval' | 'set'
export type IFBase<Context extends ContextBase<any, any>> = IndexTypes<Context>

const experimentalIf: IFBase<ContextBase<RealGameModel, 'if'>> = {
    context: {
        properties: {
            health: {
                context: {
                    properties: {
                        health: "$Int"
                    }
                }
            }
        }
    }
}

type Test = GeneralType<5>
