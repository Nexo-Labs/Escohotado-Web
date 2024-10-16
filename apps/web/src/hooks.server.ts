import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import './startup.js';

Sentry.init({
	dsn: 'https://eb84a43f4e38d0039883b4465367f3c9@o1127559.ingest.us.sentry.io/4507935929139200',
	tracesSampleRate: 1,
	environment: process.env.NODE_ENV || 'development'
});

export const handle = sequence(Sentry.sentryHandle());
export const handleError = Sentry.handleErrorWithSentry();
