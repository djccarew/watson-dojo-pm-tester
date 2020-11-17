/**
 * Copyright 2020 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

'use strict';

require('dotenv').config({
  silent: true,
});

const express = require('express');
const router = express.Router();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const apiKey = process.env.API_KEY
const deploymentURL = process.env.DEPLOYMENT_URL

router.post('/', function(req, res, next) {
  classify(req, res);
});

function classify(req, res) {
  console.log("Classifying:")
  console.log(req.body);

  getToken((req, res, err) => console.log(err), function () {
    let tokenResponse;
    try {
      tokenResponse = JSON.parse(this.responseText);
    } catch(ex) {
      console.log(ex)
      res.json({errors: [{message: "Cannot parse API token"}]})
    }

    let values;
    const fields = ["AVGHEARTBEATSPERMIN","PALPITATIONSPERDAY","CHOLESTEROL","BMI","AGE","SEX","FAMILYHISTORY","SMOKERLAST5YRS","EXERCISEMINPERWEEK"]
    values = [[req.body.heartbeats,
               req.body.palpitations,
               req.body.cholesterol,
               req.body.bmi,
               req.body.age,
               req.body.gender,
               req.body.familyhistory,
               req.body.smoker,
               req.body.exercise]]
    let payload_json = {"input_data": [{"fields": fields, "values": values}]}
    let payload = JSON.stringify(payload_json);

    console.log("input data");
    console.log(payload);

    apiPost(deploymentURL, tokenResponse.access_token, payload, function (resp) {
      let parsedPostResponse;
      try {
        parsedPostResponse = JSON.parse(this.responseText);
      } catch (ex) {
        console.log(ex)
        res.json({errors: [{message: "Cannot parse API token"}]})
      }
      console.log("Scoring response");
      res.json(parsedPostResponse)
    }, function (error) {
      console.log(error);
      res.json({errors: [{message: error}]})
    });
  });

}

function getToken(errorCallback, loadCallback) {
	const req = new XMLHttpRequest();
	req.addEventListener("load", loadCallback);
	req.addEventListener("error", errorCallback);
	req.open("POST", "https://iam.ng.bluemix.net/identity/token");
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.setRequestHeader("Accept", "application/json");
	req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + apiKey);
}

function apiPost(deploymentURL, token, payload, loadCallback, errorCallback){
	const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", loadCallback);
	oReq.addEventListener("error", errorCallback);
	oReq.open("POST", deploymentURL);
	oReq.setRequestHeader("Accept", "application/json");
	oReq.setRequestHeader("Authorization", "Bearer " + token);
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.send(payload);
}

module.exports = router;
