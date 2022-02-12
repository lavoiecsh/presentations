import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from '@apollo/gateway';
import { GatewayContext } from './GatewayContext';

export class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }: GraphQLDataSourceProcessOptions<GatewayContext>): void {
    request.http.headers.set('authorization', (context as GatewayContext).authorization);
  }
}
