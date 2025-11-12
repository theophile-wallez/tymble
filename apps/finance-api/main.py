# main.py
import json
from typing import Iterable, List
import pandas as pd
import yfinance as yf

TICKERS: List[str] = ["AAPL"]  # put more tickers here if you want
PERIOD = "1mo"

def normalize_single(df: pd.DataFrame, ticker: str) -> pd.DataFrame:
    """Normalize a single-ticker yahoo DataFrame to clean columns."""
    df = df.reset_index().copy()
    # Some yfinance versions return 'Adj Close' too; keep only what we need if present
    keep = [c for c in ["Date", "Open", "High", "Low", "Close", "Volume"] if c in df.columns]
    df = df[keep]

    df.rename(columns={
        "Date": "date",
        "Open": "open",
        "High": "high",
        "Low": "low",
        "Close": "close",
        "Volume": "volume",
    }, inplace=True)

    df["ticker"] = ticker
    # Nice column order
    cols = ["date", "ticker", "open", "high", "low", "close", "volume"]
    df = df[[c for c in cols if c in df.columns]]
    return df

def normalize_multi(df: pd.DataFrame, tickers: Iterable[str]) -> pd.DataFrame:
    """Normalize a multi-ticker yahoo DataFrame with MultiIndex columns."""
    records = []
    # With group_by='column' (default), level 0 = field, level 1 = ticker
    # Example columns: ('Open','AAPL'), ('High','AAPL'), ...
    for t in tickers:
        sub = df.xs(t, level=1, axis=1).reset_index().copy()
        keep = [c for c in ["Date", "Open", "High", "Low", "Close", "Volume"] if c in sub.columns]
        sub = sub[keep]

        sub.rename(columns={
            "Date": "date",
            "Open": "open",
            "High": "high",
            "Low": "low",
            "Close": "close",
            "Volume": "volume",
        }, inplace=True)

        sub["ticker"] = t
        cols = ["date", "ticker", "open", "high", "low", "close", "volume"]
        sub = sub[[c for c in cols if c in sub.columns]]
        records.append(sub)

    return pd.concat(records, ignore_index=True)

def main():
    # Explicitly set auto_adjust to avoid the FutureWarning
    df = yf.download(
        TICKERS if len(TICKERS) > 1 else TICKERS[0],
        period=PERIOD,
        auto_adjust=False,
        threads=True,
    )

    if isinstance(df.columns, pd.MultiIndex):
        # MultiIndex -> multi-ticker normalization
        clean = normalize_multi(df, tickers=df.columns.get_level_values(1).unique())
    else:
        # Single-index -> single-ticker normalization
        clean = normalize_single(df, ticker=TICKERS[0])

    # Convert to JSON-serializable records (dates -> str)
    records = clean.to_dict(orient="records")

    with open("stocks.json", "w") as f:
        json.dump(records, f, indent=2, default=str)

    print("✅ Data saved to stocks.json")

if __name__ == "__main__":
    main()
