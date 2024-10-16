import { SvelteKitAuth, type Session } from '@auth/sveltekit';
import Keycloak from '@auth/sveltekit/providers/keycloak';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import { externalUrl } from './routing.js';
import type {  UserModel, Optional } from 'hegel';
import {  notNull } from 'hegel';

const authjsSecret = env.AUTH_SECRET;

const kcConfig = {
	issuer: externalUrl.keycloak.issuer,
	clientId: env.AUTH_KEYCLOAK_ID,
	clientSecret: env.AUTH_KEYCLOAK_SECRET
};

export const { handle, signIn, signOut } = SvelteKitAuth({
	trustHost: true,
	secret: authjsSecret,
	providers: [Keycloak(kcConfig)],
	callbacks: {
		async session({ session }: any) {
			return session
		}
	}
});

