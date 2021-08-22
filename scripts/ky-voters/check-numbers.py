import json

with open('voter-list-full.jsonl', 'r') as _file:
    voters = (json.loads(row) for row in _file.readlines())

count_2019_p = 0
count_2019_g = 0
count_2020_p = 0
count_2020_g = 0

for row in voters:
    if row["party_code"] == "D":
        for year in row["voting_history"]:
            if year["election_year"] == 2019:
                count_2019_p += int(year["primary"])
                count_2019_g += int(year["general"])
            elif year["election_year"] == 2020:
                count_2020_p += int(year["primary"])
                count_2020_g += int(year["general"])

print(f'2019 primary: {count_2019_p}')
print(f'2019 general: {count_2019_g}')
print(f'2020 primary: {count_2020_p}')
print(f'2020 general: {count_2020_g}')
