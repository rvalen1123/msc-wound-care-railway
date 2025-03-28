# MSC Wound Care IVR Form

This repository contains a web application for the MSC Wound Care Insurance Verification Request (IVR) Form. It's designed to be deployed on Railway.app and integrated with n8n for workflow automation.

## Features

- Interactive multi-step form for insurance verification requests
- Product education request form
- Integration with n8n for automated processing
- Signature capture functionality
- Responsive design

## Tech Stack

- Node.js
- Express.js
- HTML/CSS/JavaScript

## Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/rvalen1123/msc-wound-care-railway.git
   cd msc-wound-care-railway
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables (create a `.env` file):
   ```
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/msc-ivr-form
   PORT=3000
   ```

4. Run the application:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Deploying to Railway

1. Install the Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize and link your project:
   ```bash
   railway init
   # Or link to an existing project
   railway link
   ```

4. Set environment variables:
   ```bash
   railway variables set N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/msc-ivr-form
   ```

5. Deploy your application:
   ```bash
   railway up
   ```

6. To get your deployment URL:
   ```bash
   railway domain
   ```

## Setting up n8n Integration

1. In your n8n instance, create a new workflow
2. Add a Webhook node as the trigger
3. Configure it to accept POST requests
4. Copy the webhook URL from n8n
5. Set this URL as the `N8N_WEBHOOK_URL` environment variable in Railway

## Directory Structure

- `/public` - Contains the HTML form and static assets
- `index.js` - Express server that serves the form and proxies submissions to n8n

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request
