import {useCallback, useEffect} from 'react'
import Head from 'next/head'
import {
  Button,
  Checkbox,
  Form,
  Input,
  notification,
  Radio,
  Typography,
} from 'antd'
import {useRouter} from 'next/router'
import {useMutation} from '@apollo/client'

import {User} from '../server/user/user.model'
import {SIGNUP_USER} from '../utils/queries'
import {setCookie} from '../utils/cookie'

import styles from '../styles/signin.module.scss'

const {Title, Text, Link} = Typography

const Signup: React.FC = () => {
  const [signupUser, {data, error}] =
    useMutation<{createUser: User}>(SIGNUP_USER)
  const router = useRouter()
  const onFinish = useCallback((input: any) => {
    signupUser({
      variables: {
        input,
      },
    })
  }, [])

  useEffect(() => {
    if (data) {
      setCookie('token', data.createUser.token)
      router.replace('profile')
    }
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: error.name,
        description: error.message,
      })
    }
  }, [error])

  return (
    <>
      <Head>
        <title>DigitalEstate | Sign up</title>
      </Head>
      <section className={styles.main}>
        <Title level={2}>Sign up</Title>
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          className={styles.form}>
          <Form.Item
            label="Type"
            name="type"
            rules={[{required: true, message: 'Please choose type!'}]}>
            <Radio.Group>
              <Radio.Button value="buyer">Buyer</Radio.Button>
              <Radio.Button value="seller">Seller</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Email incorrect!',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {required: true, message: 'Please input your name!'},
              {
                type: 'string',
                min: 3,
                message: 'Required at least 3 characters',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {required: true, message: 'Please input your password!'},
              {min: 6, message: 'Required at least 6 characters!'},
            ]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Should accept agreement')),
              },
            ]}>
            <Checkbox>
              I agree to <Link href="/agree">privacy policy</Link>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.formButton}>
              Sign up
            </Button>
          </Form.Item>
        </Form>
        <Text>
          Already have an account?{' '}
          <Link href="/signin" underline>
            Sign in
          </Link>
        </Text>
      </section>
    </>
  )
}

export default Signup
