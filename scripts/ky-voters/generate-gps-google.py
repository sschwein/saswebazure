import json
import logging
import os
from azure.cosmos import CosmosClient
from utils import geocode_address

cosmos_query_str = """
    SELECT *
    FROM c
    WHERE c.gps.latitude = null
        OR c.gps.longitude = null
"""

# DEV
# COSMOS_URI = os.environ["COSMOS_URI_PERSONAL_DEV"]
# COSMOS_KEY = os.environ["COSMOS_KEY_PERSONAL_DEV"]
# PROD
COSMOS_URI = os.environ["COSMOS_URI_PERSONAL_PROD"]
COSMOS_KEY = os.environ["COSMOS_KEY_PERSONAL_PROD"]


def update_fields(item):
    del item["_rid"]
    del item["_self"]
    del item["_etag"]
    del item["_attachments"]
    del item["_ts"]

    return item


def replace_cosmos(uri, key, database_name, container_name, doc_id, doc):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    container.replace_item(doc_id, doc)


def query_cosmos(uri, key, database_name, container_name, query):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    items = container.query_items(query, enable_cross_partition_query=True)

    return items


def load_voter(voter):
    replace_cosmos(
        COSMOS_URI,
        COSMOS_KEY,
        "voters",
        "raw-data",
        voter["id"],
        voter
    )


if __name__ == "__main__":
    logging.getLogger().setLevel(logging.INFO)
    logging.getLogger("azure").setLevel(logging.WARNING)

    query = query_cosmos(
        COSMOS_URI,
        COSMOS_KEY,
        "voters",
        "raw-data",
        cosmos_query_str
    )

    data = [update_fields(item) for item in query]
    logging.info(f"total items pulled {len(data)}")
    _cache = {}

    for i, voter in enumerate(data):
        if i % 25 == 0:
            logging.info(f"Starting voter {i}")

        if voter["nominatim_search_string"] in _cache:
            logging.info(f"using cache for {voter['nominatim_search_string']}")
            voter["gps"]["latitude"] = _cache[voter["nominatim_search_string"]]["lat"]
            voter["gps"]["longitude"] = _cache[voter["nominatim_search_string"]]["lng"]
        else:
            lat, lng, data = geocode_address(voter["nominatim_search_string"])
            voter["gps"]["latitude"] = lat
            voter["gps"]["longitude"] = lng
            _cache[voter["nominatim_search_string"]] = {"lat": lat, "lng": lng}

            with open('gps-google-data.jsonl', 'a') as _file:
                _file.write(f"{json.dumps(data)}\n")

        load_voter(voter)
        # break
