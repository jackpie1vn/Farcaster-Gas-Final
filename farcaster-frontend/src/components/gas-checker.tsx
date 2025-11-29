"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Types matching NEW Python backend response (v2)
interface GasData {
  success: boolean
  username: string
  fid: number | null
  display_name: string | null
  pfp_url: string | null
  primary_wallet: string | null
  total_transactions: number
  total_volume_eth: number
  total_gas_eth: number      // 1% của volume
  total_gas_usd: number      // total_gas_eth × ETH price
  eth_price: number
  error?: string | null
}

// Farcaster icon component
const FarcasterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.24 0.24H5.76C2.58 0.24 0 2.82 0 6v12c0 3.18 2.58 5.76 5.76 5.76h12.48c3.18 0 5.76-2.58 5.76-5.76V6c0-3.18-2.58-5.76-5.76-5.76zM19.52 18c0 .85-.69 1.54-1.54 1.54H6.02c-.85 0-1.54-.69-1.54-1.54V8.31h3.39l.78 2.34h6.7l.78-2.34h3.39V18z" />
  </svg>
)

// Wallet icon
const WalletIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
)

// Search icon
const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

// External link icon
const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

// Heart icon
const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

// Sparkles icon
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
)

// Fuel icon (Gas)
const FuelIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="3" x2="15" y1="22" y2="22" />
    <line x1="4" x2="14" y1="9" y2="9" />
    <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
    <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
  </svg>
)

// Chevron icon
const ChevronIcon = ({ className, direction = "down" }: { className?: string; direction?: "up" | "down" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} transition-transform duration-200 ${direction === "up" ? "rotate-180" : ""}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

// Copy icon
const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

// Check icon
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
)

// Activity icon
const ActivityIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
)

// Dollar icon
const DollarIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

