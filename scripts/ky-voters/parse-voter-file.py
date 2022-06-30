import json
import argparse
import logging
import os
from datetime import date
from azure.cosmos import CosmosClient
from uuid import uuid4

parser = argparse.ArgumentParser()
parser.add_argument('input_file')
parser.add_argument('output_file')

parties = {
    "D": "Democrat",
    "R": "Republican",
    "O": "Other",
    "L": "Libertarian",
    "G": "Green",
    "C": "Constitution",
    "F": "Reform",
    "S": "Socialist Workers",
    "I": "Independent"
}


def generate_uuid():
    return str(uuid4())


def set_voting_history(data):
    data = [
        data[i*4:(i+1)*4]
        for i in range(0, 5)
    ]
    parsed = []

    for row in data:
        parsed.append({
            "election_year": int(f"20{row[0:2]}"),
            "primary": bool(int(row[2])),
            "general": bool(int(row[3]))
        })

    return parsed


def parse_voter(data):
    if data == '':
        return None

    try:
        date_of_registration = date(
            year=int(data[213:217]),
            month=int(data[209:211]),
            day=int(data[211:213])
        ).isoformat()
    except ValueError:
        date_of_registration = date(
            year=1900,
            month=1,
            day=1
        ).isoformat()

    parsed = {
        "county_code": data[0:3].strip(),
        "precinct_code": data[3:7].strip(),
        "city_code": data[7].strip(),
        "last_name": data[8:33].strip(),
        "first_name": data[33:48].strip(),
        "middle_name": data[48:58].strip(),
        "sex": data[58].strip(),
        "party_code": data[59].strip(),
        "party": parties[data[59]],
        "other_code": data[60:63].strip(),
        "residence": {
            "street_address": data[63:103].strip(),
            "city_address": data[103:123].strip(),
            "state": data[123:125].strip(),
            "zip": data[125:134].strip()
        },
        "mailing": {
            "street_address": data[134:174].strip(),
            "city_address": data[174:194].strip(),
            "state": data[194:196].strip(),
            "zip": data[196:205].strip()
        },
        "year_of_birth": int(data[205:209]),
        "date_of_registration": date_of_registration,
        "voting_history": set_voting_history(data[217:237]),
        "inactive": True if data[238] == "*" else False
    }

    return parsed


def write_to_cosmos(uri, key, database_name, container_name, data):
    client = CosmosClient(uri, key)
    database = client.get_database_client(database=database_name)
    container = database.get_container_client(container_name)
    container.upsert_item(data)

    logging.debug(f"Uploaded Cosmos item to {database_name}.{container_name}")


def run(args):
    with open(args.input_file, "rb") as _file:
        voters = [
            parse_voter(row.decode("utf-8"))
            for row in _file.readlines()
        ]

    voters = list(filter(lambda _: _["party_code"] == "D", voters))

    with open(args.output_file, "w") as _file:
        _file.write(json.dumps(voters))

    # for i, voter in enumerate(voters):
    #     voter["uuid"] = generate_uuid()

    #     if i % 100 == 0:
    #         logging.info(f"voters loaded: {i}")

    #     write_to_cosmos(
    #         os.getenv("COSMOS_URI"),
    #         os.getenv("COSMOS_KEY"),
    #         "voters",
    #         "raw-data",
    #         voter
    #     )


if __name__ == "__main__":
    logging.getLogger().setLevel(logging.INFO)
    logging.getLogger("azure").setLevel(logging.WARNING)

    args = parser.parse_args()
    run(args)
