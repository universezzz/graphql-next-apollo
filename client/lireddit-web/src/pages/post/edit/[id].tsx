import { FormControl, Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';

import Layout from '../../../components/Layout';
import InputField from '../../../components/InputField';
import {
  useUpdatePostMutation,
  usePostQuery,
} from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { useRouter } from 'next/router';
import { withApollo } from '../../../utils/withApollo';

export const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();

  if (loading || !data) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }
  
  if (!data.post) {
    return (
      <Layout>
        <Box>Could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ variables: { id: intId, ...values }});
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField name='title' placeholder='Title' label='Title' />
              <Box mt={4}>
                <InputField
                  textarea={true}
                  name='text'
                  placeholder='Text...'
                  label='Text'
                />
              </Box>
              <Button
                mt={4}
                type='submit'
                colorScheme='teal'
                isLoading={isSubmitting}
              >
                update post
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
