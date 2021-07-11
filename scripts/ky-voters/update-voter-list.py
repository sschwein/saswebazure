import json
from utils import clean_address, trim_address


def nominatim_address_string(addr):
    trimmed_address = trim_address(addr["street_address"])
    return f'{trimmed_address}; {addr["state"]}, {addr["zip"][:5]}'


def address_string(addr):
    return f'{addr["street_address"]}; {addr["city_address"]}, {addr["state"]} {addr["zip"]}'


def address_string_clean(addr):
    clean_addr = clean_address(addr["street_address"])
    return f'{clean_addr}; {addr["city_address"]}, {addr["state"]} {addr["zip"]}'


def update_voter(voter):
    for row in voter["voting_history"]:
        row.update({
            "primary_code": int(row["primary"]),
            "general_code": int(row["general"])
        })

    voter.update({
        "residence_string_raw": address_string(voter["residence"]),
        "mailing_string_raw": address_string(voter["mailing"]),
        "residence_string_clean": address_string_clean(voter["residence"]),
        "mailing_string_clean": address_string_clean(voter["mailing"]),
        "voting_history": voter["voting_history"],
        "nominatim_search_string": nominatim_address_string(voter["residence"]),
        "estimated_age": 2022 - voter["year_of_birth"],
        "gps": {
            "latitude": None,
            "longitude": None
        }
    })

    del voter["_rid"]
    del voter["_self"]
    del voter["_etag"]
    del voter["_attachments"]
    del voter["_ts"]

    return voter


def join_gps_coords(voters, gps):
    for voter in voters:
        try:
            result = gps[voter["nominatim_search_string"]]
            if 'selected_address' in result.keys():
                coords = {
                    "latitude": result["selected_address"]["lat"],
                    "longitude": result["selected_address"]["lon"],
                }
            else:
                coords = {
                    "latitude": result["result"][0]["lat"],
                    "longitude": result["result"][0]["lon"],
                }
            voter["gps"] = coords
            yield voter
        except KeyError:
            yield voter


if __name__ == "__main__":
    with open('voter-list-remaining.jsonl', 'r') as _file:
        voters = [update_voter(json.loads(row)) for row in _file.readlines()]

    with open('gps-voters-2-parallel.jsonl', 'r') as _file:
        gps = dict()
        for row in _file.readlines():
            row = json.loads(row)
            gps[row["address"]] = row

    with open('voter-list-2-updated.jsonl', 'w') as _file:
        for voter in join_gps_coords(voters, gps):
            _file.write(f"{json.dumps(voter)}\n")
