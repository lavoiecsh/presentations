import { AuthenticationError } from 'apollo-server-errors';

import { Blog } from '../../domain/Blog';
import { BlogContext } from '../../dataSources/BlogContext';
import { UsageError, EmptyTitleError, EmptyContentsError } from './errors';

interface CreateBlogInput {
    title: string;
    contents: string;
}

interface CreateBlogPayload {
    blog: Blog | null;
    errors: UsageError[] | null;
}

export async function createBlog(
    _parent: null, // parent
    { input: { title, contents } }: { input: CreateBlogInput }, // arguments
    { user, dataSources: { users, blogs } }: BlogContext, // context
): Promise<CreateBlogPayload> {
    if (!user || !(await users.get(user)))
        return Promise.reject(new AuthenticationError("User is not authenticated"));

    const errors: UsageError[] = [];
    if (!title.length)
        errors.push(new EmptyTitleError());
    if (!contents.length)
        errors.push(new EmptyContentsError());

    if (errors.length)
        return Promise.resolve({ blog: null, errors });

    return blogs.create(user, title, contents)
        .then(blog => ({ blog, errors: null }));
}
