import { useState } from 'react';
import { Box, Button, Link, Flex } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import NextLink from 'next/link';

import Wrapper from '../../components/Wrapper';
import InputField from '../../components/InputField';
import { toErrorMap } from '../../utils/toErrorMap';
import { MeDocument, MeQuery, useChangePasswordMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { withApollo } from '../../utils/withApollo';

const ChangePassword: any = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token: router.query.token === 'string' ? router.query.token : '', 
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.changePassword.user
                }
              });
            }
          });

          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);

            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }

            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name='newPassword'
                placeholder='New password'
                label='New Password'
                type='password'
              />
            </Box>
            {tokenError && (
              <Flex>
                <Box style={{ color: 'red' }} mr={2}>
                  {tokenError}
                </Box>
                <NextLink href='/forgot-password'>
                  <Link>click here to get a new one</Link>
                </NextLink>
              </Flex>
            )}
            <Button
              mt={4}
              type='submit'
              colorScheme='teal'
              isLoading={isSubmitting}
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
