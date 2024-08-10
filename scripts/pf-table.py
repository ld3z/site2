import pandas as pd

def on_pre_build(config, **kwargs) -> None:
    df = pd.read_csv('https://docs.google.com/spreadsheets/d/1dlWL4NQ0J0wrUJyrlmRMmmG9msarkuZtXOoI5ADLyP4/gviz/tq?tqx=out:csv&sheet=spezi&gid=1214029714&headers=1')
    df.drop([2, 10, 11, 12], axis=1)
    df.to_csv("docs/pf_data.csv")