import { UserInputError } from 'apollo-server-errors';

import { Blog } from '../../domain/Blog';
import { BlogContext } from '../../dataSources/BlogContext';

export function blog(
    _parent: null, // parent
    { id }: { id: string }, // arguments
    { dataSources: { blogs } }: BlogContext, // context
): Promise<Blog> {
    return blogs.get(id)
        .then(blog => blog || Promise.reject(new UserInputError(`Blog with id ${id} not found`)));
}
