import yfinance as yf
import json

TICKERS = ["AAPL", "MSFT", "GOOGL", "META", "AMZN", "TSLA", "NVDA"]
companies = []

for symbol in TICKERS:
    t = yf.Ticker(symbol)
    info = t.info or {}

    company = {
        "ticker": symbol,
        "longName": info.get("longName"),
        "shortName": info.get("shortName"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "country": info.get("country"),
        "city": info.get("city"),
        "state": info.get("state"),
        "website": info.get("website"),
        "logo_url": info.get("logo_url"),

        # Market info
        "exchange": info.get("exchange"),
        "currency": info.get("currency"),
        "marketCap": info.get("marketCap"),
        "trailingPE": info.get("trailingPE"),
        "forwardPE": info.get("forwardPE"),
        "beta": info.get("beta"),
        "dividendYield": info.get("dividendYield"),
        "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh"),
        "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow"),
        "averageVolume": info.get("averageVolume"),

        # Financials
        "totalRevenue": info.get("totalRevenue"),
        "grossProfits": info.get("grossProfits"),
        "ebitda": info.get("ebitda"),
        "netIncomeToCommon": info.get("netIncomeToCommon"),
        "profitMargins": info.get("profitMargins"),
        "revenueGrowth": info.get("revenueGrowth"),
        "earningsGrowth": info.get("earningsGrowth"),
        "returnOnAssets": info.get("returnOnAssets"),
        "returnOnEquity": info.get("returnOnEquity"),

        # Dates
        "lastFiscalYearEnd": info.get("lastFiscalYearEnd"),
        "mostRecentQuarter": info.get("mostRecentQuarter"),

        # Description & management
        "summary": info.get("longBusinessSummary"),
        "fullTimeEmployees": info.get("fullTimeEmployees"),
        "companyOfficers": info.get("companyOfficers"),
    }

    companies.append(company)
    print(f"✅ Collected info for {symbol}")

# Save to file
with open("companies.json", "w") as f:
    json.dump(companies, f, indent=2, default=str)

print("\n📁 Saved full company metadata to companies.json")
