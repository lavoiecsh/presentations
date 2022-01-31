import { Blog } from '../../domain/Blog';
import { BlogContext } from '../../dataSources/BlogContext';

export function blogs(
    _parent: null, // parent
    _arguments: null, // arguments
    { dataSources: { blogs } }: BlogContext, // context
): Promise<Blog[]> {
    return blogs.getAll();
}
