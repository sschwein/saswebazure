import logging
import os
from azure.cosmos import CosmosClient
from datetime import datetime
from multiprocessing.pool import Pool
from utils import chunks

cosmos_query_str = "SELECT * FROM c where c.gps.latitude > '38.37295008285184' or c.gps.latitude < '37.99716815572792' or c.gps.longitude > '-85.94441794520358' or c.gps.longitude < '-85.40531360892128'"

# DEV
# COSMOS_URI = os.environ["DEV_COSMOS_URI"]
# COSMOS_KEY = os.environ["DEV_COSMOS_KEY"]
# PROD
COSMOS_URI = os.environ["PROD_COSMOS_URI"]
COSMOS_KEY = os.environ["PROD_COSMOS_KEY"]


def update_fields(item):
    del item["_rid"]
    del item["_self"]
    del item["_etag"]
    del item["_attachments"]
    del item["_ts"]
    item["gps"]["latitude"] = None
    item["gps"]["longitude"] = None

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


def load_voters(voter):
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

    start_time = datetime.now()
    for batch in chunks(data, 5000):
        with Pool(30) as pool:
            results = pool.map(load_voters, batch)

    end_time = datetime.now()
    logging.info(f"Total time taken: {(end_time - start_time).total_seconds()}")
