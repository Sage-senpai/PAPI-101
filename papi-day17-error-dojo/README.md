# Day 17: PAPI Error Handling Dojo

A comprehensive error handling and validation studio that demonstrates PAPI's powerful validation system with clear error messages and helpful suggestions.

## 🎯 Features

### **Error Handling Capabilities**
- ✅ **Real-time Validation**: Validate transaction data as you type
- ✅ **Clear Error Messages**: Human-readable errors with specific details
- ✅ **Auto-Fix Suggestions**: Get actionable suggestions to fix errors
- ✅ **Error Examples**: Learn from common error patterns
- ✅ **Recovery Patterns**: Implement robust error recovery strategies

### **Validation Levels**
1. **TypeScript Level**: Catch errors at compile time
2. **Runtime Level**: Validate before transaction creation
3. **Schema Level**: Validate against runtime metadata
4. **Format Level**: Check addresses, amounts, and data formats

### **Technical Features**
- Zod schema validation for robust type checking
- Real-time validation with debouncing
- Error categorization (critical/warning/info)
- Auto-fix suggestions for common errors
- Mock PAPI validation engine for demonstration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone/download the project files
cd papi-day17-error-dojo

# Install dependencies
npm install

# Generate PAPI types (optional for demo)
npm run papi

# Start development server
npm run dev