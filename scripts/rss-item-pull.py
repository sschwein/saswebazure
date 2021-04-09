# import azure.functions as func
import feedparser
import logging
import json
import os
# from __app__.utils import write_to_cosmos, query_cosmos
from datetime import datetime

# https://louisville.legistar.com/Gateway.aspx?M=LD&From=RSS&ID=4907969&GUID=16B8FBE8-DDA2-4134-8C9D-D8B6229470AA
item_id = "4907969"
item_guid = "16B8FBE8-DDA2-4134-8C9D-D8B6229470AA"

item_link = f"https://louisville.legistar.com/Feed.ashx?M=LD&ID={item_id}&GUID={item_guid}"

feed = feedparser.parse(item_link)

print(json.dumps(feed["entries"], indent=4))
