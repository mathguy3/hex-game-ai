
type RealGameModel = {
    properties: {
        health: 5,
        deathHealth: 0
    }
}

export interface ContextBase<GameModel extends ModelBase, Type extends IFType> {
    model: GameModel;
    type: Type
}

export interface ModelBase {
    properties: {
        [key: string]: any
    }
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

type FieldType<Property, Context extends ContextBase<any, any>> = IndexTypesEval<Context> | FieldsOf<Property, Context> | StringConstant | (Context['type'] extends 'if' ? GeneralType<Property> : never)

type FieldsOf<T, Context extends ContextBase<any, any>> = ObjectToAnyPair<{
    [Property in keyof T]: FieldType<T[Property], Context>;
}>

type ContextIndex<Context extends ContextBase<any, any>> = { context: FieldsOf<Context['model'], Context> }
type SubjectIndex = {}

type IfElse<Context extends ContextBase<any, any>> = { if: IndexTypesIf<Context>, then: IndexTypesEval<Context>, else?: ContextIndex<Context> }
type Equals<Context extends ContextBase<any, any>> = Context['type'] extends 'eval' ? never : { '=': ContextIndex<Context> } | { equals: ContextIndex<Context> }

type Operations<Context extends ContextBase<any, any>> = IfElse<Context> | Equals<Context>

type IndexTypes<Context extends ContextBase<any, any>> = ContextIndex<Context> | Operations<Context>
type IndexTypesEval<Context extends ContextBase<any, any>> = ContextIndex<ContextBase<Context['model'], 'eval'>> | Operations<Context>
type IndexTypesIf<Context extends ContextBase<any, any>> = ContextIndex<ContextBase<Context['model'], 'if'>> | Operations<Context>


type IFType = 'if' | 'eval' | 'set'
export type IFBase<Context extends ContextBase<any, any>> = IndexTypes<Context>

const experimentalIf: IFBase<ContextBase<RealGameModel, 'if'>> = {
    context: {
        properties: {
            health: {
                '=': {
                    context: {
                        properties: {
                            health: "$Int"
                        }
                    }
                }
            }
        }
    }
}

type Test = GeneralType<5>
