import { NextAuthConfig } from 'next-auth'
import keycloak from 'next-auth/providers/keycloak'
import jwt from 'jsonwebtoken'
import { getUserInfo } from './keycloak.service'
import config from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'

export const authConfig: NextAuthConfig = {
  theme: { logo: 'https://authjs.dev/img/logo-sm.png' },
  trustHost: true,
  secret: 'secret',
  providers: [
    keycloak({
      allowDangerousEmailAccountLinking: true,
      id: 'keycloak',
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.PUBLIC_AUTH_KEYCLOAK_ISSUER,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          roles: profile.roles ?? [],
        }
      },
    })
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    session: async (temp) => {
      const { session, user } = temp
      if (user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn(data) {
      const payload = await getPayloadHMR({config})
      const userId = data.user.id;
      if (!userId || !data.account?.access_token) {
        return false
      }
      const keycloakRoles = await getUserInfo(data.account.access_token)
      

      await payload.update({
        collection: "users",
        id: userId,
        data: {
          roles: keycloakRoles,
        }
      });
      return true
    },
    authorized: async ({ auth }) => {
      return !!auth
    },
  },
}
