import json
import os
from azure.cosmos import CosmosClient

# DEV
# COSMOS_URI = os.environ["DEV_COSMOS_URI"]
# COSMOS_KEY = os.environ["DEV_COSMOS_KEY"]
# PROD
COSMOS_URI = os.environ["PROD_COSMOS_URI"]
COSMOS_KEY = os.environ["PROD_COSMOS_KEY"]


def query_cosmos(uri, key, database_name, container_name, query):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    items = container.query_items(query, enable_cross_partition_query=True)

    return items


cosmos_query = query_cosmos(
    COSMOS_URI,
    COSMOS_KEY,
    "voters",
    "raw-data",
    "SELECT * FROM c where NOT IS_DEFINED(c.gps)"
)

with open('voter-list-remaining.jsonl', 'w') as _file:
    for row in cosmos_query:
        _file.write(f"{json.dumps(row)}\n")
