import NextLink from 'next/link';

import { Box, IconButton, Link } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtons {
  id: number;
  creatorId: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtons> = ({
  id,
  creatorId,
}) => {
  const { data: meData } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box ml='auto'>
      <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          icon={<EditIcon />}
          aria-label='Edit post'
          mr={4}
        />
      </NextLink>
      <IconButton
        icon={<DeleteIcon />}
        aria-label='Delete post'
        onClick={() => {
          deletePost({ variables: { id }, update: cache => {
            cache.evict({ id: 'Post:' + id });
          }});
        }}
      />
    </Box>
  );
};

export default EditDeletePostButtons;
