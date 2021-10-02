import logging
import json
import os
from azure.cosmos import CosmosClient
from datetime import datetime
from multiprocessing.pool import Pool
from utils import chunks


# DEV
# COSMOS_URI = os.environ["DEV_COSMOS_URI"]
# COSMOS_KEY = os.environ["DEV_COSMOS_KEY"]
# PROD
COSMOS_URI = os.environ["PROD_COSMOS_URI"]
COSMOS_KEY = os.environ["PROD_COSMOS_KEY"]
# Impact KY
IMPACTKY_COSMOS_URI = os.environ["IMPACTKY_COSMOS_URI"]
IMPACTKY_COSMOS_KEY = os.environ["IMPACTKY_COSMOS_KEY"]

BATCH_SIZE = 5000
output_file_name = "addresses-2021-10-02.jsonl"
ids_query = "SELECT c.address FROM c"

source_uri = COSMOS_URI
source_key = COSMOS_KEY
source_database = "voters"
source_container = "addresses"

destination_uri = IMPACTKY_COSMOS_URI
destination_key = IMPACTKY_COSMOS_KEY
destination_database = "shared"
destination_container = "addresses"


def trim_item(item):
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


def load_voters(voter):
    try:
        replace_cosmos(
            destination_uri,
            destination_key,
            destination_database,
            destination_container,
            voter["id"],
            voter
        )
    except Exception:
        pass


def query_cosmos(uri, key, database_name, container_name, query):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    items = container.query_items(query, enable_cross_partition_query=True)

    return items


if __name__ == "__main__":
    logging.getLogger().setLevel(logging.INFO)
    logging.getLogger("azure").setLevel(logging.WARNING)

    cosmos_query = query_cosmos(
        source_uri,
        source_key,
        source_database,
        source_container,
        "SELECT TOP 2 * FROM c"
    )

    data = [row for row in cosmos_query]
    with open(output_file_name, 'w') as _file:
        for row in data:
            _file.write(f"{json.dumps(row)}\n")

    for batch in chunks(data, BATCH_SIZE):
        with Pool(30) as pool:
            results = pool.map(load_voters, batch)
