import { user } from '../../../user/resolvers/Query/user';
import { chirp } from './chirp';
import { chirps } from './chirps';

export const Query = {
    chirp,
    chirps,
    user,
};
