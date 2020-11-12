import {Dashboard} from '../../../dashboard/models';
import {uuid} from '../../utils/uuid';

/**
 * Create a dashboard with a user associated with it
 * @param params initialize options
 * @returns {Dashboard} a newly created dashboard with user id
 */
export const createDashboard = (params: { userId: string, name: string, description?: string }): Dashboard => {
  return {
    id: uuid(),
    userId: params.userId,
    name: params.name,
    description: params.description ? params.description : null
  };
};
