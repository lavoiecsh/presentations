import { DataSource } from 'apollo-datasource';
import { Comment } from '../domain/Comment';
import { CommentDataSource } from './BlogDataSources';

export class CommentInMemoryDataSource extends DataSource implements CommentDataSource {
    private count: number;
    private readonly comments: Record<string, Comment[]>;

    constructor() {
        super();
        this.count = 0;
        this.comments = {};
    }

    create(author: string, blog: string, contents: string): Promise<Comment> {
        const comment = {
            id: (this.count++).toString(),
            author,
            blog,
            contents,
        };
        if (!this.comments[blog])
            this.comments[blog] = [];
        this.comments[blog].push(comment);
        return Promise.resolve(comment);
    }

    getByBlog(blog: string): Promise<Comment[]> {
        return Promise.resolve(this.comments[blog] || []);
    }
}
