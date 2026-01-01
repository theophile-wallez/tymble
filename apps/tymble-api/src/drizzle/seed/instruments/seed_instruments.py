#!/usr/bin/env python3
"""
Seed instruments using yfinance - fetches popular stocks dynamically.
Run: python seed_instruments.py [--static]

Options:
  --static    Use predefined static list instead of dynamic fetch

Requires:
  pip install yfinance psycopg2-binary python-dotenv
"""

import os
import sys
import time
import json
from datetime import datetime
from urllib.parse import urlparse, parse_qs, urlencode
from dotenv import load_dotenv
import yfinance as yf
import psycopg2
import uuid

from seed_data import (
    STATIC_SYMBOLS,
    CORE_ETFS,
    CORE_STOCKS,
    ETF_SEARCHES,
    STOCK_SEARCHES,
    CRYPTO_SYMBOLS,
)

load_dotenv()


def clean_database_url(url: str) -> str:
    """Remove unsupported query parameters from DATABASE_URL."""
    parsed = urlparse(url)
    allowed_params = {'sslmode', 'connect_timeout', 'application_name'}
    query_params = parse_qs(parsed.query)
    clean_params = {k: v[0] for k, v in query_params.items() if k in allowed_params}
    clean_query = urlencode(clean_params) if clean_params else ''
    return parsed._replace(query=clean_query).geturl()


def fetch_popular_symbols() -> list[str]:
    """Fetch popular stock symbols dynamically from Yahoo Finance."""
    symbols = set()
    
    print("🔍 Fetching popular stocks dynamically...\n")
    
    # 1. Yahoo Finance screeners (requires yfinance >= 0.2.40)
    screeners = [
        'most_actives',
        'day_gainers', 
        'day_losers',
        'undervalued_large_caps',
        'growth_technology_stocks',
    ]
    
    try:
        from yfinance import Screener
        for screener_name in screeners:
            try:
                print(f"  📊 Screener: {screener_name}...")
                screener = Screener()
                screener.set_predefined_body(screener_name)
                result = screener.response
                if result and 'quotes' in result:
                    count = 0
                    for quote in result['quotes'][:100]:
                        if 'symbol' in quote:
                            symbols.add(quote['symbol'])
                            count += 1
                    print(f"     ✅ Found {count} stocks")
                time.sleep(0.3)
            except Exception as e:
                print(f"     ⚠️ Failed: {e}")
    except ImportError:
        print("  ⚠️ Screeners not available (yfinance < 0.2.40), skipping...")
        print("     Run: pip install --upgrade yfinance")
    
    # 2. Dynamically fetch ETFs via search
    print(f"\n  📈 Searching for ETFs...")
    etf_count = 0
    for search_term in ETF_SEARCHES:
        try:
            results = yf.Search(search_term, max_results=20, news_count=0)
            if hasattr(results, 'quotes') and results.quotes:
                for quote in results.quotes:
                    symbol = quote.get('symbol', '')
                    quote_type = quote.get('quoteType', '')
                    if symbol and quote_type == 'ETF':
                        symbols.add(symbol)
                        etf_count += 1
            time.sleep(0.2)
        except Exception:
            pass
    print(f"     ✅ Found {etf_count} ETFs from search")
    
    # Add core ETFs (in case search misses them)
    symbols.update(CORE_ETFS)
    print(f"     ➕ Added {len(CORE_ETFS)} core ETFs")
    
    # 3. Dynamically fetch stocks via search
    print(f"\n  🌍 Searching for stocks...")
    stock_count = 0
    for search_term in STOCK_SEARCHES:
        try:
            results = yf.Search(search_term, max_results=5, news_count=0)
            if hasattr(results, 'quotes') and results.quotes:
                for quote in results.quotes:
                    symbol = quote.get('symbol', '')
                    quote_type = quote.get('quoteType', '')
                    if symbol and quote_type in ('EQUITY', 'STOCK', ''):
                        symbols.add(symbol)
                        stock_count += 1
            time.sleep(0.15)
        except Exception:
            pass
    print(f"     ✅ Found {stock_count} stocks from search")
    
    # Add core stocks
    symbols.update(CORE_STOCKS)
    print(f"     ➕ Added {len(CORE_STOCKS)} core stocks")
    
    # 4. Add cryptocurrencies
    print(f"\n  🪙 Adding cryptocurrencies...")
    symbols.update(CRYPTO_SYMBOLS)
    print(f"     ✅ Added {len(CRYPTO_SYMBOLS)} crypto assets")
    
    final_list = sorted(list(symbols))
    print(f"\n✅ Total unique symbols: {len(final_list)}\n")
    return final_list


