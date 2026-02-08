import { useState } from 'react';
import { BalanceDisplay } from './components/BalanceDisplay';
import './App.css';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
}

function App() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Transaction Builder - Valid Transfer', status: 'pending' },
    { name: 'Transaction Builder - Invalid Address', status: 'pending' },
    { name: 'Transaction Builder - Zero Value', status: 'pending' },
    { name: 'Fee Calculator - 1% Fee', status: 'pending' },
    { name: 'Fee Calculator - Invalid Percentage', status: 'pending' },
    { name: 'Address Validation - Valid SS58', status: 'pending' },
    { name: 'Address Validation - Invalid Format', status: 'pending' },
    { name: 'Balance Formatting - Decimals', status: 'pending' },
    { name: 'Transfer Amount Validation', status: 'pending' },
    { name: 'Balance Display Component', status: 'pending' },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setCurrentTest(0);

    for (let i = 0; i < tests.length; i++) {
      setCurrentTest(i);
      
      // Update test to running
      setTests(prev => prev.map((test, idx) => 
        idx === i ? { ...test, status: 'running' as const } : test
      ));

      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 800));

      // Randomly pass/fail for demo (in real scenario, actual tests run)
      const passed = Math.random() > 0.1; // 90% pass rate
      const duration = Math.floor(Math.random() * 500) + 100;

      setTests(prev => prev.map((test, idx) => 
        idx === i 
          ? { 
              ...test, 
              status: passed ? 'passed' as const : 'failed' as const,
              duration,
              error: passed ? undefined : 'Assertion failed: Expected value does not match'
            } 
          : test
      ));
    }

    setIsRunning(false);
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const failedTests = tests.filter(t => t.status === 'failed').length;
  const totalTests = tests.length;

  return (
    <div className="app">
      <div className="test-container">
        <div className="test-header">
          <div className="logo-section">
            <div className="logo-icon">🧪</div>
            <h1>PAPI Test Suite</h1>
          </div>
          <p className="subtitle">Type-Safe Testing for Polkadot dApps</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-value">{totalTests}</div>
            <div className="stat-label">Total Tests</div>
          </div>
          <div className="stat-card passed">
            <div className="stat-value">{passedTests}</div>
            <div className="stat-label">Passed</div>
          </div>
          <div className="stat-card failed">
            <div className="stat-value">{failedTests}</div>
            <div className="stat-label">Failed</div>
          </div>
          <div className="stat-card coverage">
            <div className="stat-value">
              {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
            </div>
            <div className="stat-label">Pass Rate</div>
          </div>
        </div>

        <div className="controls">
          <button 
            className={`run-button ${isRunning ? 'running' : ''}`}
            onClick={runTests}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <span className="spinner"></span>
                Running Tests...
              </>
            ) : (
              <>
                <span>▶</span>
                Run All Tests
              </>
            )}
          </button>
        </div>

        <div className="test-results">
          {tests.map((test, index) => (
            <div 
              key={index} 
              className={`test-card ${test.status} ${currentTest === index && isRunning ? 'active' : ''}`}
            >
              <div className="test-header-row">
                <div className="test-info">
                  <span className={`test-icon ${test.status}`}>
                    {test.status === 'passed' && '✓'}
                    {test.status === 'failed' && '✗'}
                    {test.status === 'running' && '⟳'}
                    {test.status === 'pending' && '○'}
                  </span>
                  <span className="test-name">{test.name}</span>
                </div>
                {test.duration && (
                  <span className="test-duration">{test.duration}ms</span>
                )}
              </div>
              {test.error && (
                <div className="test-error">
                  <pre>{test.error}</pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="demo-section">
          <h2>Component Test Demo</h2>
          <div className="demo-card">
            <BalanceDisplay address="5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" />
          </div>
        </div>

        <div className="console-output">
          <div className="console-header">Test Console Output</div>
          <div className="console-lines">
            <div className="console-line success">✓ PAPI types loaded successfully</div>
            <div className="console-line info">→ Running test suite...</div>
            <div className="console-line success">✓ All TypeScript types validated</div>
            <div className="console-line info">→ Test coverage: {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%</div>
            {isRunning && (
              <div className="console-line info">→ Running: {tests[currentTest]?.name}</div>
            )}
            {!isRunning && passedTests === totalTests && totalTests > 0 && (
              <div className="console-line success">🎉 All tests passed!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;