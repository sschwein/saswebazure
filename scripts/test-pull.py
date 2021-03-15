from datetime import datetime
import feedparser
import json

feed = feedparser.parse(
    "https://louisville.legistar.com/Feed.ashx?M=L&ID=12384465&GUID=81fde512-d370-4c08-99fe-2d13e0bef49a&Title=Louisville+Metro+Government+-+Legislation"
)

# print(feed.keys())
# print(json.dumps(feed["entries"][0], indent=2))

for record in feed["entries"]:
    parsed_date = record["published_parsed"]
    record["published_text"] = record["published"]
    record["published"] = datetime(*parsed_date[0:6]).isoformat()
    record["category"] = record["tags"][0]["term"]
    print(record)
    break
