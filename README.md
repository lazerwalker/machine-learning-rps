# Rock-Paper-Scissors-Lizard-Spock Browser Demo

This repository contains code to deploy a web application to detect and announce gestures in the Rock-Paper-Scissors-Lizard-Spock game [created by Sam Kass and Karen Bryla](http://www.samkass.com/theories/RPSSL.html).

It is configured for deployment with [Azure Static Web
Apps](https://docs.microsoft.com/azure/static-web-apps/overview?WT.mc_id=devto-blog-emwalker),
and uses [Neural Text to
Speech](https://docs.microsoft.com/azure/cognitive-services/speech-service/text-to-speech?WT.mc_id=rpsweb-github-davidsmi)
and [Custom
Vision](https://docs.microsoft.com/en-us/azure/cognitive-services/custom-vision-service/home?WT.mc_id=rpsweb-github-davidsmi)
from Azure Cognitive Services.

See [this blog post](https://aka.ms/rpsweb) for more details about this app.

## Deploying this project yourself

1. Fork this repository.

2. In your fork, delete the `.github/workflows` folder.

3. You will need an Azure subscription. [Get one here for free](https://azure.com/free/?WT.mc_id=rpsweb-github-davidsmi) if you don't have one already.

4. [Set up an Azure Static Web App resource](https://docs.microsoft.com/azure/static-web-apps/getting-started?tabs=vanilla-javascript&WT.mc_id=rpsweb-github-davidsmi#create-a-static-web-app) in a region of your choice. During the setup process, name your Static Web App `rpsweb` (or something else if you'd like), sign into your Github account, and select this forked repository.

When prompted to enter various application paths in the "Build" setup tab, leave the defaults for the "App location" and "Api location" fields unchanged, and enter "app" for the "App artifact location". Note the URL shown after your Static Web App is deployed — this is where your site will eventually be, but nothing will be live there yet.

![Build tab in Static Web Apps deployment](img/aswa-build-step.png)

5. [Create an Azure Speech Service resource key](https://docs.microsoft.com/azure/cognitive-services/speech-service/get-started?WT.mc_id=rpsweb-github-davidsmi) called `rpskey` in the East US region. (You can choose a different region if you wish, but these instructions assume `eastus`.) Feel free to choose the "Free F0" tier unless you expect your website to get lots of usage. (Note that neural text-to-speech is [available in limited regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions?WT.mc_id=rpsweb-github-davidsmi#standard-and-neural-voices).) Copy "Key 1" from the "Keys and Endpoint" tab once the resource has been created.

![Finding the Cognitive Services key](img/cogserv-key.png)

6. Add two GitHub Secret keys to your repository (Settings > Secrets). One should be called `COGNITIVE_SERVICES_SUBSCRIPTION_KEY`, and contain "Key 1" from your Azure Cognitive Services subscription keys (which you copied in the last step). The other should be `COGNITIVE_SERVICES_REGION`, and should be set to `eastus` unless you created the key in another region.

![The UI to add a GitHub Secret](img/github-secrets.png)

7. In the GitHub Action file that Azure Static Web Apps has created for you in your project (`.github/workflows/some-filename.yml`), add the following lines in between the "actions/checkout@v2" and "Build and Deploy" steps/code blocks. You can refer to the [yml file in this repo](https://github.com/lazerwalker/neural-tts-sample/blob/main/.github/workflows/azure-static-web-apps-victorious-coast-06aa4f30f.yml#L21-L24) for a reference.

```
      - name: Inject secret keys
        run: |
          sed -i.bak "s/\$(COGNITIVE_SERVICES_SUBSCRIPTION_KEY)/${{ secrets.COGNITIVE_SERVICES_SUBSCRIPTION_KEY}}/" .env
          sed -i.bak "s/\$(COGNITIVE_SERVICES_REGION)/${{ secrets.COGNITIVE_SERVICES_REGION}}/" .env
```

Once you have committed this change, GitHub Actions will automatically attempt to build your app again. If it succeeds (and it should!) then you should be able to see your app live on the Internet!

If you want to be able to run the app locally, copy the `.env.local.sample` file to `.env.local` and add your keys there as well. Do not commit this file to git. After running `npm install`, you can run a local server to test the app with `npm run dev`.

## Customizing the Application

You can tweak the code of this application to change the spoken phrases, and
even what gestures or objects the camera detects. This is a great way to try out
the capabilities of Neural Text to Speech and Custom Vision, and all you need to
do is push changes to the GitHub repository and Static Web Apps will rebuild and
redeploy the application for you. Check out the instructions in
[CUSTOMIZATION.md](CUSTOMIZATION.md) for details.