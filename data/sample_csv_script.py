### RULES
# - Format: Date, Description, Amount, Type, Category
# - 5000 rows
# - 12 months
# - 8 categories
# - In a given month, many small debits + a few large credits

import csv
import random
from datetime import datetime, timedelta

# sample csv filename
fname = "sample_data.csv"

# params for adding data in csv
num_trans = 5000
num_months = 12
year = 2026
num_days_month = 30 # assuming all months to be of 30 days
cols = ['Date', 'Description', 'Amount', 'Type', 'Category']
debit_cats = [
    ["Interest-Payments", "Loan Bill", "Credit Card Bill"],
    ["Groceries", "Big Bazar Retail", "Ram's General store", "Fresh Fruits & Veg Co."],
    ["Shopping", "Flipkart", "Amazon Mrktplace"],
    ["Transport", "Uber", "CityFlo", "Ola"],
    ["Utilities", "Wifi-bill", "Electricity", "Gas"],
    ["Take-out", "Zomato", "Swiggy"]
]
credit_cats = ["Salary, Refunds"]
num_trans_per_month = (num_trans // num_months) + 1
rows = []


salary_info = ("Salary credited from CypherSOL", 60000.00)

for month in range(1, num_months + 1):

    # adding credits (1 monthly salary + 1-2 refunds per month, range of 300 - 999)
    num_credits = random.randint(2, 3)
    total_credit_amt = 0.00

    for i in range(num_credits):
        # credit - salary
        if i == 0:
            day = 1
            date_str = f"{year}-{month:02d}-{day:02d}"
            total_credit_amt += salary_info[1]
            rows.append([date_str, salary_info[0], salary_info[1], "CREDIT", "Salary"])

        # other credits - refunds
        else:
            day = random.randint(1, num_days_month)
            date_str = f"{year}-{month:02d}-{day:02d}"
            amt = round(random.uniform(300, 900), 2)
            total_credit_amt += amt
            rows.append([date_str, "Refund credited from Amazon", amt, "CREDIT", "Refund"])

    # Adding DEBITS
    num_debits = num_trans_per_month - num_credits

    for _ in range(num_debits):
        day = random.randint(1, num_days_month)
        date_str = f"{year}-{month:02d}-{day:02d}"
        cat = random.choice(debit_cats)
        cat_descp = random.choice(cat[1:])
        amt = round(random.uniform(200, 2000), 2)
        rows.append([date_str, cat_descp, amt, "DEBIT", cat[0]])

# Sort chronologically
rows.sort(key=lambda x: x[0])

# Export
with open(fname, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(cols)
    writer.writerows(rows)