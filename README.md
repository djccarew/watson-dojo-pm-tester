# Deploy a model to predict heart failure with Watson Machine Learning

> **DISCLAIMER**: This application is used for demonstrative and illustrative purposes only and does not constitute an offering that has gone through regulatory review.

This code pattern can be thought of as two distinct parts:

1. A predictive model will be built using AutoAI on IBM Cloud Pak for Data. The model is then deployed to the Watson Machine Learning service, where it can be accessed via a REST API.

2. A Node.js web app that allows a user to input some data to be scored against the previous model.

When the reader has completed this Code Pattern, they will understand how to:

* Build a predictive model with AutoAI on Cloud Pak for Data
* Deploy the model to the IBM Watson Machine Learning service
* Via a Node.js app, score some data against the model via an API call to the Watson Machine Learning service

**Sample output**

Here's an example of what the final web app looks like

![form](doc/images/application.png)

## Architecture

1. The developer creates a [Cloud Pak for Data](https://www.ibm.com/cloud/watson-studio) project.
1. A model is created with AutoAI by uploading some data.
1. Data is backed up and stored on Cloud Object Storage.
1. The model is deployed using the Watson Machine Learning service.
1. A [Node.js](https://nodejs.org/) web app is deployed on IBM Cloud. It calls the predictive model hosted on the Watson Machine Learning service.
1. A user visits the web app, enters their information, and the predictive model returns a response.

!["architecture diagram"](doc/images/architecture.png)

## Prerequisites

* An [IBM Cloud Account](https://cloud.ibm.com)
* An account on [IBM Cloud Pak for Data](https://dataplatform.cloud.ibm.com/).

> **NOTE**: As of 10/16/2020, the Watson Machine Learning service on IBM Cloud is only available in the Dallas, London, Frankfurt, or Tokyo regions. Not the Seoul, Frankfurt, or Sydney regions.

## Steps

1. [Create an IBM Cloud API key](#1-create-an-ibm-cloud-api-key)
1. [Create a new Cloud Pak for Data project](#2-create-a-new-cloud-pak-for-data-project)
1. [Build a model with AutoAI](#3-build-a-model-with-autoai)
1. [Deploy the model with WML](#4-deploy-the-model-with-wml)
1. [Run the Node.js application](#5-the-client-side)

### 1. Create an IBM Cloud API key

To use the Watson Machine Learning service programmatically we'll need an API key. Even though this isn't used until later on, let's create one now.

Navigate to <https://cloud.ibm.com/iam/apikeys> and choose to create a new API key.

![create api key](doc/images/api-1.png)

Give it a name and description, hit OK. Write down the API key somewhere.

![generated api key](doc/images/api-2.png)

### 2. Create a new Cloud Pak for Data project

Log into IBM's [Cloud Pak for Data](https://dataplatform.cloud.ibm.com) service (formally known as Watson Studio). Once in, you'll land on the dashboard.

Create a new project by clicking `Create a project`.

![new project](doc/images/cp4d.png)

Choose an `Empty project`.

![empty project](doc/images/pro-1.png)

Enter a `Name` and associate the project with a `Cloud Object Storage` service.

![empty project](doc/images/pro-2.png)

> **NOTE**: By creating a project in Watson Studio a free tier `Object Storage` service will be created in your IBM Cloud account. Select the `Free` storage type to avoid fees.

At the project dashboard click on the `Assets` tab and upload the data set associated with this repo. [`patientdataV6.csv`](https://raw.githubusercontent.com/IBM/predictive-model-on-watson-ml/master/data/patientdataV6.csv)

![upload data](doc/images/pro-3.png)

### 3. Build a model with AutoAI

Now we're going to build a model from the data using IBM's AutoAI. A tool that will automatically create multiple models and test them, giving us the best result. Data science made easy!

Start by clicking on `Add to project` and choosing `AutoAI experiment`.

![Add to project](doc/images/auto-1.png)

Give it a `Name` and specify a `Watson Machine Learning` instance.

![WML](doc/images/auto-2.png)

Choose to use data from your project.

![Choose data](doc/images/auto-3.png)

Choose the `patientdataV6.csv` option.

![data set](doc/images/auto-4.png)

For the "What do you want to predict?" option, choose `HEARTFAILURE`.

![right column](doc/images/auto-5.png)

The experiment will take a few minutes to run. Once completed hover over the top option to make the `Save as` button appear. Click it.

![experiment](doc/images/auto-6.png)

Choose to save the experiment as a `Model`. You can optionally download a generated Jupyter Notebook that can be used to re-create the steps that were taken to create the model.

![save](doc/images/auto-7.png)

You model will be saved. Click the dialog to view it in your project.

![dialog](doc/images/auto-8.png)

Once you're at the model overview choose the button `Promote to deployment space`.

![promote](doc/images/auto-9.png)

### 4. Deploy the model with WML

To promote the model to deployment you must specify a deployment space. If no space is created choose the `New space +` option to create one. This action will associate the model with the space.

![specify space](doc/images/deploy-1.png)

Navigate to the space using the hamburger menu (`☰`) on the top right and choose to `View all spaces`.

![hamburger](doc/images/deploy-2.png)

Click on the space you saved the model to.

![space](doc/images/deploy-3.png)

Choose the deploy the model by clicking the rocket ship icon.

![deploy](doc/images/deploy-4.png)

Choose the `Online` deployment option and give it a name.

![online](doc/images/deploy-5.png)

Your new deployment will appear.

![new deployment](doc/images/deploy-6.png)

Click on the `API reference` tab and save the `Endpoint`. We'll be using this in our application.

![endpoint](doc/images/deploy-7.png)

### 5. Run the Node.js application

You can deploy this application as a Cloud Foundry application to IBM Cloud by simply clicking the button below. This option will create a deployment pipeline, complete with a hosted Git lab project and devops toolchain.

<p align="center">
    <a href="https://cloud.ibm.com/devops/setup/deploy?repository=https://github.com/IBM/predictive-model-on-watson-ml">
    <img src="https://cloud.ibm.com/devops/setup/deploy/button_x2.png" alt="Deploy to IBM Cloud">
    </a>
</p>

You may be prompted for an *IBM Cloud API Key* during this process. Use the `Create (+)` button to auto-fill this field and the others. Click on the `Deploy` button to deploy the application.

![pipeline](doc/images/cf-1.png)

Before using the application go to the `Runtime` section of the application and in the `Environment variables` tab add in your `API_KEY` and `DEPLOYMENT_URL` values from steps 1 and 4.

> **TIP** Do *NOT* wrap these values with double quotes.

Once updated your application will restart and you can visit the application by clicking on `Visit App URL`.

![env vars](doc/images/cf-2.png)

The app is fairly self-explantory, simply fill in the data you want to score and click on the `Classify` button to test how those figures would score against our model. The model predicts that the risk of heart failure for a patient with these medical characteristics.

![risk](doc/images/application.png)

## License

This code pattern is licensed under the Apache Software License, Version 2.  Separate third party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1 (DCO)](https://developercertificate.org/) and the [Apache Software License, Version 2](http://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache Software License (ASL) FAQ](http://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
