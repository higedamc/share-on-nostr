<script lang="ts">
  import Radio from '@smui/radio';
  import Button, { Label as ButtonLabel } from '@smui/button';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import RadioGrid from '../../lib/RadioGrid.svelte';
  import Snackbar, { ISnackbar } from '../../lib/Snackbar.svelte';
  import Caption from '../../lib/Caption.svelte';
  import { preferences, NostrPostMethods } from './preferences';

  let snackbar: ISnackbar;
  export let pref: Awaited<ReturnType<typeof preferences>>;

  const {
    noteTemplate,
    postMethod,
    nsec,
    relayUrls,
    intentUrl,
    enableContextMenu,
    errors,
    useDefaultNoteTemplate,
    save,
  } = pref;

  async function tryToSave() {
    const result = await save();

    switch (result) {
      case 'success':
        snackbar.show('success', 'Saved successfully!');
        break;
      case 'validation-error':
        snackbar.show('error', 'Some fields are invalid. Please fix.');
        break;
      case 'unknown-error':
        snackbar.show('error', 'Input is appropriate but failed to save. Try again.');
        break;
    }
  }
</script>

<h3>Note Template</h3>
<Caption>{'{url} and {title} can be used as placeholders.'}</Caption>
<Textfield
  textarea
  bind:value={$noteTemplate}
  variant="outlined"
  style="display: block; width: 100%;"
/>
<Button on:click={useDefaultNoteTemplate} variant="outlined" style="margin-top: 0.75em; background-color: purple;">
  <ButtonLabel style="color: white;">Use Default</ButtonLabel>
</Button>

<!-- <h3>Post Method</h3>
<RadioGrid>
  <Radio slot="radio" bind:group={$postMethod} value={NostrPostMethods.nip07} />
  <span slot="label"
    >Post with NIP-07. (Require another NIP-07 extension supporting getRelays().)</span
  >
</RadioGrid> -->
<RadioGrid>
  <Radio slot="radio" bind:group={$postMethod} value={NostrPostMethods.nsec} />
  <span slot="label">Post directly with this extension.</span>
  <Textfield
    bind:value={$nsec}
    disabled={$postMethod !== NostrPostMethods.nsec}
    invalid={!!$errors.nsec}
    variant="outlined"
    label="nsec1... or hex"
    type="password"
    style="width: 100%;"
  >
    <HelperText slot="helper" validationMsg={true}>{$errors.nsec}</HelperText>
  </Textfield>
  <Caption>Each line is to be a relay URL.</Caption>
  <Textfield
    textarea
    bind:value={$relayUrls}
    disabled={$postMethod !== NostrPostMethods.nsec}
    invalid={!!$errors.relayUrls}
    variant="outlined"
    label="Relay URLs"
    style="display: block; width: 100%;"
  >
    <HelperText slot="helper" validationMsg={true}>{$errors.relayUrls}</HelperText>
  </Textfield>
</RadioGrid>
<RadioGrid>
  <Radio slot="radio" bind:group={$postMethod} value={NostrPostMethods.externalApp} />
  <span slot="label">Post using an external web client.</span>
  <Caption>{'Placeholder {text} is required. Optional {url} can be used too.'}</Caption>
  <Textfield
    bind:value={$intentUrl}
    disabled={$postMethod !== NostrPostMethods.externalApp}
    invalid={!!$errors.intentUrl}
    variant="outlined"
    label="URL"
    style="width: 100%;"
  >
    <HelperText slot="helper" validationMsg={true}>{$errors.intentUrl}</HelperText>
  </Textfield>
</RadioGrid>

<h3>Context Menu</h3>
<Caption>
  Allows to access Share on Nostr from context menu. Note that it is not available in NIP-07 mode.
</Caption>
<div>
  <FormField>
    <Checkbox bind:checked={$enableContextMenu} disabled={$postMethod === NostrPostMethods.nip07} />
    <span slot="label">Enable context menu</span>
  </FormField>
</div>

<Button style="width: 100%; margin-top: 2em; background-color: purple;" variant="unelevated" on:click={tryToSave}>
  <ButtonLabel>Save</ButtonLabel>
</Button>

<Snackbar bind:this={snackbar} />

<style lang="scss">
  @use '@material/typography/mdc-typography';

  h3 {
    margin-block-start: 1em;
    margin-block-end: 0.5em;
  }
</style>
