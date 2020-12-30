import { usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import { Link, Stack, Box, Heading, Text, Flex, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import UpdootSection from '../components/UpdootSection';
import EditDeletePostButtons from '../components/EditDeletePostButtons';
import { withApollo } from '../utils/withApollo';

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true
  });

  if (!loading && !data) {
    return (
      <div>
        you got query failed for some reason
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <Layout>
      {!data && loading ? (
        <div>Loading...</div>
      ) : (
        <Stack>
          {data?.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href='/post/[id]' as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize='xl'>{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>posted by {p.creator.username}</Text>
                  <Text mt={4}>{p.textSnippet}</Text>
                  <Flex>
                    <Text mt={4} flex={1}>
                      {p.textSnippet}
                    </Text>

                    <EditDeletePostButtons id={p.id} creatorId={p.creator.id} />
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore && (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables!.limit,
                  cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                // updateQuery: (previousValues, { fetchMoreResult }): PostsQuery => {
                //   if (!fetchMoreResult) {
                //     return previousValues as PostsQuery;
                //   }

                //   return {
                //     __typename: 'Query',
                //     posts: {
                //       __typename: 'PaginatedPost',
                //       hasMore: fetchMoreResult.posts.hasMore,
                //       posts: [
                //         ...previousValues.posts.posts,
                //         ...fetchMoreResult.posts.posts
                //       ],
                //     }
                //   }
                // } 
              });
            }}
            isLoading={loading}
            m='auto'
            my={8}
          >
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
