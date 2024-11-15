import { Action, Interaction, SystemAction } from "../../../../../types/actions/interactions";
import { Sequence } from "../../../../../types/game";

export const isAction = (action: Sequence | Interaction): action is Action | SystemAction => ['action', 'system'].includes(action.type);