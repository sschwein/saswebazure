import azure.functions as func
import feedparser
import logging
import os
from __app__.utils import generate_uuid, write_to_cosmos
from datetime import datetime


def main(rssTimer: func.TimerRequest):
    logging.info("starting rss timer function")

    feed = feedparser.parse(
        "https://louisville.legistar.com/Feed.ashx?M=L&ID=12384465&GUID=81fde512-d370-4c08-99fe-2d13e0bef49a&Title=Louisville+Metro+Government+-+Legislation"
    )

    for record in feed["entries"]:
        parsed_date = record["published_parsed"]
        record["published_text"] = record["published"]
        record["published"] = datetime(*parsed_date[0:6]).isoformat()
        record["category"] = record["tags"][0]["term"]
        record["is_processed"] = 0
        record["external_id"] = record["id"]
        record["id"] = generate_uuid()

        try:
            write_to_cosmos(
                os.environ["COSMOS_URI"],
                os.environ["COSMOS_KEY"],
                "metro",
                "rss-feed",
                record
            )
        except Exception as e:
            logging.error(str(e))
            logging.warning("possible duplicate writing rss to cosmos")
            continue
