import { BlogDataSources } from './BlogDataSources';

export interface BlogContext {
    user: string;
    dataSources: BlogDataSources;
}
