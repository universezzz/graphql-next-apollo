import { Heading, Box } from '@chakra-ui/react';

import Layout from '../../components/Layout';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';
import { withApollo } from '../../utils/withApollo';

const Post: React.FC<{}> = () => {
  const { data, loading, error } = useGetPostFromUrl();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>{data?.post?.text}</Box>
      <EditDeletePostButtons
        creatorId={data.post.creator.id}
        id={data.post.id}
      />
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
