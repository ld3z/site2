import pandas as pd

def on_pre_build(config, **kwargs) -> None:
    df1 = pd.read_csv('https://docs.google.com/spreadsheets/d/1dlWL4NQ0J0wrUJyrlmRMmmG9msarkuZtXOoI5ADLyP4/gviz/tq?tqx=out:csv&sheet=spezi&gid=1214029714&headers=0&range=D8:K33')
    df2 = pd.read_csv('https://docs.google.com/spreadsheets/d/1dlWL4NQ0J0wrUJyrlmRMmmG9msarkuZtXOoI5ADLyP4/gviz/tq?tqx=out:csv&sheet=spezi&gid=1214029714&headers=0&range=A8:B33')
    df1.dropna(axis="columns", how="all", inplace=True)
    df2.dropna(axis="columns", how="all", inplace=True)
    df1.merge(df2, how="left")
    df1.to_csv("docs/pf_assault_rifles.csv", index=False)