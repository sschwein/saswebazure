import os
from azure.cosmos import CosmosClient

# DEV
COSMOS_URI = os.environ["DEV_COSMOS_URI"]
COSMOS_KEY = os.environ["DEV_COSMOS_KEY"]
# PROD
# COSMOS_URI = os.environ["PROD_COSMOS_URI"]
# COSMOS_KEY = os.environ["PROD_COSMOS_KEY"]


def query_cosmos(uri, key, database_name, container_name, query):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    items = container.query_items(query, enable_cross_partition_query=True)

    return items


def write_to_cosmos(uri, key, database_name, container_name, data):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    container.upsert_item(data)


cosmos_query = query_cosmos(
    COSMOS_URI,
    COSMOS_KEY,
    "metro",
    "rss-feed",
    "SELECT * FROM c where c.is_processed = 1"
)

for i, item in enumerate(cosmos_query):
    item["is_processed"] = 0

    write_to_cosmos(
        COSMOS_URI,
        COSMOS_KEY,
        "metro",
        "rss-feed",
        item
    )
    if i % 25 == 0:
        print(f'reset {i} docs')
