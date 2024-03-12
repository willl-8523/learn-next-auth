import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
} from 'next-auth/react';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';

export default function SignIn({ csrfToken, providers }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const signInUser = async (e) => {
    e.preventDefault();
    let options = { redirect: false, email, password };
    const res = await signIn('credentials', options);
    setMessage(null);

    if (res?.error) {
      setMessage(res.error);
      // return;
    }

    console.log(res);
    console.log(email, password);

    // return Router.push('/');
  };

  return (
    <>
      <form method="post" action="/api/auth/signin/email">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Email address
          <input type="email" id="email" name="email" />
        </label>
        <button type="submit">Sign in with Email</button>
      </form>

      <form action="">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Email
          <input
            type="email"
            id="email-credential"
            name="email-credential"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <p style={{ color: 'red' }}>{message}</p>
        <button onClick={(e) => signInUser(e)}>Sign in with Credentials</button>
        <button>Sign up</button>
      </form>

      {Object.values(providers).map((provider) => {
        if (provider.name === 'Email' || provider.name === 'Credentials') {
          return;
        }
        return (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        );
      })}
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: { destination: '/' },
    };
  }

  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();

  return {
    props: { csrfToken, providers },
  };
}
