import os
import requests

# Fill in your details here to be posted to the login form.
payload = {
    'inUserName': os.environ["ZILLOW_USER"],
    'inUserPass': os.environ["ZILLOW_KEY"]
}

login_url = ""

# Use 'with' to ensure the session context is closed after use.
with requests.Session() as session:
    response = session.post(login_url, data=payload)
    # print the html returned or something more intelligent to see if it's a successful login page.
    print(response.text)

    # An authorised request.
    response = session.get('A protected web page url')
    print(response.text)
