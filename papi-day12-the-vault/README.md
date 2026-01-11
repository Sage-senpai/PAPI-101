# 🔐 PAPI The Vault - Day 12 Project

A secure, production-ready web application for private key transaction signing with Polkadot-API (PAPI). Features military-grade security, multiple signing strategies, audit trails, and educational demonstrations of secure key management.

![Day 12/30 - #PAPI30Days](https://img.shields.io/badge/Day-12%2F30-purple)
![License](https://img.shields.io/badge/License-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## 🎯 Features

- **🔑 Secure Key Generation**: Generate SR25519 and ED25519 keypairs with cryptographic randomness
- **💾 Mnemonic Recovery**: Restore keypairs from BIP39 mnemonic phrases
- **✍️ Transaction Signing**: Sign transactions with private keys in secure environment
- **📋 Audit Trail**: Comprehensive logging of all security operations
- **🎨 Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **🔒 Security Best Practices**: Demonstrates production-level security patterns
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI framework
- **TypeScript 5**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Vite**: Lightning-fast build tool

### Blockchain
- **Polkadot-API (PAPI)**: Official Polkadot JavaScript API
- **@polkadot/keyring**: Key management and signing
- **@polkadot/util-crypto**: Cryptographic utilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Basic understanding of blockchain and cryptography

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd papi-day12-the-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
papi-the-vault/
├── src/
│   ├── modules/
│   │   ├── KeyManager.ts          # Key generation and management
│   │   ├── SecureSigner.ts        # Transaction signing logic
│   │   └── AuditLogger.ts         # Audit trail management
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── public/                         # Static assets
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## 💻 Usage Guide

### 1. Generate Keys

**Generate Random Keypair:**
- Select key type (SR25519 or ED25519)
- Click "Generate Random Keypair"
- Your new address and public key will be displayed

**Recover from Mnemonic:**
- Enter your 12 or 24-word mnemonic phrase
- Select key type
- Click "Recover Keypair"

### 2. Sign Transactions

- Generate or recover a keypair first
- Navigate to "Sign Transaction" tab
- Enter recipient address
- Enter amount
- Click "Sign Transaction"
- View signature and verification status

### 3. View Audit Logs

- Navigate to "Audit Logs" tab
- View chronological log of all operations
- See security events, warnings, and errors
- Export logs for compliance reporting

## 🔐 Security Features

### Key Management
- Secure random number generation
- Multiple cryptographic algorithms (SR25519, ED25519)
- BIP39 mnemonic support
- In-memory key storage (not persisted)

### Transaction Signing
- Deterministic message creation
- Cryptographic signature generation
- Automatic signature verification
- Tamper-proof audit trail

### Security Best Practices
- No private keys in localStorage
- No keys committed to version control
- Environment-based configuration
- Comprehensive error handling

## ⚠️ Important Security Notes

### For Educational Use Only

This application is designed for **educational purposes** and demonstrations. It is **NOT suitable for production use** with real funds.

### Never Use With Real Private Keys

- Do not use mainnet keys
- Do not use keys with real funds
- Always use testnet for experimentation

### Production Security Requirements

For production applications, you should:

- Use hardware wallets (Ledger, Trezor)
- Implement hardware security modules (HSM)
- Use air-gapped signing systems
- Follow key rotation policies
- Implement multi-signature schemes
- Use secure key management services
- Maintain comprehensive audit logs
- Implement rate limiting
- Use encrypted storage
- Follow regulatory compliance requirements

## 🧪 Testing

While this is an educational project, you can test the functionality:

1. **Generate Test Keys**: Use the random key generation
2. **Test Signing**: Sign sample transactions
3. **Verify Signatures**: Check that signatures are valid
4. **Review Audit Logs**: Ensure all actions are logged

## 🎓 Educational Objectives

This project demonstrates:

1. **Key Generation**: How to create secure keypairs
2. **Mnemonic Recovery**: BIP39 standard implementation
3. **Digital Signatures**: Cryptographic signing process
4. **Signature Verification**: How to verify signed messages
5. **Audit Trails**: Security event logging
6. **Security Best Practices**: Production-level patterns

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow TypeScript best practices
- Maintain code formatting consistency
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly
- Follow security best practices

## 📚 Learn More

### Polkadot Resources
- [Polkadot Documentation](https://wiki.polkadot.network/)
- [Polkadot-API Docs](https://papi.how/)
- [Substrate Documentation](https://docs.substrate.io/)

### Cryptography
- [BIP39 Specification](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [SR25519 Signature Scheme](https://wiki.polkadot.network/docs/learn-cryptography)
- [ED25519 Signature Scheme](https://ed25519.cr.yp.to/)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web3 Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Polkadot team for excellent documentation
- Web3 Foundation for ecosystem support
- #PAPI30Days community for inspiration
- All contributors and supporters

## 📞 Support

If you encounter issues or have questions:

1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Join the Polkadot community channels
4. Reach out on social media with #PAPI30Days

## 🎯 Day 12/30 Challenge

This project is part of the **30 Days of PAPI** challenge, focusing on mastering Polkadot-API through hands-on projects.

**Day 12 Focus**: Private Key Signing and Security
- Learn secure key management
- Understand cryptographic signing
- Implement audit trails
- Follow security best practices

**Next**: Day 13 will explore multi-signature wallets and threshold signatures!

---

Built with ❤️ by Dvyne (https://x.com/sage_senpeak) for the Polkadot ecosystem | #PAPI30Days #Web3 #Security