# Bank Statement and Credit Card Invoice Parser

## Overview

The Bank Statement and Credit Card Invoice Parser is a collection of scripts designed to automate the process of parsing bank statements and credit card invoices - initially just from Itaú (a Brazilian bank) in PDF format. The parsed data is then organized and stored in a Notion database for easy access and analysis.

## Features

- Bank Statement Parsing: Extract transaction details, dates, amounts, and other relevant information from Itaú bank statements in PDF format.
- Credit Card Invoice Parsing: Extract credit card transactions, capturing details, due dates, and payment amounts from Itaú credit card invoice in PDF format.
- Notion Integration: Store the parsed data in a Notion database for convenient organization and analysis.
- Customization: The scripts are designed to be adaptable and customizable to suit your specific requirements.

## Getting Started

Follow these steps to get started with using and contributing to the project:

1. Clone the Repository: git clone https://github.com/silventino/bank2notion
2. Install Dependencies: Install the required dependencies by running: `npm i`
3. Create a `.env` file and fill in the information:

   - NOTION_TOKEN ([more info here](https://developers.notion.com/reference/create-a-token))
   - NOTION_CARD_DATABASE_ID (the project expect that the database have the properties "Name", "Value", "Tags", "Date" and [here's how to get the database ID](https://developers.notion.com/reference/retrieve-a-database#:~:text=To%20find%20a%20database%20ID,a%2032%20characters%20alphanumeric%20string.))

   - NOTION_BANK_DATABASE_ID (the project expect that the database have the properties "Name", "Value", "Tags", "Date" and [here's how to get the database ID](https://developers.notion.com/reference/retrieve-a-database#:~:text=To%20find%20a%20database%20ID,a%2032%20characters%20alphanumeric%20string.))

4. Run the Scripts: Execute the scripts using:
   - node parseCardInvoice.js path/to/file.pdf
   - node parseBankStatement.js path/to/file.pdf
5. Check the Notion Database: Once parsed, the data will be available in your Notion database.

## Contributing

We welcome contributions from the community to enhance this project. If you'd like to contribute:

1. Fork the repository and create your branch: git checkout -b feature/new-feature
2. Make your changes and commit them: git commit -am 'Add new feature'
3. Push to the branch: git push origin feature/new-feature
4. Submit a pull request detailing your changes.

## Contact

If you have questions, suggestions, or need assistance, feel free to contact me at silventino.dev@gmail.com

## License

This project is licensed under the MIT License.
