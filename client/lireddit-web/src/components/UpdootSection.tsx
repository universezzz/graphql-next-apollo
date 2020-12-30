import gql from 'graphql-tag';
import { useState } from 'react';
import { Flex, IconButton } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

import { PostSnippetFragment, useVoteMutation, VoteMutation } from '../generated/graphql';
import { ApolloCache } from '@apollo/client';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

type UpdootLoadingState = 'updoot-loading' | 'downdoot-loading' | 'not-loading';

const updateAfterVote = (value: number, postId: number, cache: ApolloCache<VoteMutation>) => {
  const data = cache.readFragment<{
    id: number,
    points: number,
    voteStatus: number | null 
  }>({
    id: 'Post:' + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }

    const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2) * value;

    cache.writeFragment(
      { 
        id: 'Post:' + postId,
        fragment:  gql`
          fragment __ on Post {
            points
            voteStatus
          }
        `,
        data: { points: newPoints, voteStatus: value }
      }
    );
  }
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<UpdootLoadingState>(
    'not-loading'
  );
  const [vote] = useVoteMutation();

  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton
        icon={<ChevronUpIcon />}
        size='24px'
        aria-label='up vote'
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState('updoot-loading');
          await vote({ variables: { postId: post.id, value: 1 }, 
            update: (cache) => updateAfterVote(1, post.id, cache) 
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'updoot-loading'}
        colorScheme={post.voteStatus === 1 ? 'green' : undefined}
      />
      {post.points}
      <IconButton
        icon={<ChevronDownIcon />}
        size='24px'
        aria-label='down vote'
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState('downdoot-loading');
          await vote({ variables: { postId: post.id, value: -1 }, 
            update: (cache) => updateAfterVote(-1, post.id, cache) 
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'downdoot-loading'}
        colorScheme={post.voteStatus === -1 ? 'red' : undefined}
      />
    </Flex>
  );
};

export default UpdootSection;
