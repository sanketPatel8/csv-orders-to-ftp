// import { useState } from "react";
// import { Form, useActionData, useLoaderData } from "@remix-run/react";
// import {
//   AppProvider as PolarisAppProvider,
//   Button,
//   Card,
//   FormLayout,
//   Page,
//   Text,
//   TextField,
// } from "@shopify/polaris";
// import polarisTranslations from "@shopify/polaris/locales/en.json";
// import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
// import { login } from "../../shopify.server";
// import { loginErrorMessage } from "./error.server";

// export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

// export const loader = async ({ request }) => {
//   const errors = loginErrorMessage(await login(request));

//   return { errors, polarisTranslations };
// };

// export const action = async ({ request }) => {
//   const errors = loginErrorMessage(await login(request));

//   return {
//     errors,
//   };
// };

// export default function Auth() {
//   const loaderData = useLoaderData();
//   const actionData = useActionData();
//   const [shop, setShop] = useState("");
//   const { errors } = actionData || loaderData;

//   return (
//     <PolarisAppProvider i18n={loaderData.polarisTranslations}>
//       <Page>
//         <Card>
//           <Form method="post">
//             <FormLayout>
//               <Text variant="headingMd" as="h2">
//                 Log in
//               </Text>
//               <TextField
//                 type="text"
//                 name="shop"
//                 label="Shop domain"
//                 helpText="example.myshopify.com"
//                 value={shop}
//                 onChange={setShop}
//                 autoComplete="on"
//                 error={errors.shop}
//               />
//               <Button submit>Log in</Button>
//             </FormLayout>
//           </Form>
//         </Card>
//       </Page>
//     </PolarisAppProvider>
//   );
// }

// app/routes/auth/login.jsx
import { json, redirect } from "@remix-run/node";
import { useActionData, Form, useSearchParams } from "@remix-run/react";

export const action = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const remember = form.get("remember");

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return json({ error: "Invalid credentials" }, { status: 401 });
  }

  const returnTo =
    new URL(request.url).searchParams.get("returnTo") || "/reports";
  const res = redirect(returnTo);
  return res;
};

export default function LoginPage() {
  const data = useActionData();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/reports";

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Login</h2>
      {data?.error && <p style={{ color: "red" }}>{data.error}</p>}
      <Form method="post">
        <input type="hidden" name="returnTo" value={returnTo} />
        <div>
          <label>Username</label>
          <br />
          <input name="username" />
        </div>
        <div>
          <label>Password</label>
          <br />
          <input name="password" type="password" />
        </div>
        <div>
          <label>
            <input type="checkbox" name="remember" /> Remember me
          </label>
        </div>
        <button type="submit">Sign in</button>
      </Form>
    </div>
  );
}
