'use client';

import { useState } from 'react';

export default function ROIProjector() {
  const [mode, setMode] = useState<'postal' | 'zip' | 'region'>('postal');
  const [areaType, setAreaType] = useState<'rural' | 'urban' | 'city'>('rural');
  const [invitedMembers, setInvitedMembers] = useState(200);
  const [inviteMultiplier, setInviteMultiplier] = useState(100);
  const [monthlySpend, setMonthlySpend] = useState(200);
  const [landValue, setLandValue] = useState(0);

  const recalculateLandValue = () => {
    let baseLand = 0;
    if (mode === 'postal') baseLand = getRandomInt(50, 100);
    if (mode === 'zip') baseLand = getRandomInt(3000, 7000);
    if (mode === 'region') baseLand = getRandomInt(500, 1500);

    let percent = 1;
    if (mode === 'postal') {
      if (areaType === 'rural') percent = 0.25;
      if (areaType === 'urban') percent = 0.5;
      if (areaType === 'city') percent = 1;
    }
    if (mode === 'zip') {
      if (areaType === 'rural') percent = 0.25;
      if (areaType === 'urban') percent = 0.5;
      if (areaType === 'city') percent = 1;
    }
    if (mode === 'region') {
      if (areaType === 'rural') percent = 0.1;
      if (areaType === 'urban') percent = 0.3;
      if (areaType === 'city') percent = 1;
    }

    setLandValue(baseLand * percent);
  };

  const secondHandInvites = invitedMembers * (inviteMultiplier / 100) * invitedMembers;

  function calcGPFromBrackets(count: number): number {
    const totalBracketRevenue =
      (count * 0.05 * 99.95) +
      (count * 0.15 * 24.95) +
      (count * 0.30 * 9.95) +
      (count * 0.50 * 2.95);
    return totalBracketRevenue * 0.5;
  }

  const gpFirstHand = calcGPFromBrackets(invitedMembers);
  const gpSecondHand = calcGPFromBrackets(secondHandInvites);

  const membershipFirst = gpFirstHand * 0.21;
  const membershipSecond = gpSecondHand * 0.03;

  const businessFirst = invitedMembers * monthlySpend * 0.5 * 0.21;
  const businessSecond = secondHandInvites * monthlySpend * 0.25 * 0.03;

  const landlordShareOneTime = ((businessFirst + businessSecond) * 0.5 * 0.25) * 0.02;

  const totalGrossRevenue = (invitedMembers + secondHandInvites) * monthlySpend;
  const netRevenue = totalGrossRevenue * 0.5;
  const preLandSaleRevenue = netRevenue * 0.25;
  const totalPreLandSaleReturn = preLandSaleRevenue * 0.02;
  const preFirstHand = totalPreLandSaleReturn * (invitedMembers / (invitedMembers + secondHandInvites));
  const preSecondHand = totalPreLandSaleReturn * (secondHandInvites / (invitedMembers + secondHandInvites));

  const monthlyLandlordSharedReturns = ((gpFirstHand + gpSecondHand) / 0.5) * 0.25 * 0.02;

  const fullYearProjection =
    landlordShareOneTime +
    (monthlyLandlordSharedReturns * 11) +
    totalPreLandSaleReturn +
    ((membershipFirst + membershipSecond) * 12) +
    ((businessFirst + businessSecond) * 12);
    const modeTooltips = {
      postal: 'Postal code used primarily in Canada to identify specific geographic areas. Average Population 100.',
      zip: 'ZIP code used in the United States for location identification. Average Population 10,000.',
      region: 'Refers to broader administrative or geographic zones such as provinces, states, or districts. Average Population 1,000.',
    };
    
    const areaTooltips = {
      rural: 'Refers to properties or users located in countryside or low-density areas.',
      urban: 'Refers to properties or users located in developed town centers or suburbs.',
      city: 'Refers to properties or users located in large metropolitan city cores.',
    };
    

  return (
    <div className="bg-[#0F172A] min-h-screen flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-[#1E293B] p-6 rounded-xl shadow-lg max-w-6xl w-full grid md:grid-cols-2 gap-6">

        {/* Input Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400">AVG <span className="text-white">INPUT PARAMETERS</span></h2>

          {/* Land Cost Section */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Projected Land Cost</h3>
            <ResultCard
              title="Estimated Land Price"
              value={`$${landValue.toFixed(0)}`}
              color="text-red-400"
              tooltip="Click the button below to generate a land cost estimate based on selected location type and area."
            />
            <button
              onClick={recalculateLandValue}
              className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
            >
              Recalculate Land Cost
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap">
              {['postal', 'zip', 'region'].map(m => (
                <button
                  key={m}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${mode === m ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => setMode(m as 'postal' | 'zip' | 'region')}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {['rural', 'urban', 'city'].map(a => (
                <button
                  key={a}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${areaType === a ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => setAreaType(a as 'rural' | 'urban' | 'city')}
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Slider label="1st Hand Invite Rate" value={invitedMembers} min={1} max={1000} onChange={setInvitedMembers} tooltip={"Take your best guestimate on how many members you will refer."} />
          <Slider label="2nd Hand Invite Rate (%)" value={inviteMultiplier} min={10} max={200} onChange={setInviteMultiplier} />
          <Slider label="Monthly Business ($)" value={monthlySpend} min={1} max={1000} onChange={setMonthlySpend} />

          <div className="bg-gray-800 p-4 text-sm text-gray-300 rounded-md">
            <p className="font-semibold">DISCLAIMER</p>
            <p>
              This financial prediction calculator provides only an estimate based on available data and assumptions.
              It does not guarantee future earnings and should not be considered financial advice. Actual results may vary due
              to market conditions and individual circumstances. Use it as a guide, not a definitive forecast of financial outcomes.
            </p>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-cyan-400">PROJECTED <span className="text-white">RETURNS</span></h2>

          <Section title="BEFORE SEP 1ST">
            <SubSection title="PRE LAND SALE RETURNS">
              <div className="grid grid-cols-2 gap-3">
                <ResultCard
                  title="1st Hand Share"
                  value={`$${businessFirst.toFixed(0)}`}
                  tooltip="Represents 21% of the gross profit generated by referring members who purchase virtual land."
                />
                <ResultCard
                  title="2nd Hand Share"
                  value={`$${businessSecond.toFixed(0)}`}
                  tooltip="Represents 3% of the gross profit generated by referred second hand members."
                />
              </div>
            </SubSection>
          </Section>

          <Section title="AFTER SEP 1ST">
            <SubSection title="LANDLORD SHARE RETURNS">
              <ResultPair
                label1="One Time"
                value1={landlordShareOneTime}
                tooltip1="One-time return after land sale from business activity revenue (2% share)."
                label2="Monthly"
                value2={monthlyLandlordSharedReturns}
                tooltip2="Ongoing return from total member business activity (2% share)."
              />
            </SubSection>
            <SubSection title="MONTHLY MEMBERSHIP RETURNS">
              <ResultPair
                label1="1st Hand Share"
                value1={membershipFirst}
                tooltip1="Monthly income from direct members' subscriptions (21% share)."
                label2="2nd Hand Share"
                value2={membershipSecond / 2}
                tooltip2="Monthly income from indirect members' subscriptions (3% share)."
              />
            </SubSection>
            <SubSection title="MONTHLY BUSINESS RETURNS">
              <ResultPair
                label1="1st Hand Share"
                value1={businessFirst}
                tooltip1="Business revenue share from direct referrals (21%)."
                label2="2nd Hand Share"
                value2={businessSecond}
                tooltip2="Business revenue share from indirect referrals (3%)."
              />
            </SubSection>
          </Section>

          <div className="bg-green-600 p-4 rounded text-center font-bold text-xl">
            1st YEAR PROJECTION: ${fullYearProjection.toFixed(0)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Supporting Components

function Section({ title, className = '', children }) {
  return (
    <div className="space-y-2">
      <h3 className={`text-lg font-bold ${className}`}>{title}</h3>
      {children}
    </div>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="bg-[#334155] p-3 rounded-md">
      <div className="text-sm text-white font-semibold mb-1">{title}</div>
      {children}
    </div>
  );
}

function ResultPair({ label1, value1, tooltip1, label2, value2, tooltip2 }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <ResultCard title={label1} value={`$${value1.toFixed(0)}`} tooltip={tooltip1} />
      <ResultCard title={label2} value={`$${value2.toFixed(0)}`} tooltip={tooltip2} />
    </div>
  );
}

function Slider({ label, value, min, max, onChange ,tooltip}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}: <span className="text-white">{value}</span>
        {tooltip && (
          <div className="relative group">
            <span className="text-yellow-400 cursor-pointer">info</span>
            <div className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded p-2 w-64 left-1/2 -translate-x-1/2 mt-2">
              {tooltip}
            </div>
          </div>
        )}
      </label>
      <input
        type="range"
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function ResultCard({ title, value, subtitle, color, tooltip }) {
  return (
    <div className="bg-[#1e293b] p-3 rounded text-center relative group">
      <div className={`text-xl font-bold ${color || 'text-cyan-300'}`}>{value}</div>
      {title && (
        <div className="text-xs text-white font-semibold mt-1">
          {title}
          {tooltip && (
            <div className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded p-2 w-56 left-1/2 -translate-x-1/2 mt-2">
              {tooltip}
            </div>
          )}
        </div>
      )}
      {subtitle && <div className="text-xs text-green-400 mt-1 font-bold uppercase">{subtitle}</div>}
    </div>
  );
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
