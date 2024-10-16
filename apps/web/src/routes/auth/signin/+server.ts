import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
  const redirectUrl = await loginTest();
  console.error('Redirecting to', redirectUrl);
  throw redirect(302, redirectUrl);
};


const loginTest = async () => {
  const { csrfToken }: { csrfToken: string } = await fetch(
      "http://localhost:5173/api/auth/csrf"
  ).then((res) => res.json());
  const formData = new FormData();
  formData.append('csrfToken', csrfToken);

  const response = await fetch("http://localhost:5173/api/auth/signin/keycloak?csrf=true", {
      method: "POST",
      headers: {
        'X-CSRF-Token': csrfToken
      },
      body: formData,
      redirect: 'manual'
  });

  // Get the redirect URL from the Location header
  const redirectUrl = response.headers.get('Location');
  if (!redirectUrl) {
      throw new Error('No redirect URL found');
  }

  return redirectUrl;
};
