import { useRouter } from 'next/router';

import { FormControl, Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';

import InputField from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
import Layout from '../components/Layout';
import { useIsAuth } from '../utils/hooks/useIsAuth';
import { withApollo } from '../utils/withApollo';

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { errors } = await createPost({ variables: { input: values }, update: (cache) => {
            cache.evict({ fieldName: 'posts' });
          }});

          if (!errors) {
            router.push('/');
          }
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
                create post
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