def map_quote_type(quote_type: str | None) -> str:
    """Map Yahoo Finance quote type to instrument type."""
    if not quote_type:
        return 'stock'
    qt = quote_type.upper()
    if qt == 'ETF':
        return 'etf'
    if qt in ('CRYPTOCURRENCY', 'CRYPTO'):
        return 'crypto'
    if qt in ('MUTUALFUND', 'BOND'):
        return 'bond'
    return 'stock'


def get_logo_url(info: dict) -> str | None:
    """Extract or construct logo URL from ticker info."""
    if info.get('logo_url'):
        return info['logo_url']
    
    website = info.get('website')
    if website:
        try:
            domain = urlparse(website).netloc.replace('www.', '')
            return f"https://img.logo.dev/{domain}?token=pk_anonymous"
        except Exception:
            pass
    
    return None


def fetch_instrument_data(symbol: str) -> dict | None:
    """Fetch instrument data from Yahoo Finance."""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        if not info or not info.get('shortName'):
            print(f"  ⚠️  No data for {symbol}, skipping")
            return None
        
        # Fields to exclude from metadata (too large or not useful)
        exclude_fields = {
            'companyOfficers',
            'longBusinessSummary',
            'maxAge',
            'messageBoardId',
            'gmtOffSetMilliseconds',
        }
        
        # Store all available info as metadata
        metadata = {
            'source': 'yahoo',
            'lastSyncedAt': datetime.utcnow().isoformat() + 'Z',
        }
        
        # Add all Yahoo Finance fields
        for key, value in info.items():
            if key not in exclude_fields and value is not None:
                if isinstance(value, (int, float, str, bool, list, dict)):
                    metadata[key] = value
        
        # Add logo URL
        logo_url = get_logo_url(info)
        if logo_url:
            metadata['logoUrl'] = logo_url
        
        return {
            'id': str(uuid.uuid4()),
            'symbol': symbol.upper(),
            'name': info.get('longName') or info.get('shortName') or symbol,
            'type': map_quote_type(info.get('quoteType')),
            'exchange': info.get('exchange'),
            'currency': info.get('currency'),
            'metadata': json.dumps(metadata),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
        }
    except Exception as e:
        print(f"  ❌ Failed to fetch {symbol}: {e}")
        return None


def main():
    use_static = '--static' in sys.argv
    
    if use_static:
        print("\n📈 Seeding instruments (static list)...\n")
        symbols = STATIC_SYMBOLS
    else:
        print("\n📈 Seeding instruments (dynamic fetch)...\n")
        symbols = fetch_popular_symbols()
    
    # Connect to database
    db_url = clean_database_url(os.environ['DATABASE_URL'])
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # Get existing symbols
    cur.execute("SELECT symbol FROM instruments")
    existing = {row[0] for row in cur.fetchall()}
    
    inserted = 0
    skipped = 0
    failed = 0
    total = len(symbols)
    
    print(f"📋 Processing {total} symbols ({len(existing)} already in database)...\n")
    
    for i, symbol in enumerate(symbols):
        progress = f"[{i + 1}/{total}]"
        
        if symbol.upper() in existing:
            print(f"{progress} ⏭️  {symbol} already exists")
            skipped += 1
            continue
        
        print(f"{progress} 📥 Fetching {symbol}...")
        data = fetch_instrument_data(symbol)
        
        if data:
            try:
                cur.execute("""
                    INSERT INTO instruments (id, symbol, name, type, exchange, currency, metadata, created_at, updated_at)
                    VALUES (%(id)s, %(symbol)s, %(name)s, %(type)s, %(exchange)s, %(currency)s, %(metadata)s, %(created_at)s, %(updated_at)s)
                    ON CONFLICT (symbol) DO NOTHING
                """, data)
                conn.commit()
                print(f"{progress} ✅ {data['name']}")
                inserted += 1
            except Exception as e:
                conn.rollback()
                print(f"{progress} ❌ Insert failed: {e}")
                failed += 1
        else:
            failed += 1
        
        # Rate limiting
        if i < total - 1:
            time.sleep(0.5)
    
    cur.close()
    conn.close()
    
    print("\n" + "=" * 50)
    print("📊 Seeding complete!")
    print(f"   ✅ Inserted: {inserted}")
    print(f"   ⏭️  Skipped: {skipped}")
    print(f"   ❌ Failed:   {failed}")
    print(f"   📈 Total:    {total}")
    print("=" * 50 + "\n")


if __name__ == '__main__':
    main()
