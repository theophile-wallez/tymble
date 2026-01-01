"""
Hardcoded seed data for instruments.
These are used as fallbacks and search terms for dynamic fetching.
"""

# Fallback static list (MSCI World top holdings + popular stocks)
STATIC_SYMBOLS = [
    # US Mega caps
    'NVDA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'GOOG', 'META', 'TSLA', 'LLY', 'AVGO',
    'JPM', 'V', 'UNH', 'XOM', 'MA', 'JNJ', 'PG', 'HD', 'COST', 'ABBV',
    'MRK', 'CRM', 'NFLX', 'AMD', 'ADBE', 'PEP', 'KO', 'WMT', 'BAC', 'TMO',
    'CSCO', 'ACN', 'ORCL', 'CVX', 'MCD', 'ABT', 'INTC', 'IBM', 'DIS', 'QCOM',
    'NKE', 'PFE', 'CAT', 'GE', 'INTU', 'ISRG', 'AMAT', 'NOW', 'BKNG', 'GS',
    # Large caps
    'MS', 'BLK', 'SCHW', 'AXP', 'SPGI', 'CB', 'MMC', 'PNC', 'USB', 'TFC',
    'DE', 'UPS', 'RTX', 'HON', 'LMT', 'BA', 'GD', 'NOC', 'FDX',
    'MDLZ', 'CL', 'KMB', 'GIS', 'K', 'HSY', 'MKC', 'SJM',
    'NEE', 'DUK', 'SO', 'D', 'AEP', 'XEL', 'ED', 'EXC',
    # Popular tech
    'PLTR', 'UBER', 'ABNB', 'SNOW', 'SQ', 'SHOP', 'COIN', 'HOOD', 'RBLX', 'U',
    'NET', 'DDOG', 'ZS', 'CRWD', 'OKTA', 'MDB', 'TEAM', 'WDAY', 'VEEV', 'SPLK',
    'PANW', 'FTNT', 'ZM', 'DOCU', 'TWLO',
    # EV & Clean Energy
    'RIVN', 'LCID', 'FSR', 'PLUG', 'FCEL', 'ENPH', 'SEDG', 'RUN',
    # Biotech
    'MRNA', 'REGN', 'VRTX', 'GILD', 'BIIB', 'AMGN', 'ILMN',
    # Meme / Retail favorites
    'GME', 'AMC', 'BB', 'SOFI', 'UPST', 'AFRM',
]

# Core ETFs (guaranteed to be added)
CORE_ETFS = [
    'SPY', 'VOO', 'QQQ', 'IWM', 'VTI', 'DIA', 'EFA', 'VWO', 'BND', 'AGG',
    'GLD', 'SLV', 'XLK', 'XLF', 'XLE', 'XLV', 'ARKK', 'SCHD', 'VYM', 'TLT',
]

# Core stocks (guaranteed to be added)
CORE_STOCKS = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'JPM', 'V', 'UNH',
    'BABA', 'TSM', 'ASML.AS', 'MC.PA', 'NESN.SW', 'SAP.DE', 'NVO', 'SHEL', 'AZN',
]

# Search terms for ETFs
ETF_SEARCHES = [
    # Broad categories
    'S&P 500 ETF', 'Nasdaq ETF', 'Total market ETF',
    'Bond ETF', 'Treasury ETF', 'Corporate bond ETF',
    'Dividend ETF', 'Growth ETF', 'Value ETF',
    'Small cap ETF', 'Mid cap ETF', 'Large cap ETF',
    # Sectors
    'Technology ETF', 'Healthcare ETF', 'Financial ETF',
    'Energy ETF', 'Real estate ETF', 'Utilities ETF',
    'Consumer ETF', 'Industrial ETF', 'Materials ETF',
    # Thematic
    'AI ETF', 'Semiconductor ETF', 'Cloud ETF',
    'Clean energy ETF', 'Solar ETF', 'EV ETF',
    'Biotech ETF', 'Cybersecurity ETF', 'Blockchain ETF',
    'Robotics ETF', 'Gaming ETF', 'Cannabis ETF',
    # International
    'Europe ETF', 'Japan ETF', 'China ETF',
    'Emerging markets ETF', 'International ETF',
    'Brazil ETF', 'India ETF', 'Mexico ETF',
    # Fixed Income
    'High yield ETF', 'Municipal bond ETF', 'TIPS ETF',
    # Commodity
    'Gold ETF', 'Silver ETF', 'Oil ETF', 'Commodity ETF',
    # Strategy
    'Leveraged ETF', 'Inverse ETF', 'Volatility ETF',
    'Momentum ETF', 'Low volatility ETF', 'Quality ETF',
]

# Search terms for stocks
STOCK_SEARCHES = [
    # US companies by sector
    'Apple', 'Microsoft', 'Google', 'Amazon', 'Meta', 'Tesla', 'Nvidia',
    'JPMorgan', 'Goldman Sachs', 'Bank of America', 'Visa', 'Mastercard',
    'Johnson Johnson', 'Pfizer', 'Merck', 'UnitedHealth', 'Eli Lilly',
    'Exxon', 'Chevron', 'ConocoPhillips',
    'Coca Cola', 'PepsiCo', 'Walmart', 'Costco', 'Home Depot',
    'Boeing', 'Lockheed Martin', 'Caterpillar', 'General Electric',
    'Netflix', 'Disney', 'Comcast', 'Warner Bros',
    # Popular tech
    'Palantir', 'Snowflake', 'Datadog', 'CrowdStrike', 'MongoDB',
    'Uber', 'Airbnb', 'DoorDash', 'Coinbase', 'Robinhood',
    # International
    'Toyota', 'Sony', 'Samsung', 'TSMC', 'Alibaba', 'Tencent',
    'LVMH', 'Nestle', 'ASML', 'SAP', 'Siemens', 'Shell', 'AstraZeneca',
    'Novo Nordisk', 'HSBC', 'BHP', 'Rio Tinto',
    'Royal Bank Canada', 'Shopify', 'MercadoLibre',
    # EV & New Energy
    'Rivian', 'Lucid', 'NIO', 'BYD', 'Enphase', 'First Solar',
]

# Cryptocurrencies
CRYPTO_SYMBOLS = [
    'BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD',
    'DOGE-USD', 'AVAX-USD', 'DOT-USD', 'MATIC-USD', 'LINK-USD', 'UNI-USD',
    'ATOM-USD', 'LTC-USD', 'BCH-USD', 'NEAR-USD', 'APT-USD', 'OP-USD',
    'ARB-USD', 'SHIB-USD', 'PEPE-USD',
]
