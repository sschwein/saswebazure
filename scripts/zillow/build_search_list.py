from bs4 import BeautifulSoup, Comment
import requests
import json

saved_search_url = "https://www.zillow.com/homes/for_sale/house_type/3-_beds/1.5-_baths/?searchQueryState=%7B%22pagination%22%3A%7B%7D%2C%22mapBounds%22%3A%7B%22west%22%3A-85.8980020050853%2C%22east%22%3A-85.49631438301499%2C%22south%22%3A38.12318094699425%2C%22north%22%3A38.33946918013198%7D%2C%22mapZoom%22%3A12%2C%22customRegionId%22%3A%22d16b960df5X1-CRz9cr8db45j7i_xsg3j%22%2C%22savedSearchEnrollmentId%22%3A%22X1-SS8fdkrwkfapch0000000000_8gtdr%22%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22price%22%3A%7B%22min%22%3A150000%2C%22max%22%3A350000%7D%2C%22beds%22%3A%7B%22min%22%3A3%7D%2C%22baths%22%3A%7B%22min%22%3A1.5%7D%2C%22sqft%22%3A%7B%22min%22%3A1000%2C%22max%22%3A3000%7D%2C%22con%22%3A%7B%22value%22%3Afalse%7D%2C%22apa%22%3A%7B%22value%22%3Afalse%7D%2C%22mf%22%3A%7B%22value%22%3Afalse%7D%2C%22mp%22%3A%7B%22min%22%3A490%2C%22max%22%3A1143%7D%2C%22ah%22%3A%7B%22value%22%3Atrue%7D%2C%22sort%22%3A%7B%22value%22%3A%22mostrecentchange%22%7D%2C%22land%22%3A%7B%22value%22%3Afalse%7D%2C%22tow%22%3A%7B%22value%22%3Afalse%7D%2C%22manu%22%3A%7B%22value%22%3Afalse%7D%2C%22apco%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%7D"

# response = requests.get(
#     saved_search_url,
#     headers={
#         "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36"
#     }
# )

# with open("page_search.txt", 'wb') as _file:
#     _file.write(response.text.encode("utf-8", "replace"))

with open("page_search.txt", 'rb') as _file:
    text = _file.read().decode("utf-8", "replace")
    soup = BeautifulSoup(text, "lxml")

for element in soup.select("script"):
    element.extract()
for element in soup.select("style"):
    element.extract()
for element in soup(text=lambda it: isinstance(it, Comment)):
    element.extract()

houses = soup.find(id="grid-search-results")

with open("page_search_soup.txt", "w") as _file:
    _file.write(houses.prettify(formatter="html"))

# print(json.dumps(data, indent=4))
