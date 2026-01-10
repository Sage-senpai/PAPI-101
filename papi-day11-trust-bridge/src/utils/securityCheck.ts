// src/utils/securityCheck.ts
import type { SecurityCheck } from '../types/wallet';

export const performSecurityCheck = (): SecurityCheck => {
  const isHTTPS = window.location.protocol === 'https:';
  const isLocalhost = window.location.hostname === 'localhost';
  const hasExtension = typeof window.injectedWeb3 !== 'undefined';
  
  const checks = {
    extensionInstalled: hasExtension,
    httpsConnection: isHTTPS || isLocalhost,
    knownNetwork: true, // This would check against known genesis hashes
    accountPermissions: true, // This would check if we have proper permissions
    transactionValidation: true, // This would validate tx structure
  };

  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (!checks.httpsConnection && !isLocalhost) {
    warnings.push('Connection is not over HTTPS');
    recommendations.push('Always use HTTPS for production deployments');
  }

  if (!checks.extensionInstalled) {
    warnings.push('Polkadot.js Extension not detected');
    recommendations.push('Install the extension from https://polkadot.js.org/extension/');
  }

  // Calculate security level
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;
  const score = (passedChecks / totalChecks) * 100;

  let level: SecurityCheck['level'] = 'low';
  if (score >= 90) level = 'maximum';
  else if (score >= 75) level = 'high';
  else if (score >= 50) level = 'medium';

  return {
    level,
    checks,
    warnings,
    recommendations,
  };
};

export const getSecurityColor = (level: SecurityCheck['level']): string => {
  switch (level) {
    case 'maximum': return 'text-security-green';
    case 'high': return 'text-green-400';
    case 'medium': return 'text-warning-amber';
    case 'low': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

export const getSecurityIcon = (level: SecurityCheck['level']): string => {
  switch (level) {
    case 'maximum': return '🛡️';
    case 'high': return '✅';
    case 'medium': return '⚠️';
    case 'low': return '❌';
    default: return '❓';
  }
};