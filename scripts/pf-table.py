import gspread
import pandas as pd

# Open the Google Sheet
sheet = gc.open_by_key('1dlWL4NQ0J0wrUJyrlmRMmmG9msarkuZtXOoI5ADLyP4')

# Fetch data from the specified ranges
data_range1 = sheet.get('A8:B33')
data_range2 = sheet.get('D8:K33')

# Convert data to DataFrames
df1 = pd.DataFrame(data_range1[1:], columns=data_range1[0])  # Assuming the first row is the header
df2 = pd.DataFrame(data_range2[1:], columns=data_range2[0])  # Assuming the first row is the header

# Drop empty columns if needed
df1.dropna(axis="columns", how="all", inplace=True)
df2.dropna(axis="columns", how="all", inplace=True)

# Combine the DataFrames (side by side or vertically depending on your needs)
# Here we are concatenating side by side
combined_df = pd.concat([df1, df2], axis=1)

# Write the combined DataFrame to a CSV file
combined_df.to_csv("docs/combined_data.csv", index=False)
