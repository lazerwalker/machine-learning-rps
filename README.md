# Rock-Paper-Scissors-Lizard-Spock Browser Demo

## Deploying this project yourself

1. Fork this repository.

1. If you don't have it already, install VS Code with the Azure Functions and Live Server extensions.

1. You will need an Azure subscription. [Get one here for free](https://azure.com/free/?WT.mc_id=rpsweb-github-davidsmi) if you don't have one already. 

2. [Set up an Azure Static Web App resource](https://docs.microsoft.com/en-us/azure/static-web-apps/getting-started?tabs=angular&WT.mc_id=rpsweb-github-davidsmi) in a region of your choice. During the setup process, name your Static Web App `rpsweb`, sign into your Github account, and select this forked repository. Note the URL shown after your Static Web App is deployed, but nothing will be live there yet.

TODO: We need them to replace the basic config with their own settings without wiping out our custom build step — is that a thing? Maybe I need to replace my Actions step with a npm script?

3. [Create an Azure Speech Service resource key](https://docs.microsoft.com/azure/cognitive-services/speech-service/get-started?WT.mc_id=rpsweb-github-davidsmi) called `rpskey` in the East US region. (You can choose a different region if you wish, but these instructions assume `eastus`.) Feel free to choose the "Free F0" tier unless you expect your website to get lots of usage. (Note that neural text-to-speech is [available in limited regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions?WT.mc_id=rpsweb-github-davidsmi#standard-and-neural-voices).)

4. Add two GitHub Secret keys to your repository (Settings -> Secrets). One should be called `COGNITIVE_SERVICES_SUBSCRIPTION_KEY`, and contain "Key 1" from your Azure Cognitive Services subscription keys (viewable in the Azure Portal once you've set up Cognitive Services). The other should be `COGNITIVE_SERVICES_REGION`, and should be set to `eastus` unless you created the key in another region. 

5. If you want to be able to run the app locally, copy the `.env.local.sample` file to `.env.local` and add your keys there as well. Do not commit this file to git. After running `npm install`, you can run a local server to test the app with `npm run dev`.

6. Manually trigger a GitHub Actions build.

You should have a properly-deployed version of the app!
