import pandas as pd

def on_pre_build(config, **kwargs) -> None:
    df = pd.read_csv('https://docs.google.com/spreadsheets/d/1dlWL4NQ0J0wrUJyrlmRMmmG9msarkuZtXOoI5ADLyP4/gviz/tq?tqx=out:html&sheet=spezi&gid=1214029714&headers=1&range=D8:K33')
    df.to_csv("docs/pf_assault_rifles.csv")