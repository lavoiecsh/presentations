import { DataSource } from 'apollo-datasource';
import { Blog } from '../domain/Blog';
import { BlogDataSource } from './BlogDataSources';

export class BlogInMemoryDataSource extends DataSource implements BlogDataSource {
    private readonly blogs: Blog[];

    constructor() {
        super();
        this.blogs = [];
    }

    create(author: string, title: string, contents: string): Promise<Blog> {
        const blog = {
            id: (this.blogs.length + 1).toString(),
            title,
            contents,
            author,
        };
        this.blogs.push(blog);
        return Promise.resolve(blog);
    }

    get(id: string): Promise<Blog | null> {
        return Promise.resolve(this.blogs.find(b => b.id === id));
    }

    getAll(): Promise<Blog[]> {
        return Promise.resolve(this.blogs);
    }
}
