<script>
	import openai from 'openai';
	openai.promise.then((model) => {
		model.engine.setApiKey('');
	});
	console.log('Svelte has been loaded!');
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={() => null}> Option A </button>
<button on:click={() => null}> Option B </button>
