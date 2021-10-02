from bs4 import BeautifulSoup, Comment
import requests
import json

url = "https://www.zillow.com/homedetails/1433-Saint-James-Ct-APT-6-Louisville-KY-40208/73587398_zpid/"

cookies = {
    "abtes": "3|DAJKFaiD9ZHosSwxTw",
    "zguid": "23|%24ccc4c603-1a2f-48e6-bd11-4a0bba954bd1",
    "G_ENABLED_IDPS": "google",
    "userid": "X|3|2f96adcae40c88b5%7C2%7COgb46VX67RjAicHE8X38wI9EovlG97kCRuLlbzq1X5s%3D",
    "_pxvid": "eb90be70-fe2b-11e7-9377-093f70a69f51",
    "zgsession": "1|38ff1c46-2d1a-4b4d-95ad-c2ab0008f69e",
    "loginmemento": "1|37a3626a2652e4561f3e85421cabdadd9748ec6745b15d3755855cc8a50ec4c3",
    "ZILLOW_SID": "1|AAAAAVVbFRIBVVsVErEjyzyrwRwZ24IZtT7n%2FpP6vTtnQwpnWkML3WxhSxbbxaIRxD1yGmCzy5atCzmpM79Q5taLXoYD",
    "JSESSIONID": "7049D5451734FEBFDE15CD461B4846B8",
    "search": "6|1626207907682%7Crect%3D38.231778925245%252C-85.75331585698498%252C38.21969573840544%252C-85.77207181251927%26disp%3Dmap%26mdm%3Dauto%26p%3D1%26sort%3Ddays%26z%3D1%26pt%3Dpmf%252Cpf%26fs%3D1%26fr%3D0%26mmm%3D1%26rs%3D0%26ah%3D0%26singlestory%3D0%26housing-connector%3D0%26abo%3D0%26garage%3D0%26pool%3D0%26ac%3D0%26waterfront%3D0%26finished%3D0%26unfinished%3D0%26cityview%3D0%26mountainview%3D0%26parkview%3D0%26waterview%3D0%26hoadata%3D1%26zillow-owned%3D0%263dhome%3D0%26featuredMultiFamilyBuilding%3D0%09%0975562%09%09%09%09%09%09",
    "intercom-session-xby8p85u": "UTNEeWduMFhMZC9nUElwQWZsaU9tRDVwNk5LUmd1cWMxN0JjWWdCZm83K2RCT0swMkF1YnFYbVRJUnpQbHh3ZC0tRTluU0dwSUdES2VmMnlIc09LMElKdz09--772e874bcb7ee89c7768d3c017c828bcd6959b61",
    "AWSALB": "If6TeN/qA5V86WshbceuHR2xrgCzIM+iCHuzWWmdN8e4e77RrJm8J3EyDb3QrNodjJHZxwyNnv4VD5b/QlDVWEU9/oQ4vyGHVyxX5XI654+S2F67B9DIxumvlK2M",
    "AWSALBCORS": "If6TeN/qA5V86WshbceuHR2xrgCzIM+iCHuzWWmdN8e4e77RrJm8J3EyDb3QrNodjJHZxwyNnv4VD5b/QlDVWEU9/oQ4vyGHVyxX5XI654+S2F67B9DIxumvlK2M"
}


# response = requests.get(
#     url,
#     # cookies=cookies,
#     headers={
#         "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36"
#     }
# )

with open("output.txt", 'rb') as _file:
    text = _file.read().decode("utf-8", "replace")
    soup = BeautifulSoup(text, "lxml")

home_details = soup.find(id="home-details-render")

# for element in home_details.select("script"):
#     element.extract()
for element in home_details.select("style"):
    element.extract()
for element in home_details(text=lambda it: isinstance(it, Comment)):
    element.extract()

home_details_text = home_details.find(id="ds-data-view").find(class_="ds-home-details-chip")
for row in home_details_text.find_all(recursive=False):
    row_text = row.findAll(text=True)
    if any('sqft' in word for word in row_text):
        stats = {
            "price": row_text[0],
            "beds": row_text[1],
            "baths": row_text[4],
            "total_square_footage": row_text[7]
        }
    elif any('KY' in word for word in row_text):
        property_address = row_text
    elif any('Zestimate' in word for word in row_text):
        zestimate = row_text[-1]
    elif any('payment' in word for word in row_text):
        estimated_payment = row_text[-1]

home_overview = soup.find(class_="ds-overview").findAll(text=True)
for i, element in enumerate(home_overview):
    if element == "Time on Zillow":
        time_on_zillow = home_overview[i+1]
    elif element == "Views":
        zillow_views = home_overview[i+1]
    elif element == "Saves":
        zillow_saves = home_overview[i+1]
    elif element == "Read more":
        description = home_overview[i-1]

facts = soup.find(class_="ds-home-facts-and-features").findAll(text=True)
text_xfer = {
    "Type:": "building_type",
    "Year built:": "year_built",
    "Heating:": "heating_type",
    "Cooling:": "cooling_type",
    "Parking:": "parking",
    "HOA:": "hoa",
    "Price/sqft:": "price_sqft",
    "Bedrooms: ": "bedrooms",
    "Bathrooms: ": "bathrooms",
    "Full bathrooms: ": "full_baths",
    "Basement:": "building_type",
    "Laundry features: ": "laundry",
    "Total structure area: ": "total_structure_area",
    "Total interior livable area: ": "interior_livable_area",
    "Finished area above ground: ": "finished_above_ground",
    "Finished area below ground: ": "finished_below_ground",
    "Total number of fireplaces: ": "fireplaces",
    "Fireplace features: ": "fireplace_features",
    "Parking features: ": "parking_features",
    "Entry location: ": "entry_location",
    "Exterior features: ": "exterior_features",
    "Fencing: ": "fencing",
    "Lot features: ": "lot_features",
    "Parcel number: ": "parcel_number",
    "Home type: ": "home_type",
    "Architectural style: ": "architectural_style",
    "Property subType: ": "property_subtype",
    "Construction materials: ": "construction_materials",
    "Foundation: ": "foundation_type",
    "Roof: ": "roof_type",
    "Year built: ": "year_built",
    "Electric utility on property: ": "electric",
    "Sewer information: ": "sewer",
    "Water information: ": "water",
    "Utilities for property: ": "utilities_on_property",
    "Security features: ": "security_features",
    "Community features: ": "community_features",
    "Region: ": "location_region",
    "Subdivision: ": "location_subdivision",
    "Tax assessed value: ": "tax_assessed_value",
    "Annual tax amount: ": "annual_tax_amount",
}
facts_dict = {}

for i, element in enumerate(facts):
    if element in text_xfer:
        facts_dict[text_xfer[element]] = facts[i+1]
    elif "Sun Number" in element:
        facts_dict["sun_number"] = facts[i-1]

data = {
    "property_address": property_address,
    "basic_stats": stats,
    "zestimate": zestimate,
    "estimated_payment": estimated_payment,
    "time_on_zillow": time_on_zillow,
    "zillow_views": zillow_views,
    "zillow_saves": zillow_saves,
    "description": description,
    "facts": facts_dict
}

print(json.dumps(data, indent=4))
