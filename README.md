# Bank 2 Notion

## Description

This is an app that allows you to import the data of your bank PDFs (bank statement or card invoice) to a Notion database.

For now, it only works with the Brazilian banks Nubank and Itaú, but adding more banks is easy and I'm open to pull requests.

To use it, head to [bank2notion.web.app](https://bank2notion.web.app) and follow the instructions. You'll need:

1. A Notion account
2. A Notion integration ([know more](https://developers.notion.com/docs/create-a-notion-integration#create-your-integration-in-notion))
3. A Notion API key ([know more](https://developers.notion.com/docs/create-a-notion-integration#get-your-api-secret))
4. The Notion database ID of the database you'll insert the data ([know more](https://developers.notion.com/reference/retrieve-a-database#:~:text=To%20find%20a%20database%20ID,a%2032%20characters%20alphanumeric%20string.))
5. The PDF you want to import

## Contributing

We welcome contributions from the community to enhance this project. If you'd like to contribute:

1. Fork the repository and create your branch:

```
git checkout -b feature/new-feature
```

2. Make your changes and commit them:

```
git commit -am 'Add new feature'
```

3. Push to the branch:

```
git push origin feature/new-feature
```

4. Submit a pull request detailing your changes.

## Development

This app was built using React, Firebase Hosting, Firebase Functions and Notion API.

## Contact

If you have questions, suggestions, or need assistance, feel free to contact me at silventino.dev@gmail.com

## License

This project is licensed under the MIT License.
