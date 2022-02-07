import { gql } from '@apollo/client/core';

export const ChirpFragment = gql`
    fragment ChirpFragment on Chirp {
        id
        contents
        author {
            id
            username
            chirps { id contents }
        }
        parent {
            id
            contents
            replies { id contents }
        }
        replies {
            id
            contents
        }
    }
`;

export const UserFragment = gql`
    ${ChirpFragment}

    fragment UserFragment on User {
        id
        username
        chirps { ...ChirpFragment }
    }
`;

export const ErrorsFragment = gql`
    fragment ErrorsFragment on UsageError {
        __typename
        message
        ... on TooLongContents {
            length
            maxLength
        }
        ... on InvalidUsername {
            username
        }
        ... on UsernameTaken {
            username
        }
        ... on ChirpNotFound {
            chirpId
        }
    }
`;
