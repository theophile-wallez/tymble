export const PORTFOLIO_TYPES = [
  { value: 'PEA', label: 'PEA' },
  { value: 'PEA-PME', label: 'PEA-PME' },
  { value: 'CTO', label: 'CTO (Compte-Titres Ordinaire)' },
  { value: 'PEE', label: 'PEE (Plan Épargne Entreprise)' },
  { value: 'PERCO', label: 'PERCO' },
  { value: 'PER', label: 'PER (Plan Épargne Retraite)' },
  { value: 'ASSURANCE_VIE', label: 'Assurance Vie' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const PROVIDERS = [
  { value: 'trade_republic', label: 'Trade Republic' },
  { value: 'boursobank', label: 'Boursobank' },
  { value: 'degiro', label: 'DEGIRO' },
  { value: 'fortuneo', label: 'Fortuneo' },
  { value: 'bourse_direct', label: 'Bourse Direct' },
  { value: 'saxo', label: 'Saxo Banque' },
  { value: 'interactive_brokers', label: 'Interactive Brokers' },
  { value: 'etoro', label: 'eToro' },
  { value: 'revolut', label: 'Revolut' },
  { value: 'other', label: 'Other' },
] as const;

export const getProviderLabel = (value: string) =>
  PROVIDERS.find((p) => p.value === value)?.label ?? value;

export const getTypeLabel = (value: string) =>
  PORTFOLIO_TYPES.find((t) => t.value === value)?.label ?? value;
