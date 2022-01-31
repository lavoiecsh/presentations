import { AuthenticationError } from 'apollo-server-errors';

import { Comment } from '../../domain/Comment';
import { BlogContext } from '../../dataSources/BlogContext';
import { UsageError, UnknownBlogError, EmptyContentsError } from './errors';

interface CommentOnBlogInput {
    blog: string;
    contents: string;
}

interface CommentOnBlogPayload {
    comment: Comment | null;
    errors: UsageError[] | null;
}

export async function commentOnBlog(
    _parent: null, // parent
    { input: { blog, contents } }: { input: CommentOnBlogInput }, // arguments
    { user, dataSources: { users, blogs, comments } }: BlogContext, // context
): Promise<CommentOnBlogPayload> {
    if (!user || !(await users.get(user)))
        return Promise.reject(new AuthenticationError("User is not authenticated"));

    const errors: UsageError[] = [];
    if (!contents)
        errors.push(new EmptyContentsError());
    if (!(await blogs.get(blog)))
        errors.push(new UnknownBlogError(blog));

    if (errors.length)
        return Promise.resolve({ comment: null, errors });

    return comments.create(user, blog, contents)
        .then(comment => ({ comment, errors: null }));
}
