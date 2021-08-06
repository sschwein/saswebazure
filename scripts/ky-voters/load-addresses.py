import logging
import json
import os
from azure.cosmos import CosmosClient
from datetime import datetime
from multiprocessing.pool import Pool
from time import sleep
from utils import chunks
from uuid import uuid4


# DEV
# COSMOS_URI = os.environ["DEV_COSMOS_URI"]
# COSMOS_KEY = os.environ["DEV_COSMOS_KEY"]
# PROD
COSMOS_URI = os.environ["PROD_COSMOS_URI"]
COSMOS_KEY = os.environ["PROD_COSMOS_KEY"]


def upsert_cosmos(uri, key, database_name, container_name, doc):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    container.upsert_item(doc)


def query_cosmos(uri, key, database_name, container_name, query):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    items = container.query_items(query, enable_cross_partition_query=True)

    return items


def update_fields(item):
    del item["_rid"]
    del item["_self"]
    del item["_etag"]
    del item["_attachments"]
    del item["_ts"]

    return item


def get_address_list():
    return query_cosmos(
        COSMOS_URI,
        COSMOS_KEY,
        "voters",
        "addresses",
        "SELECT c.address FROM c"
    )


def load_cosmos(address):
    upsert_cosmos(
        COSMOS_URI,
        COSMOS_KEY,
        "voters",
        "addresses",
        address
    )


def format_address(addr):
    addr = json.loads(addr)
    if "selected_address" in addr.keys():
        return {
            "id": str(uuid4()),
            "address": addr["address"],
            "selected_result": addr["selected_address"],
            "results": addr["result"]
        }
    else:
        return {
            "id": str(uuid4()),
            "address": addr["address"],
            "selected_result": addr["result"][0],
            "results": addr["result"]
        }


if __name__ == "__main__":
    logging.getLogger().setLevel(logging.INFO)
    logging.getLogger("azure").setLevel(logging.WARNING)

    existing_addresses = [item["address"] for item in get_address_list()]
    logging.info(f"{len(existing_addresses)} addresses from cosmos")

    addresses = {}
    with open('gps-voters-parallel.jsonl', 'r') as _file:
        for row in _file.readlines():
            row = format_address(row)
            addresses[row["address"]] = row
        logging.info(f"{len(addresses)} addresses from file")

    existing_set = set(existing_addresses)
    new_set = set(addresses.keys())
    addresses_to_load = list(new_set ^ existing_set)

    logging.info(f"{len(addresses_to_load)} addresses remaining")

    start_time = datetime.now()
    for addr in addresses_to_load:
        load_cosmos(addresses[addr])
    # for batch in chunks(addresses_to_load, 5000):
    #     with Pool(30) as pool:
    #         results = pool.map(load_cosmos, batch)

    end_time = datetime.now()
    logging.info(f"Total time taken: {(end_time - start_time).total_seconds()}")
