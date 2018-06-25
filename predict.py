import urllib3, requests, json

# retrieve your wml_service_credentials_username, wml_service_credentials_password, and wml_service_credentials_url from the
# Service credentials associated with your IBM Cloud Watson Machine Learning Service instance

wml_credentials={
  "url": "https://ibm-watson-ml.mybluemix.net",
  "username": "*****",
  "password": "*****"
}

headers = urllib3.util.make_headers(basic_auth='{username}:{password}'.format(username=wml_credentials['username'], password=wml_credentials['password']))
url = '{}/v3/identity/token'.format(wml_credentials['url'])
response = requests.get(url, headers=headers)
mltoken = json.loads(response.text).get('token')

header = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + mltoken}

array_of_values_to_be_scored = [93,22,163,25,49,'F','N','N',110]


# NOTE: manually define and pass the array(s) of values to be scored in the next line
payload_scoring = {"fields": ["AVGHEARTBEATSPERMIN", "PALPITATIONSPERDAY", "CHOLESTEROL", "BMI", "AGE", "SEX", "FAMILYHISTORY", "SMOKERLAST5YRS", "EXERCISEMINPERWEEK"], "values": [array_of_values_to_be_scored]}

response_scoring = requests.post('https://ibm-watson-ml.mybluemix.net/v3/wml_instances/8da4912b-9ce2-42bc-a31b-14433f8c930d/published_models/acd936c8-ffe5-44fc-9e34-7a128213496e/deployments/f5f3ea67-0a2e-4517-ba70-9e23299a38c4/online', json=payload_scoring, headers=header)

print("----Scoring response----")
parsed = json.loads(response_scoring.text)

for value in parsed['values']:
    confidence = value[11]
    prediction = value[13]
    values = value[14]
    print("Employee Attrition: {}\nConfidence: {}\n".format(prediction,zip(confidence, values)))