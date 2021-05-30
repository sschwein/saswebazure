import azure.functions as func
import feedparser
import logging
import os
from __app__.utils import write_to_cosmos, query_cosmos, generate_uuid
from datetime import datetime
from time import sleep


def main(rssTimer: func.TimerRequest):
    logging.getLogger("azure").setLevel(logging.WARNING)
    logging.info("starting rss item timer function")

    items = query_cosmos(
        os.environ["COSMOS_URI"],
        os.environ["COSMOS_KEY"],
        "metro",
        "rss-feed",
        "SELECT * FROM c WHERE c.is_processed = 0 OFFSET 0 LIMIT 25"
    )

    for item in items:
        link_params = [row.split("=") for row in item["link"].split("?")[1].split("&")]
        item_id = ""
        item_guid = ""
        for link_param in link_params:
            if link_param[0] == "ID":
                item_id = link_param[1]
            elif link_param[0] == "GUID":
                item_guid = link_param[1]

        item_link = f"https://louisville.legistar.com/Feed.ashx?M=LD&ID={item_id}&GUID={item_guid}"

        feed = feedparser.parse(item_link)

        for record in feed["entries"]:
            parsed_date = record["published_parsed"]
            record["published_text"] = record["published"]
            record["published"] = datetime(*parsed_date[0:6]).isoformat()
            record["pdfs_pulled"] = 0
            record["external_id"] = record["id"]
            record["id"] = generate_uuid()
            record["title"] = item["title"]

            write_to_cosmos(
                os.environ["COSMOS_URI"],
                os.environ["COSMOS_KEY"],
                "metro",
                "rss-item",
                record
            )

        item["is_processed"] = 1
        write_to_cosmos(
            os.environ["COSMOS_URI"],
            os.environ["COSMOS_KEY"],
            "metro",
            "rss-feed",
            item
        )

        sleep(5)