export function GasChecker() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<GasData | null>(null)
  const [showTipModal, setShowTipModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch(`/api/gas?username=${encodeURIComponent(username.trim())}`)
      const result = await response.json()

      if (!result.success) {
        setError(result.error || "Failed to fetch gas data")
      } else {
        setData(result)
      }
    } catch (err) {
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const quickSearch = (name: string) => {
    setUsername(name)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Connected to Farcaster
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Gas Checker
          </h1>

          <p className="text-gray-400 text-lg">
            Discover how much gas any Farcaster user has spent on{" "}
            <span className="text-blue-400">Base</span>
          </p>
        </header>

        {/* Collapsible Product Introduction Card */}
        <div className="mb-6 animate-slideUp">
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="w-full rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-4 flex items-center justify-between hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <SparklesIcon className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-lg font-semibold text-white">What is Gas Checker?</span>
            </div>
            <ChevronIcon className="w-5 h-5 text-gray-400" direction={showAbout ? "up" : "down"} />
          </button>
          
          {showAbout && (
            <div className="mt-2 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 animate-fadeIn">
              <p className="text-gray-300 leading-relaxed mb-4">
                Gas Checker is a powerful tool designed for the Farcaster community. It allows you to 
                look up any Farcaster user and see exactly how much they&apos;ve spent on gas fees (1% of trading volume) 
                on Base L2. Simply enter a username (like <span className="text-purple-400">dwr.eth</span> or <span className="text-purple-400">vitalik.eth</span>) 
                to discover their total gas expenditure in ETH and USD.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <FuelIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">Track Gas Usage</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <WalletIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Primary Wallet Detection</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <FarcasterIcon className="w-4 h-4 text-pink-400" />
                  <span className="text-gray-300">Farcaster Native</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Search Card */}
        <Card className="mb-6 animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <FuelIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle>Farcaster Gas Checker</CardTitle>
                <CardDescription>
                  Check gas spent by any Farcaster user on Base
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Enter username (e.g., dwr.eth)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="gradient" 
                  disabled={loading || !username.trim()}
                  className="px-6"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Checking...
                    </span>
                  ) : (
                    "Check Gas"
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Try:</span>
                {["@dwr.eth", "@vitalik.eth", "@jessepollak"].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => quickSearch(name.slice(1))}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                {error}
              </div>
            )}

            {/* Results Display */}
            {data && (
              <div className="mt-6 space-y-6 animate-fadeIn">
                {/* User Info */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  {data.pfp_url ? (
                    <img
                      src={data.pfp_url}
                      alt={data.display_name || data.username}
                      className="w-16 h-16 rounded-full border-2 border-purple-500/50"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <FarcasterIcon className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {data.display_name || `@${data.username}`}
                    </h3>
                    <p className="text-gray-400">@{data.username} · FID: {data.fid}</p>
                  </div>
                </div>

                {/* Primary Wallet */}
                {data.primary_wallet && (
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <WalletIcon className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Primary Wallet</p>
                          <p className="font-mono text-white">{formatAddress(data.primary_wallet)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyAddress(data.primary_wallet!)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          {copiedAddress === data.primary_wallet ? (
                            <CheckIcon className="w-4 h-4 text-green-400" />
                          ) : (
                            <CopyIcon className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <a
                          href={`https://basescan.org/address/${data.primary_wallet}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <ExternalLinkIcon className="w-4 h-4 text-gray-500" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gas Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Total Volume */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <ActivityIcon className="w-4 h-4 text-blue-400" />
                      <p className="text-sm text-gray-400">Total Volume</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-400">
                      {data.total_volume_eth.toFixed(4)} ETH
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {data.total_transactions} transactions
                    </p>
                  </div>

                  {/* Total Gas (1% of volume) */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <FuelIcon className="w-4 h-4 text-purple-400" />
                      <p className="text-sm text-gray-400">Total Gas (1%)</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">
                      {data.total_gas_eth.toFixed(6)} ETH
                    </p>
                  </div>
                </div>

                {/* Total USD - Full Width */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarIcon className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-400">Total Gas in USD</p>
                      </div>
                      <p className="text-3xl font-bold text-green-400">
                        ${data.total_gas_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">ETH Price</p>
                      <p className="text-lg font-semibold text-gray-300">
                        ${data.eth_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Your Gas Fee Card */}
        <div className="mb-6 animate-slideUp rounded-2xl bg-gradient-to-b from-orange-50 to-orange-100 p-6 shadow-xl border border-orange-200" style={{ animationDelay: "0.2s" }}>
          <div className="text-center mb-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Share Your Gas Fee</h3>
            <p className="text-gray-500 text-sm">
              Share your Gas Fee with others.
            </p>
          </div>
          
          <div className="space-y-3">
            {/* Share Gas Fee Button */}
            <a
              href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`Check your gas fees on Base for your Farcaster wallets using a mini app developed by @jackpie`)}&embeds[]=https://farcaster-gas-checker.vercel.app`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium hover:from-orange-500 hover:to-orange-600 transition-all duration-200 shadow-lg"
            >
              Share Gas Fee
            </a>

            {/* Tip Button */}
            <button
              onClick={() => setShowTipModal(true)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium hover:border-pink-400 hover:text-pink-600 transition-all duration-200"
            >
              Tip <HeartIcon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {/* Tip Modal */}
        {showTipModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
              {/* Close Button */}
              <button
                onClick={() => setShowTipModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tip the Developer
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Send ETH or any token to support development
                </p>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-inner border border-gray-100">
                    <img 
                      src="/qr-wallet.png" 
                      alt="Wallet QR Code"
                      className="w-40 h-40"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-40 h-40 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div className="text-center p-2">
                        <WalletIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Scan QR or copy address</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Address - Compact Single Line */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Wallet Address</p>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <code className="flex-1 text-xs text-gray-700 font-mono truncate">
                      0x760baf2273a08b1365cA89cd2ABD48477BCDaa69
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('0x760baf2273a08b1365cA89cd2ABD48477BCDaa69');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                      {copied ? (
                        <CheckIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <CopyIcon className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Supported Networks */}
                <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Ethereum
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Base
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Polygon
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support the Developer Card */}
        <div className="mb-6 animate-slideUp rounded-2xl bg-white p-6 shadow-xl" style={{ animationDelay: "0.25s" }}>
          <div className="text-center mb-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Support the developer</h3>
            <p className="text-gray-500 text-sm">
              Follow and tip to keep updates coming.
            </p>
          </div>
          
          <div className="space-y-3">
            {/* Follow Button */}
            <a
              href="https://farcaster.xyz/jackpie"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:border-purple-400 hover:text-purple-600 transition-all duration-200"
            >
              Follow @jackpie
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <a
              href="https://farcaster.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              Farcaster
            </a>
            <span>•</span>
            <span>Powered by Neynar</span>
            <span>•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              GitHub
            </a>
          </div>
          <p className="flex items-center justify-center gap-1">
            Built with <HeartIcon className="w-4 h-4 text-pink-500" /> for the Farcaster community
          </p>
        </footer>
      </div>
    </div>
  )
}
