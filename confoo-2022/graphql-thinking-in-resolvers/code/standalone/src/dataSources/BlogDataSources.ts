import { User } from '../domain/User';
import { Blog } from '../domain/Blog';
import { Comment } from '../domain/Comment';

export interface UserDataSource {
    create(username: string): Promise<User>;
    get(id: string): Promise<User | null>;
}

export interface BlogDataSource {
    create(author: string, title: string, contents: string): Promise<Blog>;
    get(id: string): Promise<Blog | null>;
    getAll(): Promise<Blog[]>;
}

export interface CommentDataSource {
    create(author: string, blog: string, contents: string): Promise<Comment>;
    getByBlog(blog: string): Promise<Comment[]>;
}

export interface BlogDataSources {
    users: UserDataSource;
    blogs: BlogDataSource;
    comments: CommentDataSource;
}
