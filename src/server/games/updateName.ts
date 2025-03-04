import { User } from '../user/id';
import { gameManager } from './gameManager';

interface ActionResponse {
  user: User;
}

export const updateName = (params: { user: User; name: string }): ActionResponse => {
  const { user, name } = params;

  try {
    // Handle the action and get the response
    const updatedUser = gameManager.updateName(user.userId, name);

    return { user: updatedUser };
  } catch (error) {
    // Rethrow with more context
    throw error;
  }
};
