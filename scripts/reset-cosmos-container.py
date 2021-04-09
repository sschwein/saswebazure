from azure.cosmos import CosmosClient

# DEV
COSMOS_URI = "https://sschwein-dev-cosmos.documents.azure.com:443/"
COSMOS_KEY = "IZWL048ukGpmT9Lb2sVfORpvSLmf2nUJjOYu9Qbru0TEAAcxXYLmBL62Sx9soM93oQKdkm3bpaA5PwFH2xGPZA=="
# PROD
# COSMOS_URI = "https://sschwein-greenberg-cosmos-prod.documents.azure.com:443/"
# COSMOS_KEY = "pNC4jxY3AQhRJX3biPVmHMT8CdeIubT9QtGkGYOJ7Lk1n1bSTopvB9Zm9jN8VReHWdnFjk0uNPe7faFqJpGmNg=="


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
