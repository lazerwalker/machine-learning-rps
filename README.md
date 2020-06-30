# Rock-Paper-Scissors-Lizard-Spock Browser Demo

## Deploying this project yourself

1. Fork this repository

2. TODO: Set up Azure Static Web Apps. We need them to replace the basic config with their own settings without wiping out our custom build step — is that a thing? Maybe I need to replace my Actions step with a npm script?

3. [Create your own Azure Cognitive Services](TODO) account.

4. Add two GitHub Secret keys to your repository (Settings -> Secrets). One should be called `COGNITIVE_SERVICES_SUBSCRIPTION_KEY`, and contain one of your Azure Cognitive Services subscription keys (viewable in the Azure Portal once you've set up Cognitive Services). The other should be `COGNITIVE_SERVICES_REGION`, and should contain what region your cognitive services resource should run in (e.g. `eastus`). Note that neural text-to-speech is not available in every region.'

5. If you want to be able to run the app locally, copy the `.env.local.sample` file to `.env.local` and add your keys there as well. Do not commit this file to git. After running `npm install`, you can run a local server to test the app with `npm run dev`.

6. Manually trigger a GitHub Actions build.

You should have a properly-deployed version of the app!
