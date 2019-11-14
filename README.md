# Streamline

**Streamline** is a webapp that helps users find the best streaming service for them. 

The current streaming platform market is flooded, making it hard to decide if a given service will be entertaining _to you_. Fortunately, platforms tend to specialize in ways that make them a _best choice_ for individuals. **Streamline** matches individuals' preferences to platforms' specializations.

Down the line, **Streamline** will partner with streaming platforms to establish a referral system. Referrals to streaming platforms from **Streamline** will generate an operational revenue.

## Getting Started

To get **Streamline** up and running:
1. In project directory, run `npm install`
2. Run `npx browser-sync -s --index '/streamline/index.html' start --serveStatic './streamline/'`

***

The pre-computed report cards are included in this repository. If you would like to re-compute them:
- In the project directory, run `node -r esm report_card/generate_report_card.js`

The report cards would be recomputed regularly in production.

## Architecture

Streamline is made up of three main parts:
- **Webapp**: data collection
- **Report Card Generator**: recomendation and ranking
- **Reporting Store**: AirTable data store for analytics

The **Webapp** is our user's only point of contact. It accepts parameters from the user about content consumption habits, and provides streaming service and title recommendations.

The **Report Card Generator** is our backend system which maintains updated summary statistics about streaming platforms. The generator will run periodically to update the proprietary "report card" for each platform. We use these report cards to match platforms to users.

The **Reporting Store** is where we send data generated by our webapp. Currently, it is represented as an AirTable that keeps a running record of every user's content consumption preferences. This data will grow more valuable as it grows in size-- especially to any streaming platform partners. [You can view our live AirTable here.](https://airtable.com/shrD0JhqBcoPOu4En)