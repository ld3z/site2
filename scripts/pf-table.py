import pandas as pd

def on_pre_build(config, **kwargs) -> None:
    df = pd.read_csv('https://docs.google.com/spreadsheets/d/1dlWL4NQ0J0wrUJyrlmRMmmG9msarkuZtXOoI5ADLyP4/gviz/tq?tqx=out:csv&sheet=spezi&gid=1214029714&headers=1')
    df.dropna(axis="columns", how="all", inplace=True)
    df.drop([1], axis=1)
    df.to_csv("docs/pf_data.csv")