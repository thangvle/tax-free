# Tax-Free Shopify App

An extension-only Shopify app built for tax-free checkout functionality. This app uses Shopify's UI extensions framework to provide tax exemption settings in the admin and display tax-free information during checkout.

## Architecture

This app consists of two main extensions:
- **Checkout UI Extension**: Displays tax-free information during the checkout process
- **Admin Action Extension**: Allows merchants to configure tax-free settings for products

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Package Manager**: Bun
- **Build System**: Shopify CLI
- **UI Libraries**: `@shopify/ui-extensions-react`

---

## Prerequisites

1. **Shopify Partner Account**: [Create one here](https://partners.shopify.com/signup)
2. **Development Store**: Create a development store from your Partner dashboard
3. **Bun**: Install from [bun.sh](https://bun.sh)
4. **Shopify CLI**: Installed globally or via npx

---

## Getting Started

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
bun install

# Install extension dependencies
cd extensions/checkout-ui && bun install
cd ../admin-setting && bun install
```

### 2. Configure Your App

The app configuration is stored in `shopify.app.toml`. Update it with your app details:

```toml
client_id = "your-app-client-id"
name = "tax-free"
```


## Shopify CLI Commands

### Core Development Commands
```bash
shopify app init
```
Start the shopify app init process


#### Start Development Server
```bash
shopify app dev
```
Starts the development server with hot reloading. Extensions are automatically built and deployed to your development store.

**Options:**
- `--reset` - Reset your app configuration (org, app, store)
- `--no-update` - Don't update extension URLs

#### Build Extensions
```bash
shopify app build
```
Builds all extensions for production without starting a dev server.

#### Deploy to Production
```bash
shopify app deploy
```
Deploys your app and extensions to Shopify. You'll be prompted to create a new version.

#### Display App Info
```bash
shopify app info
```
Shows information about your app, including:
- App name and client ID
- Connected store
- Installed extensions
- Configuration details

### Extension Management

#### Generate New Extension
```bash
shopify app generate extension
```
Interactive command to generate a new extension. You'll be prompted to:
1. Select extension type (checkout UI, admin action, etc.)
2. Choose language/framework (TypeScript-React recommended)
3. Name your extension

**Example for creating a new checkout extension:**
```bash
shopify app generate extension
# Select: Checkout UI extension
# Select: TypeScript-React
# Name: product-recommendations
```

#### List Available Extensions
```bash
shopify app extension list
```
Shows all available extension types you can generate.

---

## Project Structure

```
tax-free/
├── extensions/
│   ├── checkout-ui/           # Checkout UI Extension
│   │   ├── src/
│   │   │   └── Checkout.tsx   # Main checkout component
│   │   ├── locales/           # Internationalization files
│   │   ├── package.json       # Extension dependencies
│   │   ├── shopify.extension.toml  # Extension configuration
│   │   └── tsconfig.json      # TypeScript config
│   │
│   └── admin-setting/         # Admin Action Extension
│       ├── src/
│       │   └── ActionExtension.tsx  # Admin settings component
│       ├── locales/
│       ├── package.json
│       ├── shopify.extension.toml
│       └── tsconfig.json
│
├── shopify.app.toml          # App configuration
├── package.json              # Root workspace config
└── README.md
```

---

## Common CLI Workflows

### Switching Development Stores

```bash
shopify app dev --reset
```
Prompts you to select a different store.

### Creating a New Version for Release

```bash
# 1. Build extensions
shopify app build

# 2. Deploy and create version
shopify app deploy

# 3. Go to Partners dashboard to publish
```

### Generating Additional Extensions

```bash
# Generate a new extension
shopify app generate extension

# Common extension types:
# - Checkout UI extension
# - Admin action extension
# - Admin block extension
# - Product subscription extension
# - Theme app extension
```

### Using NPX (Without Global Install)

```bash
# Run any command without installing CLI globally
shopify app dev
shopify app build
shopify app deploy
```

---

## Tax-Free Implementation

### Product Metafields

The app stores tax-free settings in product metafields:

**Namespace**: `tax_free`

**Fields**:
- `exempt` (boolean) - Whether product is tax-exempt
- `threshold` (number_decimal) - Minimum order amount for tax exemption
- `exemption_type` (single_line_text_field) - Type: none/always/threshold/conditional

### Workflow

1. **Merchant** configures tax settings via admin extension
2. **Settings** saved to product metafields
3. **Checkout extension** reads metafields and displays tax info
4. **Customer** sees tax exemption status during checkout

