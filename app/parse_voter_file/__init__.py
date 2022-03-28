import azure.functions as func
import json
import logging
import os
from __app__.utils import read_from_blob, write_to_cosmos, generate_uuid
from datetime import date

PARTIES = {
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


def read_voter_file(uuid):
    voter_file = read_from_blob(
        os.getenv("STORAGE_CONNECTION_STRING"),
        "voter-files",
        uuid
    )
    data = voter_file.readall()

    return data


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
        "party": PARTIES[data[59]],
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
        "other": data[237:].strip()
    }

    return parsed


def main(msg: func.QueueMessage) -> None:
    logging.getLogger("azure").setLevel(logging.WARNING)

    message = json.loads(msg.get_body().decode('utf-8'))
    voter_file = read_voter_file(message["uuid"]).decode("utf-8")
    voters = voter_file.split("\n")

    for row in voters:
        voter = parse_voter(row)
        voter["uuid"] = generate_uuid()

        write_to_cosmos(
            os.getenv("COSMOS_URI"),
            os.getenv("COSMOS_KEY"),
            "voters",
            "raw-data",
            voter
        )

    logging.info(f"Loaded {len(voters)} voters into database")
