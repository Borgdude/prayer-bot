# prayer-bot
This is an SMS bot powered by Twilio that will allow users to submit a prayer that will be stored in a MongoDB and Google Sheets (soon). In the future, there will be a website that admins can log in to control the bot.
##Installation
Things you need:

* [NodeJS](https://nodejs.org/en/)
* MongoDB Server
* [Twilio](https://www.twilio.com/) account and number

1. Install/setup necessary software
2. Clone respository
3. Run `npm install` in repository
4. Set enviroment variables (See config.json to see what enviroment variables are needed)
5. Set up Twilio number and settings
6. Run `node index.js` to start server
7. See if it works, if not, check Twillo settings, enviroment variables, and console
8. If it works, congragulations. You're done!

#TODO
- Add Google Sheets functionality
- Add web interface
  - Add login and admin
- Go from there
