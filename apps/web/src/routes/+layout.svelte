<script lang="ts">
	import { Header } from 'gaudi';
	import type { LayoutServerData } from './$types.js';
	import 'gaudi/styles.css';
	import { accountMenuBuilder } from '$lib/domain/header_submenu_model.js';
	import { goto } from '$app/navigation';


	const login = async () => {
		goto('/auth/signin');
	};

	export let data: LayoutServerData;
</script>

<div class="app">
	<Header
		user={data.user}
		menuSectionsLoader={accountMenuBuilder}
		signIn={() => login()}
	/>
	<main>
		<slot />
	</main>
</div>
