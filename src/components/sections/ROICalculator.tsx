import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Calculator, TrendingDown, ArrowRight, AlertTriangle } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

export function ROICalculator() {
  const [visitors, setVisitors] = useState(2000);
  const [conversion, setConversion] = useState(2);
  const [avgValue, setAvgValue] = useState(150);

  const results = useMemo(() => {
    const currentRevenue = visitors * (conversion / 100) * avgValue;
    const improvedConversion = conversion * 2.5;
    const improvedRevenue = visitors * (improvedConversion / 100) * avgValue;
    const lostRevenue = improvedRevenue - currentRevenue;
    const yearlyLoss = lostRevenue * 12;
    return {
      currentRevenue: Math.round(currentRevenue),
      improvedRevenue: Math.round(improvedRevenue),
      lostRevenue: Math.round(lostRevenue),
      yearlyLoss: Math.round(yearlyLoss),
    };
  }, [visitors, conversion, avgValue]);

  return (
    <section id="roi" className="section-py relative overflow-hidden">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal className="max-w-3xl mb-16">
          <span className="text-sm font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            ROI Calculator
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 mb-4 text-balance">
            How much is your business <span className="text-gradient">losing?</span>
          </h2>
          <p className="text-lg text-ink-500 dark:text-ink-400">
            Calculate the revenue you are missing without a high-converting website.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <Reveal>
            <div className="glass-card p-8 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-brand-500" />
                </div>
                <h3 className="text-lg font-bold text-ink-900 dark:text-white">Your Business</h3>
              </div>

              {/* Visitors */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-ink-600 dark:text-ink-300">Monthly Website Visitors</label>
                  <span className="text-lg font-bold text-ink-900 dark:text-white font-display">{visitors.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="50000"
                  step="100"
                  value={visitors}
                  onChange={(e) => setVisitors(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <div className="flex justify-between text-xs text-ink-400 mt-1">
                  <span>100</span><span>50,000</span>
                </div>
              </div>

              {/* Conversion */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-ink-600 dark:text-ink-300">Current Conversion Rate (%)</label>
                  <span className="text-lg font-bold text-ink-900 dark:text-white font-display">{conversion}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={conversion}
                  onChange={(e) => setConversion(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <div className="flex justify-between text-xs text-ink-400 mt-1">
                  <span>0.5%</span><span>15%</span>
                </div>
              </div>

              {/* Avg Value */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-ink-600 dark:text-ink-300">Avg. Customer Value ($)</label>
                  <span className="text-lg font-bold text-ink-900 dark:text-white font-display">${avgValue}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="2000"
                  step="10"
                  value={avgValue}
                  onChange={(e) => setAvgValue(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <div className="flex justify-between text-xs text-ink-400 mt-1">
                  <span>$10</span><span>$2,000</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Results */}
          <Reveal delay={0.2}>
            <div className="glass-card p-8 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-ink-900 dark:text-white">The Cost of Waiting</h3>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between p-4 rounded-xl bg-ink-100 dark:bg-ink-800">
                  <span className="text-sm text-ink-500 dark:text-ink-400">Current Monthly Revenue</span>
                  <span className="text-xl font-bold text-ink-900 dark:text-white font-display">${results.currentRevenue.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-ink-400">
                  <ArrowRight className="w-5 h-5" />
                  <span className="text-sm">With a Dotcoms website (2.5x conversion)</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10">
                  <span className="text-sm text-green-700 dark:text-green-400 font-medium">Potential Monthly Revenue</span>
                  <span className="text-xl font-bold text-green-700 dark:text-green-400 font-display">${results.improvedRevenue.toLocaleString()}</span>
                </div>

                <motion.div
                  key={results.yearlyLoss}
                  initial={{ scale: 0.95, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-amber-500/10 border border-red-200/50 dark:border-red-900/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">You are losing every year</span>
                  </div>
                  <p className="text-4xl font-bold text-red-600 dark:text-red-400 font-display">
                    ${results.yearlyLoss.toLocaleString()}
                  </p>
                  <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">
                    That is <span className="font-bold text-ink-900 dark:text-white">${results.lostRevenue.toLocaleString()}</span> every month you wait.
                  </p>
                </motion.div>
              </div>

              <a href="#contact" className="btn-primary mt-6 w-full group">
                Stop Losing Revenue
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
