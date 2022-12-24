import os
import logging
from azure.cosmos import CosmosClient

logging.getLogger().setLevel(logging.INFO)
logging.getLogger("azure").setLevel(logging.WARNING)

# DEV
# COSMOS_URI = os.environ["DEV_COSMOS_URI"]
# COSMOS_KEY = os.environ["DEV_COSMOS_KEY"]
# PROD
# COSMOS_URI = os.environ["PROD_COSMOS_URI"]
# COSMOS_KEY = os.environ["PROD_COSMOS_KEY"]
# Dev Run With Craig
COSMOS_URI = os.environ["DEV_RUN_COSMOS_URI"]
COSMOS_KEY = os.environ["DEV_RUN_COSMOS_KEY"]
# Prodd Run With Craig
# COSMOS_URI = os.environ["PROD_RUN_COSMOS_URI"]
# COSMOS_KEY = os.environ["PROD_RUN_COSMOS_KEY"]


id_col_name = "id"
partition_col_name = "uuid"
partition_col_name = "PRECINCT"


def query_cosmos(uri, key, database_name, container_name, query):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    items = container.query_items(query, enable_cross_partition_query=True)

    return items


def delete_from_cosmos(uri, key, database_name, container_name, doc_id, partition_key):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    container.delete_item(item=doc_id, partition_key=partition_key)


cosmos_query = query_cosmos(
    COSMOS_URI,
    COSMOS_KEY,
    "data",
    "images",
    "SELECT * FROM c"
)

for i, item in enumerate(cosmos_query):
    delete_from_cosmos(
        COSMOS_URI,
        COSMOS_KEY,
        "data",
        "images",
        item[id_col_name],
        item[partition_col_name]
    )
    if i % 25 == 0:
        logging.info(f'deleted {i} docs')
