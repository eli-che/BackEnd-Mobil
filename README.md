# BackEnd
To start the webserver, inside the projekt folder open a terminal and run: "npm run dev" without the " " citation marks.


# Dokumentera Händelser
:coffee: :pizza: :pizza: :coffee: :smiley: 

#The controll as to which if a user is signed in is in, config/auth.js
#Anything that requires the user be logged in as have ensureAuthenticated in GET and POST.

2019/12/23: Friend System tillagt samt updaterat Validering system. (Kolla commit på detta datum)

2019/12/22: Allt om-kodat till cassandra databas. Inkluderar (Registering, Login, Logout, Email Validering).

2019/12/16: Ändrat validation token till ett 6 siffrigt tal. Validering funkar nu.

2019/12/15: Lagt till login system och "Validation token" och "Active" status på user database. Validation token ska användas för att verifiera användarens email. Token skickas till användarens email och när han sedan följer länken så kommer hans "Active" status att ändras till true så att personen kan logga in.

2019/12/14: Lagt till grunden med mera. Config, databas connection och registernings system.

Dokumentation saker som ska göras::

#CHANGE THE EMAIL VERIFCATION JUST TO SIMPLE NUMBERS, 
#YOU DONT NEED TO GENERATE A CRAZY LONG STRING
#JUST A NUMBER LIKE 5436, EVEN IF SOMEONE ELSE HAS IT,
#IT WONT MATTER BECAUSE YOU CANT GUESS IT ANYWAYS.

```diff
# Saker som ska implementeras!
- Saker som är klara men problem finns!
+ Saker som är klara och implementerade!

# Change any checks on user.credentials to user.data, don't have to query their login to check if user exists for safety purposes.
- Update time stamp to yyyy-mm-dd hh:mm:ss
- Login Session not persisten on server restart. Users have to loggin again after a restart. Save the session in database.
+ Login System Klart
+ Registering System Klart
+ Email Validering Klart
+ Logout Klart
# Always kill a proccess after it's done retriving data. Like when you retrieve a chat, you dont have to keep the connection up. You re-establish when needed.
- Check that the same email doesn't get registerd just because one has uppercase and the other one lowercase, same goes for username
# Open source AI som förbjuder pornografiskt innehåll från att laddas upp.
# Open source AI som detekterar objektet på kameran, tex om du fotar ett headset "Så ska den sätta den automatiskt på headset samt färg"
```
